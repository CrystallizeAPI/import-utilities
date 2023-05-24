import { JSONItem, JSONItemReference, JSONItemRelations } from '../../json-spec'
import { AreaUpdate, BootstrapperContext, getItemId } from '../utils'

export async function getItemIdsForItemRelation(
  context: BootstrapperContext,
  onUpdate: (t: AreaUpdate) => any,
  item: JSONItem,
  itemRelations?: JSONItemRelations
): Promise<string[]> {
  const ids: string[] = []
  if (
    !itemRelations ||
    !itemRelations?.items?.map ||
    typeof itemRelations.items?.map !== 'function'
  ) {
    return ids
  }

  await Promise.all(
    itemRelations.items.map(async (itemRelation: JSONItemReference) => {
      if (typeof itemRelation === 'object' && item) {
        const { itemId } = await getItemId({
          context,
          externalReference: itemRelation.externalReference,
          cataloguePath: itemRelation.cataloguePath,
          language: context.targetLanguage || context.defaultLanguage,
        })

        if (itemId) {
          ids.push(itemId)
        } else {
          onUpdate({
            error: {
              code: 'CANNOT_HANDLE_ITEM_RELATION',
              message: `Could not determine an ID for related item "${
                itemRelation.externalReference
                  ? itemRelation.externalReference
                  : itemRelation.cataloguePath
              }`,
              item,
            },
          } as AreaUpdate)
        }
      }
    })
  )

  return ids
}
