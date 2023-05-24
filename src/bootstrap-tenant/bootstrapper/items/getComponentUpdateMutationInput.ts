import { ShapeComponent } from '@crystallize/schema'
import {
  ComponentChoiceComponentConfig,
  ContentChunkComponentConfig,
} from '../../../generated/graphql'
import { JSONItem, JSONItemReference, JSONItemRelations } from '../../json-spec'
import { AreaUpdate, BootstrapperContext } from '../utils'
import { getItemIdsForItemRelation } from './getItemIdsForItemRelations'
import { ComponentContentInput } from '../../../types'

// /**
//  * Fetches the mutation input for a component update mutation.
//  *
//  * @param { ShapeComponent, componentContent, componentId }
//  * @returns Promise with mutation object or null
//  */
export const getComponentUpdateMutationInput = async ({
  shapeComponent,
  componentContent,
  componentsData,
  componentId,
  context,
  onUpdate,
  item,
}: {
  shapeComponent?: ShapeComponent
  componentContent: ComponentContentInput
  componentsData?: Record<string, any>
  componentId: string
  context: BootstrapperContext
  onUpdate: (t: AreaUpdate) => any
  item: JSONItem
}): Promise<object | null> => {
  if (!shapeComponent) {
    return null
  }

  // @todo: JSONComponentContent throwing errors, using ComponentContentInput at the moment

  let mutationInput = null
  switch (shapeComponent?.type) {
    case 'itemRelations': {
      mutationInput = {
        componentId,
        itemRelations: {
          itemIds: await getItemIdsForItemRelation(
            context,
            onUpdate,
            item,
            componentContent as JSONItemRelations
          ),
          // @todo: fetch product variant SKUs
          skus: componentContent?.productVariants?.map(
            (relObject: JSONItemReference) => relObject.sku
          ),
        },
      }
      break
    }
    case 'componentChoice':
    case 'contentChunk': {
      const { choices } =
        shapeComponent.config as ComponentChoiceComponentConfig
      const { components } =
        shapeComponent.config as ContentChunkComponentConfig
      const itemRelationIds = (choices || components)
        .filter((s: any) => s.type === 'itemRelations')
        .map((s: any) => s.id)
      // Get existing data for component
      if (itemRelationIds.length > 0) {
        const existingComponentsData =
          componentsData?.[context.targetLanguage || context.defaultLanguage]
        const componentData = existingComponentsData[componentId]

        if (componentData) {
          if (shapeComponent.type === 'componentChoice') {
            if (componentData.componentChoice?.componentId) {
              const selectedDef = choices.find(
                (c: any) => c.id === componentData.componentChoice.componentId
              )
              if (selectedDef?.type === 'itemRelations') {
                const chosenComponentId =
                  componentData.componentChoice.componentId
                const component = componentContent as any
                componentData.componentChoice
                mutationInput = {
                  componentId,
                  componentChoice: {
                    componentId: chosenComponentId,
                    itemRelations: {
                      itemIds: await getItemIdsForItemRelation(
                        context,
                        onUpdate,
                        item,
                        component[chosenComponentId] as any
                      ),
                      skus: component[chosenComponentId]?.productVariants?.map(
                        (relObject: JSONItemReference) => relObject.sku
                      ),
                    },
                  },
                }
              }
            }
          } else if (shapeComponent.type === 'contentChunk') {
            mutationInput = {
              componentId,
              ...componentData,
            }
            await Promise.all(
              mutationInput.contentChunk.chunks.map(
                async (chunk: any, chunkIndex: number) => {
                  const jsonChunk = (componentContent as any)[chunkIndex]

                  // Get item ids within chunk
                  await Promise.all(
                    itemRelationIds.map(async (itemRelationId: string) => {
                      const itemRelationComponentIndex = chunk.findIndex(
                        (c: any) => c.componentId === itemRelationId
                      )

                      if (itemRelationComponentIndex !== -1) {
                        chunk[
                          itemRelationComponentIndex
                        ].itemRelations.itemIds = await getItemIdsForItemRelation(
                          context,
                          onUpdate,
                          item,
                          jsonChunk[itemRelationId] as any
                        )
                        chunk[itemRelationComponentIndex].itemRelations.skus =
                          jsonChunk[itemRelationId]?.productVariants?.map(
                            (relObject: JSONItemReference) => relObject.sku
                          )
                      }
                    })
                  )
                }
              )
            )
          }
        }
      }
      break
    }
  }

  return mutationInput
}
