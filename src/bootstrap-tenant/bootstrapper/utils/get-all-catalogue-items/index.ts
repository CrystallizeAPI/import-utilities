import {
  BootstrapperContext,
  EVENT_NAMES,
  getTenantRootItemId,
  removeUnwantedFieldsFromThing,
} from '..'
import { JSONFolder, JSONItem } from '../../../json-spec'
import {
  mergeInTranslations,
  translationFieldIdentifier,
  trFactory,
} from '../multilingual'
import { parseRawItemData } from './parse-raw-item-data'
import { GET_ITEM_CHILDREN, GET_ITEM_QUERY } from './queries'
import {
  buildPathShouldBeIncludedValidator,
  byTreePosition,
  getItemById,
  getOnlyItemsWithPathStartingWith,
  removeUnpublishedFolderFieldIndicator,
  unpublishedFolderFieldIndicator,
} from './utils'

export type ItemsCreateSpecOptions = {
  basePath?: string
  version?: 'published' | 'draft' | 'current'
  setExternalReference?: boolean
  keepOriginalIds?: boolean
  includeDescendantsOfUnpublishedFolders?: boolean // Only needed when version = published
}

export async function getAllCatalogueItems(
  lng: string,
  context: BootstrapperContext,
  options?: ItemsCreateSpecOptions
): Promise<JSONItem[]> {
  const version = options?.version || 'current'
  const languages = context.config.multilingual
    ? context.languages.map((l) => l.code)
    : [lng]
  const pathShouldBeIncluded = buildPathShouldBeIncludedValidator(
    options?.basePath
  )

  if (
    options?.includeDescendantsOfUnpublishedFolders &&
    options.version !== 'published'
  ) {
    context.emit(
      EVENT_NAMES.WARNING,
      `includeDescendantsOfUnpublishedFolders is ignored since but item version is not set to published `
    )
  }

  async function handleLanguage(language: string) {
    const tr = trFactory(language)

    async function getItem({
      id,
      item,
    }: {
      id: string
      item: { name: string }
    }): Promise<JSONItem | null> {
      const response = await context.callPIM({
        query: GET_ITEM_QUERY,
        variables: {
          language,
          version,
          id,
        },
      })
      let parsedItem: JSONItem | null = null
      const rawCatalogueData: JSONItem | null = response.data?.item?.get
      if (rawCatalogueData) {
        // Fallback when name is not set for draft
        if (rawCatalogueData.name === 'MISSING_NAME_FOR_LANGUAGE') {
          rawCatalogueData.name = item.name
        }

        parsedItem = parseRawItemData({ item: rawCatalogueData, options, tr })
      }
      const children = await getItemChildren({ itemId: id })
      if (children.length > 0) {
        if (parsedItem) {
          const itemWithChildren = parsedItem as JSONFolder
          itemWithChildren.children = children
        } else if (
          /**
           * If there is no item found for this id, we need to check if
           * descendants still should be fetched, if the following
           * conditions are met:
           * - itemVersion: published
           * - itemConfig.includeDescendantsOfUnpublishedFolders
           *
           * In that case, we need to create a dummy folder object that
           * can hold the children. This item cannot be imported, so we
           * flag its required fields with unpublishedFolderFieldIndicator
           */
          options?.includeDescendantsOfUnpublishedFolders &&
          version === 'published'
        ) {
          const unpublishedFolder: JSONFolder = {
            id,
            name: tr(unpublishedFolderFieldIndicator, `${id}.name`),
            shape: unpublishedFolderFieldIndicator,
            children,
          }
          parsedItem = unpublishedFolder
        }
      }
      return parsedItem
    }

    async function getItemChildren({
      itemId,
    }: {
      itemId: string
    }): Promise<JSONItem[]> {
      const children: JSONItem[] = []

      const pageResponse = await context.callPIM({
        query: GET_ITEM_CHILDREN,
        variables: {
          language,
          id: itemId,
        },
      })

      const rawChilds = pageResponse.data?.tree?.getNode?.children || []

      await Promise.all(
        rawChilds.map(async (rawChild: any) => {
          const pathValid = pathShouldBeIncluded(rawChild.path)

          if (pathValid.descendants || pathValid.thisItem) {
            const item = await getItem(rawChild)
            if (item) {
              children.push(item)
            }
          }
        })
      )

      return children.sort(byTreePosition)
    }

    const rootItemId = await getTenantRootItemId(context)

    const allCatalogueItemsForLanguage = await getItemChildren({
      itemId: rootItemId,
    })

    // Filter out on the desired path in the end
    if (options?.basePath?.length) {
      return getOnlyItemsWithPathStartingWith(
        options.basePath,
        allCatalogueItemsForLanguage
      )
    }

    return allCatalogueItemsForLanguage
  }

  const allCatalogueItems: JSONItem[] = []

  function mergeWithExisting(itemForNewLang: JSONItem, parentId?: string) {
    const existingItem = getItemById(
      allCatalogueItems,
      itemForNewLang.id as string
    )

    if (!existingItem) {
      // Add it to the parentId children array (if it has it)
      let added = false
      if (parentId) {
        const parentItem = getItemById(allCatalogueItems, parentId)
        if (parentItem) {
          const parentItemAsFolder = parentItem as JSONFolder
          if (!parentItemAsFolder.children) {
            parentItemAsFolder.children = []
          }
          parentItemAsFolder.children.push(itemForNewLang)
          added = true
        }
      }

      if (!added) {
        console.log(
          'Huh, weird. Could not find existing item with id',
          itemForNewLang.id
        )
      }
    } else {
      // Set shape if not already set
      if (existingItem.shape === unpublishedFolderFieldIndicator) {
        existingItem.shape = itemForNewLang.shape
      }

      // Handle translations
      mergeInTranslations(existingItem, itemForNewLang)
    }

    if ('children' in itemForNewLang) {
      itemForNewLang.children?.forEach((c) =>
        mergeWithExisting(c, itemForNewLang.id)
      )
    }
  }

  for (let i = 0; i < languages.length; i++) {
    const language = languages[i]
    const itemsForLanguage = await handleLanguage(language)
    if (allCatalogueItems.length === 0) {
      allCatalogueItems.push(...itemsForLanguage)
    } else {
      /**
       * Remove catalogue path here, as we only want the default language
       * catalogue path to be in the spec
       */
      removeUnwantedFieldsFromThing(itemsForLanguage, ['cataloguePath'])

      const rootItemId = await getTenantRootItemId(context)

      itemsForLanguage.forEach((m) => mergeWithExisting(m, rootItemId))
    }
  }

  allCatalogueItems.sort(byTreePosition)

  const fieldsToRemove = ['treePosition', translationFieldIdentifier]
  if (!options?.keepOriginalIds) {
    fieldsToRemove.push('id')
  }

  return removeUnwantedFieldsFromThing(
    removeUnpublishedFolderFieldIndicator(allCatalogueItems),
    fieldsToRemove
  )
}
