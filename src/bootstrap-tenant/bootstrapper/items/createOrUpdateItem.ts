import { ProductVariantAttributeInput, Shape } from '@crystallize/schema'
import {
  buildCreateItemQueryAndVariables,
  buildMoveItemMutation,
  buildUpdateItemComponentQueryAndVariables,
  buildUpdateItemQueryAndVariables,
} from '../../../graphql'
import {
  JSONGrid,
  JSONItem,
  JSONProduct,
  JSONProductVariant,
} from '../../json-spec'
import {
  AreaUpdate,
  BootstrapperContext,
  EVENT_NAMES,
  ItemEventPayloadCreatedOrUpdated,
  getItemVersionsForLanguages,
  getTranslation,
  validShapeIdentifier,
} from '../utils'
import { getTopicIds } from '../utils/get-topic-id'
import { getAllGrids } from '../utils/get-all-grids'
import { ComponentContentInput, ItemType } from '../../../types'
import { hasItemRelationsComponent } from '../utils/has-item-relations-component'
import { createComponentsInput } from './createComponentsInput'
import { getProduct } from '../utils/get-product'
import { buildUpdateVariantComponentQueryAndVariables } from '../../../graphql/build-update-variant-component-mutation'
import { handleJsonStockToStockInput } from './handleJsonStockToStockInput'
import { handleJsonPriceToPriceInput } from './handleJsonPriceToPriceInput'
import { getSubscriptionPlanMeteredVariables } from './getSubscriptionPlanMeteredVariables'
import { getSubscriptionPlanPeriodId } from './getSubscriptionPlanPeriodId'
import { subscriptionPlanPrincingJsonToInput } from './subscriptionPlanPrincingJsonToInput'
import { createImagesInput } from './createImagesInput'
import { getExistingTopicIdsForItem } from './getExistingTopicIdsForItem'
import {
  CreateProductVariantInput,
  ProductVariant,
} from '../../../generated/graphql'

