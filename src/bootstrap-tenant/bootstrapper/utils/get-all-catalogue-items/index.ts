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

const unpublishedFolderFieldIndicator = '__unpublished_folder_field_indicator'

function byTreePosition(a: JSONItem, b: JSONItem) {
  const aP = a.treePosition as number
  const bP = b.treePosition as number

  if (aP > bP) {
    return 1
  }
  if (aP < bP) {
    return -1
  }
  return 0
}

function getItemById(items: JSONItem[], id: string): JSONItem | null {
  let found: JSONItem | null = null

  function search(item: JSONItem) {
    if (!found) {
      if (item.id === id) {
        found = item
      } else {
        if ('children' in item) {
          item.children?.forEach(search)
        }
      }
    }
  }

  items.forEach(search)

  return found
}

export interface ItemsCreateSpecOptions {
  basePath?: string
  version?: 'published' | 'draft' | 'current'
  setExternalReference?: boolean
  keepOriginalIds?: boolean
  includeUnpublishedFolders?: boolean // Only needed when version = published
}

type pathValidation = {
  thisItem: boolean
  descendants: boolean
}

export function buildPathShouldBeIncludedValidator(basePath = '') {
  return function validate(path: string): pathValidation {
    if (!basePath || basePath === '/') {
      return {
        thisItem: true,
        descendants: true,
      }
    }

    const p = path || ''

    const thisItem = p.startsWith(basePath)

    return {
      thisItem,
      descendants: thisItem || basePath.startsWith(p),
    }
  }
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

  if (options?.includeUnpublishedFolders && options.version !== 'published') {
    context.emit(
      EVENT_NAMES.WARNING,
      `includeUnpublishedFolders is ignored since but item version is not set to published `
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
           * - itemConfig.includeUnpublishedFolders
           *
           * In that case, we need to create a dummy folder object that
           * can hold the children. This item cannot be imported, so we
           * flag its required fields with unpublishedFolderFieldIndicator
           */
          options?.includeUnpublishedFolders &&
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

  return removeUnwantedFieldsFromThing(allCatalogueItems, fieldsToRemove)
}

const GET_ITEM_CHILDREN = `
query GET_ITEM_CHILDREN (
  $language: String!
  $id: ID!
) {
  tree {
    getNode (
      language: $language
      itemId: $id
    ) {
      children {
        id: itemId
        treePosition: position
        path
        item { name }
      }
    }
  }
}
`

const GET_ITEM_QUERY = `
query GET_ITEM($language: String!, $id: ID!, $version: VersionLabel!) {
  item {
    get(id: $id, language: $language, versionLabel: $version) {
      ...item
      ...product
    }
  }
}

fragment item on Item {
  id
  name
  type
  tree {
    path
    position
  }
  externalReference
  shape {
    identifier
  }
  topics {
    path
  }
  components {
    ...rootComponent
  }
}

fragment primitiveComponentContent on ComponentContent {
  ...singleLineContent
  ...richTextContent
  ...imageContent
  ...videoContent
  ...fileContent
  ...paragraphCollectionContent
  ...itemRelationsContent
  ...gridRelationsContent
  ...locationContent
  ...selectionContent
  ...booleanContent
  ...propertiesTableContent
  ...dateTimeContent
  ...numericContent
}

fragment product on Product {
  vatType {
    name
    percent
  }
  variants {
    externalReference
    name
    sku
    isDefault
    attributes {
      attribute
      value
    }
    priceVariants {
      identifier
      price
    }
    stock
    stockLocations {
      identifier
      name
      stock
    }
    images {
      ...image
    }
    subscriptionPlans {
      identifier
      name
      periods {
        id
        name
        initial {
          ...subscriptionPlanPricing
        }
        recurring {
          ...subscriptionPlanPricing
        }
      }
    }

    components {
      ...rootComponent
    }
  }
}

fragment rootComponent on Component {
  id: componentId
  name
  type
  content {
    ...primitiveComponentContent
    ... on ComponentChoiceContent {
      selectedComponent {
        id: componentId
        name
        type
        content {
          ...primitiveComponentContent
        }
      }
    }
    ... on ContentChunkContent {
      chunks {
        id: componentId
        name
        type
        content {
          ...primitiveComponentContent
        }
      }
    }
  }
}

fragment image on Image {
  url
  altText
  caption {
    json
  }
}

fragment video on Video {
  id
  title
  playlist(type: "m3u8")
  thumbnails {
    ...image
  }
}

fragment file on File {
  url
  title
}

fragment dateTimeContent on DatetimeContent {
  datetime
}

fragment numericContent on NumericContent {
  number
  unit
}

fragment propertiesTableContent on PropertiesTableContent {
  sections {
    title
    properties {
      key
      value
    }
  }
}

fragment booleanContent on BooleanContent {
  value
}

fragment selectionContent on SelectionContent {
  options {
    key
    value
  }
}

fragment imageContent on ImageContent {
  images {
    ...image
  }
}

fragment videoContent on VideoContent {
  videos {
    ...video
  }
}

fragment fileContent on FileContent {
  files {
    ...file
  }
}

fragment singleLineContent on SingleLineContent {
  text
}

fragment richTextContent on RichTextContent {
  json
}

fragment itemRelationsContent on ItemRelationsContent {
  items {
    id
    tree {
      path
    }
    externalReference
  }
}

fragment gridRelationsContent on GridRelationsContent {
  grids {
    name
  }
}

fragment locationContent on LocationContent {
  lat
  long
}

fragment paragraphCollectionContent on ParagraphCollectionContent {
  paragraphs {
    title {
      ...singleLineContent
    }
    body {
      ...richTextContent
    }
    images {
      ...image
    }
  }
}

fragment subscriptionPlanPricing on ProductVariantSubscriptionPlanPricing {
  period
  unit
  priceVariants {
    identifier
    price
  }
  meteredVariables {
    id
    identifier
    name
    tierType
    tiers {
      threshold
      priceVariants {
        identifier
        price
      }
    }
  }
}
`
export function getOnlyItemsWithPathStartingWith(
  basePath: string,
  allCatalogueItemsForLanguage: JSONItem[]
): JSONItem[] {
  if (basePath === '/') {
    return allCatalogueItemsForLanguage
  }

  const ret: JSONItem[] = []

  let foundExactFolderMatch = false

  function handleLevel(item: JSONItem) {
    if (!foundExactFolderMatch) {
      if (item.cataloguePath?.startsWith(basePath)) {
        if ('children' in item) {
          foundExactFolderMatch = true
        }

        ret.push(item)
      } else {
        const f = item as JSONFolder
        if (f.children) {
          f.children.forEach(handleLevel)
        }
      }
    }
  }

  allCatalogueItemsForLanguage.forEach(handleLevel)

  return ret
}
