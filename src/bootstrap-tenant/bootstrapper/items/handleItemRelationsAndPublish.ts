import {} from '@crystallize/schema'
import {
  JSONComponentContent,
  JSONFolder,
  JSONItem,
  JSONProduct,
} from '../../json-spec'
import {
  BootstrapperContext,
  EVENT_NAMES,
  ItemEventPayload,
  ItemVersionDescription,
  getTranslation,
} from '../utils'
import { gql } from 'graphql-request'
import { publishItem } from './publishItem'
import { getComponentUpdateMutationInput } from './getComponentUpdateMutationInput'
import { ComponentContentInput } from '../../../types'

export async function handleItemRelationsAndPublish(
  item: JSONItem,
  context: BootstrapperContext,
  onUpdate: any,
  finishedItems: number,
  totalItems: number
) {
  if (!item) {
    return finishedItems
  }

  onUpdate({
    message: `Item relations: ${getTranslation(
      item.name,
      context.targetLanguage || context.defaultLanguage
    )}`,
  })

  if (item.id) {
    // Pull the item info from the cache
    const versionsInfo = context.itemVersions.get(item.id)

    if (item.id) {
      if (item.components) {
        const keys = Object.keys(item.components)

        for (let i = 0; i < keys.length; i++) {
          const componentId = keys[i]
          const jsonItem = item.components?.[
            componentId
          ] as JSONComponentContent

          if (jsonItem) {
            const shape = context.shapes?.find(
              (s) => s.identifier === item.shape
            )
            const def = shape?.components?.find(
              (c: any) => c.id === componentId
            )

            const mutationInput = await getComponentUpdateMutationInput({
              shapeComponent: def,
              componentContent: jsonItem as ComponentContentInput,
              componentsData: item._componentsData,
              componentId,
              context,
              onUpdate,
              item,
            })

            // Update the component
            if (mutationInput) {
              try {
                const r = await context.callPIM({
                  query: gql`
                    mutation UPDATE_RELATIONS_COMPONENT(
                      $itemId: ID!
                      $language: String!
                      $input: ComponentInput!
                    ) {
                      item {
                        updateComponent(
                          itemId: $itemId
                          language: $language
                          input: $input
                        ) {
                          id
                        }
                      }
                    }
                  `,
                  variables: {
                    itemId: item.id,
                    language: context.targetLanguage || context.defaultLanguage,
                    input: mutationInput,
                  },
                })

                if (r.errors) {
                  throw r.errors
                }
              } catch (err) {
                onUpdate({
                  error: {
                    code: 'CANNOT_HANDLE_ITEM_RELATION',
                    message: `Unable to update relation for item id "${
                      item.id
                    }" with input ${JSON.stringify(mutationInput)} `,
                    item,
                  },
                })
              }
            }
          }
        }
      }

      const product = item as JSONProduct
      if (product.variants?.length) {
        for (const variant of product.variants) {
          if (!variant.components) {
            continue
          }

          const keys = Object.keys(variant.components)
          for (let i = 0; i < keys.length; i++) {
            const componentId = keys[i]

            const jsonItem = variant.components?.[
              componentId
            ] as JSONComponentContent

            if (jsonItem) {
              const shape = context.shapes?.find(
                (s) => s.identifier === item.shape
              )
              const def = shape?.variantComponents?.find(
                (c: any) => c.id === componentId
              )

              const mutationInput = await getComponentUpdateMutationInput({
                shapeComponent: def,
                componentContent: jsonItem as ComponentContentInput,
                componentsData: variant._componentsData,
                componentId,
                context,
                onUpdate,
                item,
              })

              // Update the component
              if (mutationInput) {
                try {
                  const r = await context.callPIM({
                    query: gql`
                      mutation UPDATE_VARIANT_RELATIONS_COMPONENT(
                        $productId: ID!
                        $sku: String!
                        $language: String!
                        $input: ComponentInput!
                      ) {
                        product {
                          updateVariantComponent(
                            productId: $productId
                            sku: $sku
                            language: $language
                            input: $input
                          ) {
                            id
                          }
                        }
                      }
                    `,
                    variables: {
                      productId: item.id,
                      sku: variant.sku,
                      language:
                        context.targetLanguage || context.defaultLanguage,
                      input: mutationInput,
                    },
                  })

                  if (r.errors) {
                    throw r.errors
                  }
                } catch (err) {
                  onUpdate({
                    error: {
                      code: 'CANNOT_HANDLE_ITEM_RELATION',
                      message: `Unable to update relation for variant with sku "${
                        variant.sku
                      }" with input ${JSON.stringify(mutationInput)} `,
                    },
                  })
                }
              }
            }
          }
        }
      }
    }

    // Publish if needed
    if (item.id) {
      for (let i = 0; i < context.languages.length; i++) {
        const language = context.languages[i].code

        const publish = () => {
          context.emit(EVENT_NAMES.ITEM_PUBLISHED, {
            id: item.id,
            name: getTranslation(item.name, language),
            language,
          } as ItemEventPayload)

          return publishItem(language, item.id!, context)
        }

        const passedPublishConfig = item._options?.publish
        if (typeof passedPublishConfig === 'boolean') {
          if (passedPublishConfig) {
            await publish()
          }
        } else if (
          context.config.itemPublish === 'publish' ||
          !versionsInfo ||
          versionsInfo[context.languages[i].code] ===
            ItemVersionDescription.Published
        ) {
          await publish()
        }
      }
    }
  }

  finishedItems++
  onUpdate({
    progress: finishedItems / totalItems,
  })

  if (item && 'children' in item) {
    const itm = item as JSONFolder

    if (itm.children) {
      for (let i = 0; i < itm.children.length; i++) {
        finishedItems = await handleItemRelationsAndPublish(
          itm.children[i],
          context,
          onUpdate,
          finishedItems,
          totalItems
        )
      }
    }
  }
  return finishedItems
}