export async function createOrUpdateItem(
  item: JSONItem,
  parentId: string,
  treePosition: number,
  onUpdate: (t: AreaUpdate) => any,
  context: BootstrapperContext,
  rootItemId: string
): Promise<string | null> {
  // Create the object to store the component data in
  item._componentsData = {}

  if (!item.shape) {
    onUpdate({
      error: {
        code: 'SHAPE_ID_MISSING',
        message: `Missing shape identifier for item "${getTranslation(
          item.name,
          context.targetLanguage || context.defaultLanguage
        )}". Got "${item.shape}"`,
      },
    })
    return null
  }

  const allGrids = await getAllGrids(
    context.targetLanguage || context.defaultLanguage,
    context
  )

  // Ensure shape identifier is not too long (max 64 characters)
  item.shape = validShapeIdentifier(item.shape, onUpdate)

  // Get the shape type
  const shape = context.shapes?.find((s) => s.identifier === item.shape)
  if (!shape) {
    onUpdate({
      error: {
        code: 'CANNOT_HANDLE_ITEM',
        message: `Skipping  "${getTranslation(
          item.name,
          context.targetLanguage || context.defaultLanguage
        )}". Could not locate its shape (${item.shape}))`,
      },
    })
    return null
  }

  async function createForLanguage(language: string) {
    if (!shape) {
      return
    }

    item._topicsData = {}
    if (item.topics) {
      item._topicsData = {
        topicIds: await getTopicIds({
          topics: item.topics || [],
          language: context.targetLanguage || context.defaultLanguage,
          context,
        }),
      }
    }

    return context.callPIM(
      buildCreateItemQueryAndVariables(
        {
          name: getTranslation(item.name, language) || '',
          shapeIdentifier: item.shape,
          tenantId: context.tenantId,
          ...(item.externalReference && {
            externalReference: item.externalReference,
          }),
          tree: {
            parentId,
            position: treePosition,
          },
          components: {}, // Do components later
          ...(item.topics && item._topicsData),
          ...(shape?.type === 'product' && {
            ...(await createProductItemMutation(language)),
          }),
        },
        // @ts-expect-error this will be set. Don't worry.
        shape?.type,
        language
      )
    )
  }

  async function updateForLanguage(language: string, itemId: string) {
    if (!shape || !itemId) {
      onUpdate({
        error: {
          code: 'CANNOT_HANDLE_PRODUCT',
          message: `Cannot update "${getTranslation(
            item.name,
            language
          )}" for language "${language}". Missing shape or itemId`,
          item,
        },
      })
      return
    }

    if (item._componentsData) {
      item._componentsData[language] = await createComponentsInput({
        components: item.components,
        componentDefinitions: shape.components,
        language,
        grids: allGrids,
        context,
        onUpdate,
      })
    }

    const clearComponentsData = item._componentsData?.[language] === null

    const updates: (() => Promise<any>)[] = []

    /**
     * If it is a product, we need to pull all the product
     * variants first, and then update each field.
     * We need to do this because there is (currently) not
     * any product.addVariant mutation
     */
    let existingProductVariants: undefined | ProductVariant[]
    if (shape?.type === 'product') {
      const existingProduct = await getProduct(language, itemId, context)
      existingProductVariants = existingProduct.variants

      // Add vatType if it is not part of the item.
      // This eases the DX, as you don't _have_ to pass vatType
      // for existing products
      const productItem = item as JSONProduct
      if (!productItem.vatType) {
        productItem.vatType = existingProduct.vatType.name
      }
      // Ensure that this is an array
      if (!productItem.variants) {
        productItem.variants = []
      }
    }

    /**
     * Start with the basic item information
     */
    updates.push(async () =>
      context.callPIM(
        buildUpdateItemQueryAndVariables(
          itemId,
          {
            name: getTranslation(item.name, language) || '',
            ...(item.topics && item._topicsData),
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
        )
      )
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

          componentContent &&
            !hasItemRelationsComponent(componentContent) &&
            updates.push(() =>
              context.callPIM(
                buildUpdateItemComponentQueryAndVariables({
                  itemId,
                  language,
                  input: {
                    componentId,
                    ...componentContent,
                  },
                })
              )
            )
        }
      )
    }
    if ((item as JSONProduct).variants?.length) {
      const product = item as JSONProduct
      for (const variant of product.variants) {
        if (!variant._componentsData) {
          variant._componentsData = {}
        }
        variant._componentsData[language] = await createComponentsInput({
          components: variant.components,
          componentDefinitions: shape.variantComponents,
          language,
          grids: allGrids,
          context,
          onUpdate,
        })

        if (variant._componentsData?.[language]) {
          Object.keys(variant._componentsData?.[language]).forEach(
            (componentId: string) => {
              const componentContent: ComponentContentInput =
                variant._componentsData?.[language][componentId]

              componentContent &&
                !hasItemRelationsComponent(componentContent) &&
                updates.push(() =>
                  context.callPIM(
                    buildUpdateVariantComponentQueryAndVariables({
                      productId: itemId,
                      sku: variant.sku,
                      language,
                      input: {
                        componentId,
                        ...componentContent,
                      },
                    })
                  )
                )
            }
          )
        }
      }
    }

    const responses: any[] = []
    for (let i = 0; i < updates.length; i++) {
      responses.push(await updates[i]())
    }
    context.emit(EVENT_NAMES.ITEM_UPDATED, {
      id: itemId,
      name: getTranslation(item.name, language),
      language,
      shape: {
        type: shape.type,
        identifier: shape.identifier,
      },
    } as ItemEventPayloadCreatedOrUpdated)

    return responses
  }

  function createProductBaseInfo() {
    const product = item as JSONProduct

    const vatType = context.vatTypes?.find(
      (v) => v.name?.toLowerCase() === product.vatType.toLowerCase()
    )
    if (!vatType) {
      onUpdate({
        error: {
          code: 'CANNOT_HANDLE_PRODUCT',
          message: `Cannot create product "${product.name}". Vat type "${product.vatType}" does not exist`,
          item,
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
    shape: Shape,
    allGrids: JSONGrid[],
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
    delete variant.components
    if (shape.variantComponents) {
      jsonVariant._componentsData = {}
      if (jsonVariant.components) {
        jsonVariant._componentsData[language] = await createComponentsInput({
          components: jsonVariant.components,
          componentDefinitions: shape.variantComponents,
          language,
          grids: allGrids,
          context,
          onUpdate,
        })
      }
      if (jsonVariant._componentsData?.[language]) {
        Object.keys(jsonVariant._componentsData?.[language]).forEach(
          (componentId: string) => {
            const componentContent: ComponentContentInput =
              jsonVariant._componentsData?.[language][componentId]
            variant?.components || (variant.components = [])
            componentContent &&
              !hasItemRelationsComponent(componentContent) &&
              variant?.components?.push({
                componentId,
                ...componentContent,
              })
          }
        )
      } else {
        delete variant.components
      }
    }

    if (jsonVariant.images) {
      variant.images = await createImagesInput({
        images: jsonVariant.images,
        language,
        context,
        onUpdate,
      })
    }

    // This causes an internal error at the API right now. Setting the value to an empty
    // array has the same outcome as setting it to null
    if (variant.images === null) {
      variant.images = []
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
                initial: subscriptionPlanPrincingJsonToInput(
                    p.initial,
                    meteredVariables
                ),
              }),
              recurring: subscriptionPlanPrincingJsonToInput(
                  p.recurring,
                  meteredVariables
              ),
            }
          }),
        }
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
          ({ priceVariants, stockLocations, components, ...rest }) =>
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
      let existingProductVariant = existingProductVariants?.find(
        (v) =>
          v.sku === vr.sku ||
          (v.externalReference && v.externalReference === vr.externalReference)
      )
      if (!existingProductVariant && vr.externalReference) {
        existingProductVariant = existingProductVariants?.find(
          (v) => v.externalReference === vr.externalReference
        )
      }
      const variant = await createProductVariant(
        vr,
        language,
        context.shapes?.find((s) => s.identifier === item.shape) as Shape,
        allGrids,
        existingProductVariant
      )

      if (existingProductVariant) {
        const index = inp.variants.findIndex(
          (v) =>
            v.sku === vr.sku ||
            (v.externalReference &&
              v.externalReference === vr.externalReference)
        )
        inp.variants[index] = variant
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

  // Get new topics
  item._topicsData = {
    topicIds: await getTopicIds({
      topics: item.topics || [],
      language: context.targetLanguage || context.defaultLanguage,
      context,
    }),
  }

  if (itemId) {
    /**
     * Pull the item version info now and store it in the
     * context cace before any changes are made to it.
     * The version info will be read later before a
     * potential publishing of an item
     */
    if (context.config.itemPublish === 'auto') {
      await getItemVersionsForLanguages({
        itemId,
        languages: context.languages.map((l) => l.code),
        context,
      })
    }

    if (item._options?.moveToRoot) {
      if (item._parentId !== rootItemId) {
        await context.callPIM({
          query: buildMoveItemMutation(itemId, {
            parentId: rootItemId,
          }),
        })
      }
    } else if (
      item._exists &&
      item._parentId !== parentId &&
      itemId !== parentId &&
      parentId !== rootItemId // Do not move items to root unless _moveToRoot is set
    ) {
      /**
       * Move the item if it is a part of a children array,
       * or if item.parentExternalReference is passed
       */
      await context.callPIM({
        query: buildMoveItemMutation(itemId, {
          parentId,
          position: treePosition,
        }),
      })
    }

    // Merge in existing topic
    if (item.topics && context.config.itemTopics === 'amend') {
      const existingTopicIds = await getExistingTopicIdsForItem(
        itemId,
        context.targetLanguage || context.defaultLanguage,
        context
      )

      item._topicsData.topicIds = Array.from(
        new Set([...existingTopicIds, ...item._topicsData.topicIds])
      )
    }

    const responses = await updateForLanguage(
      context.targetLanguage || context.defaultLanguage,
      itemId
    )
    if (responses?.length) {
      responses.forEach((response) => {
        const result = response?.data?.[shape?.type]?.update
        if (result) {
          const {
            id,
            externalReference,
            tree: { path },
          } = result
          context.itemCataloguePathToIDMap.set(item.cataloguePath || path, {
            itemId: id,
          })

          if (externalReference) {
            context.itemExternalReferenceToIDMap.set(externalReference, {
              itemId: id,
            })
          }
        }
      })
    }
  } else {
    // Ensure a name is set for the default language (required by the API)
    if (
      !getTranslation(
        item.name,
        context.targetLanguage || context.defaultLanguage
      )
    ) {
      onUpdate({
        error: {
          code: 'CANNOT_HANDLE_ITEM',
          message: `Item name cannot be empty for the default language. Item id: "${item.id}"`,
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
          error: {
            code: 'CANNOT_HANDLE_PRODUCT',
            message: `Skipping  "${getTranslation(
              item.name,
              context.targetLanguage || context.defaultLanguage
            )}". No variants defined for product`,
            item,
          },
        })
        return null
      }
    }

    const response = await createForLanguage(
      context.targetLanguage || context.defaultLanguage
    )

    const result = response?.data?.[shape?.type]?.create
    if (result) {
      const {
        id,
        externalReference,
        tree: { path },
      } = result
      context.itemCataloguePathToIDMap.set(item.cataloguePath || path, {
        itemId: id,
      })
      if (externalReference) {
        context.itemExternalReferenceToIDMap.set(externalReference, {
          itemId: id,
        })
      }
      itemId = id as string

      const language = context.targetLanguage || context.defaultLanguage
      context.emit(EVENT_NAMES.ITEM_CREATED, {
        id,
        name: getTranslation(item.name, language),
        language,
        shape: {
          type: shape.type,
          identifier: shape.identifier,
        },
      } as ItemEventPayloadCreatedOrUpdated)

      // Set the component data for the item
      await updateForLanguage(
        context.targetLanguage || context.defaultLanguage,
        itemId
      )
    }
  }

  if (!itemId) {
    onUpdate({
      error: {
        code: 'CANNOT_HANDLE_ITEM',
        message: `Could not create or update item "${getTranslation(
          item.name,
          context.targetLanguage || context.defaultLanguage
        )}"`,
      },
    })
    return null
  }

  // Handle remaining languages
  const remainingLanguages = context.languages
    .filter((l) => !l.isDefault)
    .map((l) => l.code)

  for (let i = 0; i < remainingLanguages.length; i++) {
    await updateForLanguage(remainingLanguages[i], itemId)
  }

  return itemId
}
