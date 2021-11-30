import { ComponentContentInput, ItemType } from '../../../types'
import {
  buildUpdateItemMutation,
  buildMoveItemMutation,
  buildUpdateItemComponentMutation,
  buildCreateItemQueryAndVariables,
} from '../../../graphql'

import {
  JSONItem,
  JsonSpec,
  JSONFolder,
  JSONProduct,
  JSONComponentContent,
  JSONContentChunk,
  JSONItemRelations,
  JSONItemRelation,
  JSONProductVariant,
} from '../../json-spec'
import {
  callPIM,
  getTenantId,
  getTranslation,
  AreaUpdate,
  BootstrapperContext,
  uploadFileFromUrl,
  validShapeIdentifier,
  fileUploader,
  ItemVersionDescription,
  getItemVersionsForLanguages,
  getItemId,
} from '../utils'
import { getAllGrids } from '../utils/get-all-grids'
import { ffmpegAvailable } from '../utils/remote-file-upload'
import {
  CreateProductVariantInput,
  ProductVariant,
  ProductVariantAttributeInput,
} from '../../../generated/graphql'
import { getProductVariants } from '../utils/get-product-variants'
import { getTopicIds } from '../utils/get-topic-id'
import {
  getSubscriptionPlanMeteredVariables,
  getSubscriptionPlanPeriodId,
  subscriptionPlanPrincingJsonToInput,
} from './subscriptions'
import { handleJsonPriceToPriceInput } from './pricing'
import { createImagesInput, createComponentsInput } from './components'
import { handleJsonStockToStockInput } from './stock'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

