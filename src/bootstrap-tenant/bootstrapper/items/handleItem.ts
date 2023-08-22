import { JSONFolder, JSONItem } from '../../json-spec'
import {
  AreaUpdate,
  BootstrapperContext,
  getItemId,
  getTranslation,
} from '../utils'
import { createOrUpdateItem } from './createOrUpdateItem'

export async function handleItem(
  item: JSONItem,
  index: number,
  rootItemId: string,
  context: BootstrapperContext,
  onUpdate: (t: AreaUpdate) => any,
  finishedItems: number,
  totalItems: number
): Promise<number> {
  if (!item) {
    return finishedItems
  }

  let parentId = rootItemId

  const itemAndParentId = await getItemId({
    context,
    externalReference: item.externalReference,
    cataloguePath: item.cataloguePath,
    shapeIdentifier: item.shape,
    language: context.targetLanguage || context.defaultLanguage,
  })

  item.id = itemAndParentId.itemId
  item._parentId = itemAndParentId.parentId

  if (item.parentExternalReference || item.parentCataloguePath) {
    const parentItemAndParentId = await getItemId({
      context,
      externalReference: item.parentExternalReference,
      cataloguePath: item.parentCataloguePath,
      shapeIdentifier: item.shape,
      language: context.targetLanguage || context.defaultLanguage,
    })
    parentId = parentItemAndParentId.itemId || ''
    if (parentId == '') {
      parentId = context.fallbackFolderId
      onUpdate({
        error: {
          code: 'PARENT_FOLDER_NOT_FOUND',
          message: `Cannot find the specified parent folder for item`,
          item,
        },
      })
    }
  }

  // If the item exists in Crystallize already
  item._exists = Boolean(item.id)

  item.id = (await createOrUpdateItem(
    item,
    parentId || rootItemId,
    index + 1,
    onUpdate,
    context,
    rootItemId
  )) as string

  finishedItems++
  onUpdate({
    progress: finishedItems / totalItems,
    message: `Handled ${getTranslation(
      item.name,
      context.targetLanguage || context.defaultLanguage
    )}`,
  })
  if (item.id) {
    /**
     * Store the item id for the cataloguePath. Very useful if the generated
     * cataloguePath is different than the one in the JSON spec
     */
    if (item.cataloguePath) {
      context.itemCataloguePathToIDMap.set(item.cataloguePath, {
        itemId: item.id,
        parentId: parentId || rootItemId,
      })
    }

    if (item.externalReference) {
      context.itemExternalReferenceToIDMap.set(item.externalReference, {
        itemId: item.id,
        parentId: parentId || rootItemId,
      })
    }

    if (item && 'children' in item) {
      const itm = item as JSONFolder

      if (itm.children) {
        for (let i = 0; i < itm.children.length; i++) {
          finishedItems = await handleItem(
            itm.children[i],
            i,
            itm.id || '',
            context,
            onUpdate,
            finishedItems,
            totalItems
          )
        }
      }
    }
  }
  return finishedItems
}