async function getTenantRootItemId(): Promise<string> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_ROOT_ITEM_ID($tenantId: ID!) {
        tenant {
          get(id: $tenantId) {
            rootItemId
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.tenant?.get?.rootItemId || ''
}

function publishItem(language: string, id: string) {
  if (!id) {
    return Promise.resolve()
  }

  return callPIM({
    query: `
      mutation PUBLISH_ITEM($id: ID!, $language: String!) {
        item {
          publish(id: $id, language: $language) {
            id
          }
        }
      }
    `,
    variables: {
      id,
      language,
    },
  })
}

function getAllMediaUrls(items: JSONItem[]): string[] {
  const medias: string[] = []

  function handleItem(item: any) {
    if (!item) {
      return
    }

    Object.values(item).forEach((value: any) => {
      if (!value) {
        return
      }

      if (typeof value === 'object') {
        // Check for media signature
        if ('src' in value) {
          medias.push(value.src)
        } else {
          Object.values(value).forEach(handleItem)
        }
      } else if (Array.isArray(value)) {
        value.forEach(handleItem)
      }
    })
  }

  items.forEach(handleItem)

  return medias
}

async function getExistingTopicIdsForItem(
  itemId: string,
  language: string
): Promise<string[]> {
  const result = await callPIM({
    query: `
      query GET_ITEM_TOPICS ($itemId: ID!, $language: String!) {
        item {
          get (id: $itemId, language: $language) {
            topics {
              id
            }
          }
        }
      }
    `,
    variables: {
      itemId,
      language,
    },
  })

  return result.data?.item?.get?.topics?.map((t: any) => t.id) || []
}

export async function setItems({
  spec,
  onUpdate,
  context,
}: Props): Promise<void> {
  if (!spec?.items) {
    return
  }

  const ffmpeg = await ffmpegAvailable
  if (!ffmpeg) {
    onUpdate({
      warning: {
        code: 'FFMPEG_UNAVAILABLE',
        message:
          'ffmpeg is not available. Videos will not be included. Installment instructions for ffmpeg: https://ffmpeg.org/download.html',
      },
    })
  }

  const rootItemId = await getTenantRootItemId()
  const allGrids = await getAllGrids(context.defaultLanguage.code)

  /**
   * First off, let's start uploading all the images
   * in parallel with all the other PIM mutations
   */
  const allMediaUrls = getAllMediaUrls(spec.items)
  allMediaUrls.forEach(uploadFileFromUrl)

  // Pull the status every second
  const getFileuploaderStatusInterval = setInterval(() => {
    const doneUploads = fileUploader.workerQueue.filter(
      (u) => u.status !== 'not-started'
    )
    const progress = doneUploads.length / allMediaUrls.length
    onUpdate({
      message: 'media-upload-progress',
      progress,
    })

    if (progress >= 1) {
      clearInterval(getFileuploaderStatusInterval)
    }
  }, 1000)

  onUpdate({
    message: `Initiating upload of ${allMediaUrls.length} media item(s)`,
  })

  // Get a total item count
  let totalItems = 0
  function getCount(item: JSONFolder) {
    totalItems++
    if ('children' in item) {
      item.children?.forEach(getCount)
    }
  }
  spec.items.forEach(getCount)

  // Double the item count since we're doing create&update _and_ item relations later
  totalItems *= 2

  let finishedItems = 0

  async function createOrUpdateItem(
    item: JSONItem,
    parentId: string,
    isInParentChildrenArray?: boolean
  ): Promise<string | null> {
    // Create the object to store the component data in
    item._componentsData = {}

    // Ensure shape identifier is not too long (max 24 characters)
    item.shape = validShapeIdentifier(item.shape, onUpdate)

    // Get the shape type
    const shape = context.shapes?.find((s) => s.identifier === item.shape)
    if (!shape) {
      onUpdate({
        warning: {
          code: 'CANNOT_HANDLE_ITEM',
          message: `Skipping  "${getTranslation(
            item.name,
            context.defaultLanguage.code
          )}". Could not locate its shape (${item.shape}}))`,
        },
      })
      return null
    }

    async function createForLanguage(language: string) {
      if (!shape) {
        return
      }

      // @ts-ignore
      item._componentsData[language] = await createComponentsInput({
        item,
        shape,
        language,
        grids: allGrids,
        onUpdate,
      })
      item._topicsData = {}
      if (item.topics) {
        item._topicsData = {
          topicIds: await getTopicIds({
            topics: item.topics || [],
            language: context.defaultLanguage.code,
          }),
        }
      }

      return callPIM(
        buildCreateItemQueryAndVariables(
          {
            name: getTranslation(item.name, language) || '',
            shapeIdentifier: item.shape,
            tenantId: getTenantId(),
            ...(item.externalReference && {
              externalReference: item.externalReference,
            }),
            tree: {
              parentId,
            },
            ...item._topicsData,
            components: item._componentsData?.[language],
            ...(shape?.type === 'product' && {
              ...(await createProductItemMutation(language)),
            }),
          },
          // @ts-ignore
          shape?.type,
          language
        )
      )
    }

    async function updateForLanguage(language: string, itemId: string) {
      if (!shape || !itemId) {
        onUpdate({
          warning: {
            code: 'CANNOT_HANDLE_PRODUCT',
            message: `Cannot update "${getTranslation(
              item.name,
              language
            )}" for language "${language}". Missing shape or itemId`,
          },
        })
        return
      }

      // @ts-ignore
      item._componentsData[language] = await createComponentsInput({
        item,
        shape,
        language,
        grids: allGrids,
        onUpdate,
      })

      const clearComponentsData = item._componentsData?.[language] === null

      const updates = []

      /**
       * If it is a product, we need to pull all the product
       * variants first, and then update each field.
       * We need to do this because there is (currently) not
       * any product.addVariant mutation
       */
      let existingProductVariants: undefined | ProductVariant[]
      if (shape?.type === 'product') {
        existingProductVariants = await getProductVariants(language, itemId)
      }

      /**
       * Start with the basic item information
       */
      updates.push(
        callPIM({
          query: buildUpdateItemMutation(
            itemId,
            {
              name: getTranslation(item.name, language) || '',
              ...item._topicsData,
              ...(shape?.type === 'product' && {
                ...(await createProductItemMutation(
                  language,
                  existingProductVariants
                )),
              }),
              ...(clearComponentsData && {
                components: {},
              }),
            },
            shape.type as ItemType,
            language
          ),
        })
      )

      /**
       * Create a single update component mutation on
       * each component. This will ensure that no
       * component data will be lost during the update
       */
      if (item._componentsData?.[language]) {
        Object.keys(item._componentsData[language]).forEach(
          (componentId: string) => {
            const componentContent: ComponentContentInput =
              item._componentsData?.[language][componentId]

            updates.push(
              callPIM({
                query: buildUpdateItemComponentMutation({
                  itemId,
                  language,
                  input: {
                    componentId,
                    ...componentContent,
                  },
                }),
              })
            )
          }
        )
      }

      return Promise.all(updates)
    }

    function createProductBaseInfo() {
      const product = item as JSONProduct

      const vatType = context.vatTypes?.find(
        (v) => v.name?.toLowerCase() === product.vatType.toLowerCase()
      )
      if (!vatType) {
        onUpdate({
          warning: {
            code: 'CANNOT_HANDLE_PRODUCT',
            message: `Cannot create product "${product.name}". Vat type "${product.vatType}" does not exist`,
          },
        })
        return
      }

      return {
        vatTypeId: vatType.id || '',
      }
    }

    async function createProductVariant(
      jsonVariant: JSONProductVariant,
      language: string,
      existingProductVariant?: ProductVariant
    ): Promise<CreateProductVariantInput> {
      let attributes: undefined | ProductVariantAttributeInput[]
      if (jsonVariant.attributes) {
        attributes = Object.keys(jsonVariant.attributes).map(
          (attribute: string) => ({
            attribute,
            value: jsonVariant.attributes?.[attribute] || '',
          })
        )
      }

      const {
        priceVariants: existingProductVariantPriceVariants,
        stockLocations: existingProductVariantStockLocations,
        ...restOfExistingProductVariant
      } = existingProductVariant || {}

      const variant: CreateProductVariantInput = {
        ...(restOfExistingProductVariant as CreateProductVariantInput),
        name: getTranslation(jsonVariant.name, language),
        sku: jsonVariant.sku,
        isDefault: jsonVariant.isDefault || false,
        stockLocations: handleJsonStockToStockInput({
          jsonStock: jsonVariant.stock,
          existingProductVariantStockLocations,
        }),
        priceVariants: handleJsonPriceToPriceInput({
          jsonPrice: jsonVariant.price,
          existingProductVariantPriceVariants,
        }),
        ...(attributes && { attributes }),
      }

      if (jsonVariant.subscriptionPlans) {
        variant.subscriptionPlans = jsonVariant.subscriptionPlans.map((sP) => {
          const meteredVariables = getSubscriptionPlanMeteredVariables({
            planIdentifier: sP.identifier,
            context,
          })

          return {
            identifier: sP.identifier,
            periods: sP.periods.map((p) => {
              const id = getSubscriptionPlanPeriodId({
                planIdentifier: sP.identifier,
                periodName: p.name,
                context,
              })

              if (!id) {
                throw new Error('Plan period id is null')
              }

              return {
                id,
                ...(p.initial && {
                  initial: subscriptionPlanPrincingJsonToInput({
                    pricing: p.initial,
                    meteredVaribles: meteredVariables,
                  }),
                }),
                recurring: subscriptionPlanPrincingJsonToInput({
                  pricing: p.recurring,
                  meteredVaribles: meteredVariables,
                }),
              }
            }),
          }
        })
      }

      if (jsonVariant.images) {
        variant.images = await createImagesInput({
          images: jsonVariant.images,
          language,
          onUpdate,
        })
      }

      return variant
    }

    async function createProductItemMutation(
      language: string,
      existingProductVariants?: ProductVariant[]
    ) {
      const product = item as JSONProduct

      const variants: CreateProductVariantInput[] = []
      const inp = {
        ...createProductBaseInfo(),
        variants,
      }

      // Add existing product variants
      if (existingProductVariants) {
        inp.variants.push(
          ...existingProductVariants.map(
            ({ priceVariants, stockLocations, ...rest }) =>
              ({
                ...rest,
                priceVariants: priceVariants?.map((p) => ({
                  identifier: p.identifier,
                  price: p.price,
                })),
                stockLocations: stockLocations?.map((p) => ({
                  identifier: p.identifier,
                  stock: p.stock,
                  meta: p.meta,
                })),
              } as CreateProductVariantInput)
          )
        )
      }

      for (let i = 0; i < product.variants.length; i++) {
        const vr = product.variants[i]
        const existingProductVariant = existingProductVariants?.find(
          (v) =>
            v.sku === vr.sku || v.externalReference === vr.externalReference
        )
        const variant = await createProductVariant(
          vr,
          language,
          existingProductVariant
        )

        if (existingProductVariant) {
          inp.variants[
            inp.variants.findIndex(
              (v) =>
                v.sku === vr.sku || v.externalReference === vr.externalReference
            )
          ] = variant
        } else {
          inp.variants.push(variant)
        }
      }

      // Ensure that only one is set as the default
      const defaultVariants = inp.variants.filter((v) => v.isDefault)
      if (defaultVariants.length !== 1) {
        inp.variants.forEach((v) => (v.isDefault = false))
        inp.variants[0].isDefault = true
      }

      return inp
    }

    let itemId = item.id

    let versionsInfo

    // Get new topics
    item._topicsData = {
      topicIds: await getTopicIds({
        topics: item.topics || [],
        language: context.defaultLanguage.code,
      }),
    }

    if (itemId) {
      if (context.config.itemPublish === 'auto') {
        versionsInfo = await getItemVersionsForLanguages({
          itemId,
          languages: context.languages.map((l) => l.code),
        })
      }

      if (item._options?.moveToRoot) {
        await callPIM({
          query: buildMoveItemMutation(itemId, {
            parentId: rootItemId,
          }),
        })
      } else if (
        item._exists &&
        (isInParentChildrenArray || item.parentExternalReference)
      ) {
        /**
         * Move the item if it is a part of a children array,
         * or if item.parentExternalReference is passed
         */
        await callPIM({
          query: buildMoveItemMutation(itemId, {
            parentId,
          }),
        })
      }

      // Merge in existing topic
      if (context.config.itemTopics === 'amend') {
        const existingTopicIds = await getExistingTopicIdsForItem(
          itemId,
          context.defaultLanguage.code
        )

        item._topicsData.topicIds = Array.from(
          new Set([...existingTopicIds, ...item._topicsData.topicIds])
        )
      }

      await updateForLanguage(context.defaultLanguage.code, itemId)
    } else {
      // Ensure a name is set for the default language (required by the API)
      if (!getTranslation(item.name, context.defaultLanguage.code)) {
        onUpdate({
          warning: {
            code: 'CANNOT_HANDLE_ITEM',
            message: `Item name cannot be empty for the default language`,
          },
        })

        throw new Error(`Item name cannot be empty for the default language`)
      }

      /**
       * Ensure that variants are present when creating
       * a product
       */
      if (shape.type === 'product') {
        const product = item as JSONProduct
        if (!product.variants || product.variants.length === 0) {
          onUpdate({
            warning: {
              code: 'CANNOT_HANDLE_PRODUCT',
              message: `Skipping  "${getTranslation(
                item.name,
                context.defaultLanguage.code
              )}". No variants defined for product`,
            },
          })
          return null
        }
      }

      const response = await createForLanguage(context.defaultLanguage.code)
      itemId = response?.data?.[shape?.type]?.create?.id
    }

    if (!itemId) {
      onUpdate({
        warning: {
          code: 'CANNOT_HANDLE_ITEM',
          message: `Could not create or update item "${getTranslation(
            item.name,
            context.defaultLanguage.code
          )}"`,
        },
      })
      return null
    }

    const passedPublishConfig = item._options?.publish
    if (typeof passedPublishConfig === 'boolean') {
      if (passedPublishConfig) {
        await publishItem(context.defaultLanguage.code, itemId)
      }
    } else if (
      context.config.itemPublish === 'publish' ||
      !versionsInfo ||
      versionsInfo[context.defaultLanguage.code] ===
        ItemVersionDescription.Published
    ) {
      await publishItem(context.defaultLanguage.code, itemId)
    }

    // Create for remaining languages
    const remainingLanguages = context.languages
      .filter((l) => !l.isDefault)
      .map((l) => l.code)

    for (let i = 0; i < remainingLanguages.length; i++) {
      await updateForLanguage(remainingLanguages[i], itemId)

      const passedPublishConfig = item._options?.publish
      if (typeof passedPublishConfig === 'boolean') {
        if (passedPublishConfig) {
          await publishItem(remainingLanguages[i], itemId)
        }
      } else if (
        context.config.itemPublish === 'publish' ||
        !versionsInfo ||
        versionsInfo[remainingLanguages[i]] === ItemVersionDescription.Published
      ) {
        await publishItem(remainingLanguages[i], itemId)
      }
    }

    return itemId
  }

  async function handleItem(
    item: JSONItem,
    parentId?: string,
    isInParentChildrenArray?: boolean
  ) {
    if (!item) {
      return
    }

    item.id = await getItemId({
      externalReference: item.externalReference,
      cataloguePath: item.cataloguePath,
      context,
      language: context.defaultLanguage.code,
      tenantId: getTenantId(),
      shapeIdentifier: item.shape,
    })

    if (item.parentExternalReference) {
      parentId = await getItemId({
        externalReference: item.parentExternalReference,
        context,
        language: context.defaultLanguage.code,
        tenantId: getTenantId(),
      })
    }

    // If the item exists in Crystallize already
    item._exists = Boolean(item.id)

    item.id = (await createOrUpdateItem(
      item,
      parentId || rootItemId,
      isInParentChildrenArray
    )) as string

    finishedItems++
    onUpdate({
      progress: finishedItems / totalItems,
      message: `Handled ${getTranslation(
        item.name,
        context.defaultLanguage.code
      )}`,
    })
    if (item.id) {
      /**
       * Store the item id for the cataloguePath. Very useful if the generated
       * cataloguePath is different than the one in the JSON spec
       */
      if (item.cataloguePath) {
        context.itemJSONCataloguePathToIDMap.set(item.cataloguePath, item.id)
      }

      if ('children' in item) {
        const itm = item as JSONFolder

        if (itm.children) {
          await Promise.all(
            itm.children.map((child) => handleItem(child, itm.id, true))
          )
        }
      }
    }
  }

  async function handleItemRelations(item: JSONItem) {
    if (!item) {
      return
    }

    onUpdate({
      message: `Item relations: ${getTranslation(
        item.name,
        context.defaultLanguage.code
      )}`,
    })

    async function getItemIdsForItemRelation(
      itemRelations?: JSONItemRelation[]
    ): Promise<string[]> {
      const ids: string[] = []

      if (
        !itemRelations ||
        !itemRelations.map ||
        typeof itemRelations.map !== 'function'
      ) {
        return ids
      }

      await Promise.all(
        itemRelations.map(async (itemRelation) => {
          if (typeof itemRelation === 'object') {
            const id = await getItemId({
              externalReference: itemRelation.externalReference,
              cataloguePath: itemRelation.cataloguePath,
              context,
              language: context.defaultLanguage.code,
              tenantId: getTenantId(),
            })

            if (id) {
              ids.push(id)
            }
          }
        })
      )

      return ids
    }

    if (item.components && item.id) {
      let versionsInfo

      if (context.config.itemPublish === 'auto') {
        versionsInfo = await getItemVersionsForLanguages({
          languages: context.languages.map((l) => l.code),
          itemId: item.id,
        })
      }

      await Promise.all(
        Object.keys(item.components).map(async (componentId) => {
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

            let mutationInput = null

            switch (def?.type) {
              case 'itemRelations': {
                mutationInput = {
                  componentId,
                  itemRelations: {
                    itemIds: await getItemIdsForItemRelation(
                      jsonItem as JSONItemRelations
                    ),
                  },
                }
                break
              }
              case 'componentChoice':
              case 'contentChunk': {
                const itemRelationIds = (
                  def.config.choices || def.config.components
                )
                  .filter((s: any) => s.type === 'itemRelations')
                  .map((s: any) => s.id)

                // Get existing data for component
                if (itemRelationIds.length > 0) {
                  const existingComponentsData =
                    item._componentsData?.[context.defaultLanguage.code]
                  const componentData = existingComponentsData[componentId]

                  if (componentData) {
                    if (def.type === 'componentChoice') {
                      const selectedDef = def.config.choices.find(
                        (c: any) =>
                          c.id === componentData.componentChoice.componentId
                      )
                      if (selectedDef?.type === 'itemRelations') {
                        mutationInput = {
                          componentId,
                          componentChoice: {
                            componentId:
                              componentData.componentChoice.componentId,
                            itemRelations: {
                              itemIds: await getItemIdsForItemRelation(
                                jsonItem as JSONItemRelations
                              ),
                            },
                          },
                        }
                      }
                    } else if (def.type === 'contentChunk') {
                      mutationInput = {
                        componentId,
                        ...componentData,
                      }
                      await Promise.all(
                        mutationInput.contentChunk.chunks.map(
                          async (chunk: any, chunkIndex: number) => {
                            const jsonChunk = (jsonItem as JSONContentChunk)[
                              chunkIndex
                            ]

                            // Update all potential itemRelation components
                            await Promise.all(
                              itemRelationIds.map(
                                async (itemRelationId: string) => {
                                  const itemRelationComponentIndex = chunk.findIndex(
                                    (c: any) => c.componentId === itemRelationId
                                  )

                                  if (itemRelationComponentIndex !== -1) {
                                    chunk[
                                      itemRelationComponentIndex
                                    ].itemRelations.itemIds = await getItemIdsForItemRelation(
                                      jsonChunk[
                                        itemRelationId
                                      ] as JSONItemRelation[]
                                    )
                                  }
                                }
                              )
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

            // Update the component
            if (mutationInput) {
              const r = await callPIM({
                query: `
                  mutation UPDATE_RELATIONS_COMPONENT($itemId: ID!, $language: String!, $input: ComponentInput!) {
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
                  language: context.defaultLanguage.code,
                  input: mutationInput,
                },
              })
            }
          }
        })
      )

      // Ensure publishing of items
      for (let i = 0; i < context.languages.length; i++) {
        const language = context.languages[i].code
        if (
          versionsInfo &&
          versionsInfo[language] === ItemVersionDescription.Published
        ) {
          await publishItem(language, item.id as string)
        }
      }
    }

    finishedItems++
    onUpdate({
      progress: finishedItems / totalItems,
    })

    if ('children' in item) {
      const itm = item as JSONFolder

      if (itm.children) {
        for (let i = 0; i < itm.children.length; i++) {
          await handleItemRelations(itm.children[i])
        }
      }
    }
  }

  for (let i = 0; i < spec.items.length; i++) {
    try {
      await handleItem(spec.items[i], rootItemId, false)
    } catch (e) {
      console.log(e)
      onUpdate({
        warning: {
          code: 'CANNOT_HANDLE_ITEM',
          message: `Skipping "${getTranslation(
            spec.items[i].name,
            context.defaultLanguage.code
          )}"`,
        },
      })
    }
  }

  /**
   * Item relations needs to be handled at the end, after all
   * items are created
   */
  onUpdate({
    message: 'Updating item relations...',
  })

  /**
   * At this point we want to start using cached values
   * so that we don't hit the API as much and speed things up
   */
  context.useReferenceCache = true

  for (let i = 0; i < spec.items.length; i++) {
    await handleItemRelations(spec.items[i])
  }

  clearInterval(getFileuploaderStatusInterval)

  onUpdate({
    progress: 1,
  })
}
