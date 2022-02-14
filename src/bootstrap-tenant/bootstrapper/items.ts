// @ts-ignore
import fromHTML from '@crystallize/content-transformer/fromHTML'
import gql from 'graphql-tag'

import {
  BooleanComponentContentInput,
  Component,
  ComponentChoiceComponentContentInput,
  ComponentContentInput,
  ContentChunkComponentContentInput,
  DateTimeComponentContentInput,
  GridRelationsComponentContentInput,
  ImageComponentContentInput,
  ImagesComponentContentInput,
  ItemRelationsComponentContentInput,
  ItemType,
  KeyValuePairInput,
  LocationComponentContentInput,
  NumericComponentContentInput,
  ParagraphCollectionComponentContentInput,
  PropertiesTableComponentContentInput,
  RichTextContentInput,
  SelectionComponentContentInput,
  Shape,
  SingleLineComponentContentInput,
  VideoContentInput,
  VideosComponentContentInput,
} from '../../types'
import {
  buildMoveItemMutation,
  buildCreateItemQueryAndVariables,
  buildUpdateItemQueryAndVariables,
  buildUpdateItemComponentQueryAndVariables,
} from '../../graphql'

import {
  JSONItem,
  JSONParagraphCollection,
  JsonSpec,
  JSONImages,
  JSONFolder,
  JSONProduct,
  JSONPropertiesTable,
  JSONNumeric,
  JSONLocation,
  JSONDateTime,
  JSONImage,
  JSONComponentContent,
  JSONComponentChoice,
  JSONContentChunk,
  JSONItemRelations,
  JSONItemRelation,
  JSONSelection,
  JSONVideos,
  JSONVideo,
  JSONGrid,
  JSONProductVariant,
  JSONProductSubscriptionPlanPricing,
  JSONProductVariantPriceVariants,
  JSONProductVariantSubscriptionPlanMeteredVariable,
  JSONProductVariantStockLocations,
  JSONRichTextTranslated,
  JSONFiles,
} from '../json-spec'
import {
  getTranslation,
  AreaUpdate,
  BootstrapperContext,
  validShapeIdentifier,
  ItemVersionDescription,
  getItemVersionsForLanguages,
  getItemId,
  chunkArray,
} from './utils'
import { getAllGrids } from './utils/get-all-grids'
import { ffmpegAvailable } from './utils/remote-file-upload'
import {
  CreateProductVariantInput,
  FileContentInput,
  FileInput,
  PriceVariantReferenceInput,
  ProductPriceVariant,
  ProductStockLocation,
  ProductVariant,
  ProductVariantAttributeInput,
  StockLocationReferenceInput,
  SubscriptionPlanMeteredVariable,
  SubscriptionPlanMeteredVariableReferenceInput,
  SubscriptionPlanPriceInput,
} from '../../generated/graphql'
import { getProductVariants } from './utils/get-product-variants'
import { getTopicIds } from './utils/get-topic-id'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

async function getTenantRootItemId(
  context: BootstrapperContext
): Promise<string> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
    query: gql`
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

function publishItem(
  language: string,
  id: string,
  context: BootstrapperContext
) {
  if (!id) {
    return Promise.resolve()
  }

  return context.callPIM({
    query: gql`
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

function createRichTextInput(
  content: JSONRichTextTranslated,
  language: string
) {
  function stringToJson(str: string) {
    return [
      JSON.parse(
        JSON.stringify({
          kind: 'block',
          type: 'paragraph',
          children: [
            {
              kind: 'inline',
              type: 'span',
              textContent: str,
            },
          ],
        })
      ),
    ]
  }

  const inp: RichTextContentInput = {}
  if (typeof content === 'string') {
    inp.json = stringToJson(content)
  } else if (typeof content === 'object') {
    /**
     * Determine if the rich text content is one of
     * {
     *  json: ...,
     *  html: ...,
     *  plainText: ...
     * }
     * or
     * {
     *  [lang]: {
     *    json: ...
     *    ...
     *  }
     * }
     *
     **/
    let c = content as any

    const keys = Object.keys(content || {})

    const isNotTranslated = ['json', 'html', 'plainText'].includes(keys[0])
    const translatedContent = isNotTranslated ? c : getTranslation(c, language)

    if (translatedContent?.html) {
      inp.json = fromHTML(translatedContent?.html)
    } else {
      if (typeof translatedContent === 'string') {
        inp.json = stringToJson(translatedContent)
      } else {
        if (translatedContent.json) {
          inp.json = translatedContent.json
        } else if (translatedContent.html) {
          inp.json = fromHTML(translatedContent.html)
        } else if (translatedContent.plainText) {
          inp.json = stringToJson(translatedContent.plainText)
        }
      }
    }
  }

  return inp
}

interface ICreateMediaInput {
  language: string
  context: BootstrapperContext
  onUpdate(t: AreaUpdate): any
}

interface ICreateImagesInput extends ICreateMediaInput {
  images: JSONImages
}

async function createImagesInput(
  props: ICreateImagesInput
): Promise<ImageComponentContentInput[]> {
  const { images, language, onUpdate, context } = props
  const imgs: ImageComponentContentInput[] = []

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    let { key, mimeType } = image

    if (!key) {
      try {
        const uploadResult = await context.uploadFileFromUrl(image.src)
        if (uploadResult) {
          key = uploadResult.key
          mimeType = uploadResult.mimeType

          // Store the values so that we don't re-upload again during import
          image.key = uploadResult.key
          image.mimeType = uploadResult.mimeType
        }
      } catch (e) {
        onUpdate({
          warning: {
            code: 'UPLOAD_FAILED',
            message: `Could not upload "${image.src}"`,
          },
        })
      }
    }

    if (key) {
      imgs.push({
        key,
        mimeType,
        altText: getTranslation(image.altText, language),
        ...(image.caption && {
          caption: createRichTextInput(image.caption, language),
        }),
      })
    }
  }

  return imgs
}

interface ICreateVideosInput extends ICreateMediaInput {
  videos: JSONVideos
}

async function createVideosInput(
  props: ICreateVideosInput
): Promise<VideoContentInput[]> {
  const { videos, language, context, onUpdate } = props

  const vids: VideoContentInput[] = []

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i]
    let { key } = video

    if (!key) {
      try {
        const uploadResult = await context.uploadFileFromUrl(video.src)
        if (uploadResult) {
          key = uploadResult.key

          // Store the values so that we don't re-upload again during import
          video.key = uploadResult.key
        }
      } catch (e) {
        onUpdate({
          warning: {
            code: 'UPLOAD_FAILED',
            message: `Could not upload "${key}"`,
          },
        })
      }
    }

    if (key) {
      vids.push({
        key,
        title: getTranslation(video.title, language),
        ...(video.thumbnails && {
          thumbnails: await createImagesInput({
            images: video.thumbnails,
            language,
            onUpdate,
            context,
          }),
        }),
      })
    }
  }

  return vids
}

interface ICreateFilesInput extends ICreateMediaInput {
  files: JSONFiles
}
async function createFilesInput(
  props: ICreateFilesInput
): Promise<FileInput[]> {
  const { files, language, context, onUpdate } = props

  const fs: FileInput[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    let { key } = file

    if (!key) {
      try {
        const uploadResult = await context.uploadFileFromUrl(file.src)
        if (uploadResult) {
          key = uploadResult.key

          // Store the values so that we don't re-upload again during import
          file.key = uploadResult.key
        }
      } catch (e) {
        onUpdate({
          warning: {
            code: 'UPLOAD_FAILED',
            message: `Could not upload "${key}"`,
          },
        })
      }
    }

    if (key) {
      fs.push({
        key,
        title: getTranslation(file.title, language),
      })
    }
  }

  return fs
}

interface ICreateComponentsInput {
  item: JSONItem
  shape: Shape
  language: string
  grids: JSONGrid[]
  context: BootstrapperContext
  onUpdate(t: AreaUpdate): any
}

async function createComponentsInput(
  props: ICreateComponentsInput
): Promise<Record<string, ComponentContentInput> | null | undefined> {
  const { item, shape, language, grids, context, onUpdate } = props

  /**
   * If you pass null, then we assume you want to
   * clear all the components data
   */

  if (item.components === null) {
    return null
  }

  /**
   * Returing undefined here leaves the
   * existing components untouched
   */
  if (!item.components) {
    return undefined
  }

  const input: Record<string, ComponentContentInput> = {}

  async function createComponentInput(
    componentDefinition: Component,
    component: JSONComponentContent,
    context: BootstrapperContext
  ) {
    switch (componentDefinition?.type) {
      case 'boolean': {
        const inp: BooleanComponentContentInput = {
          boolean: {
            value: component as boolean,
          },
        }
        return inp
      }
      case 'singleLine': {
        const inp: SingleLineComponentContentInput = {
          singleLine: {
            text: getTranslation(component, language),
          },
        }
        return inp
      }
      case 'numeric': {
        const n = component as JSONNumeric

        if (!n) {
          return {
            numeric: null,
          }
        }

        const inp: NumericComponentContentInput = {
          numeric: {
            number: n.number,
            unit: n.unit ?? '',
          },
        }
        return inp
      }
      case 'location': {
        const l = component as JSONLocation

        if (!l) {
          return {
            location: null,
          }
        }

        const inp: LocationComponentContentInput = {
          location: {
            lat: l.lat,
            long: l.long,
          },
        }
        return inp
      }
      case 'datetime': {
        const d = component as JSONDateTime

        if (!d) {
          return {
            datetime: null,
          }
        }

        const parsedDate = new Date(d)
        const inp: DateTimeComponentContentInput = {
          datetime: {
            datetime: parsedDate.toISOString(),
          },
        }

        return inp
      }
      case 'images': {
        const images = component as JSONImages

        const inp: ImagesComponentContentInput = {
          images: await createImagesInput({
            images,
            language,
            onUpdate,
            context,
          }),
        }

        return inp
      }
      case 'videos': {
        const videos = component as JSONVideos

        const inp: VideosComponentContentInput = {
          videos: await createVideosInput({
            videos,
            language,
            onUpdate,
            context,
          }),
        }
        return inp
      }
      case 'files': {
        const files = component as JSONFiles

        const inp: FileContentInput = {
          files: await createFilesInput({
            files,
            language,
            onUpdate,
            context,
          }),
        }
        return inp
      }
      case 'richText': {
        const inp: RichTextContentInput = createRichTextInput(
          component as JSONRichTextTranslated,
          language
        )

        if (Object.keys(inp).length > 0) {
          return {
            richText: inp,
          }
        }
        break
      }
      case 'selection': {
        const inp: SelectionComponentContentInput = {
          selection: {
            keys: [], // Todo
          },
        }
        const s = component as JSONSelection
        if (typeof s === 'string') {
          inp.selection.keys.push(s as string)
        } else if (Array.isArray(s)) {
          s.forEach((key: string) => inp.selection.keys.push(key))
        }
        return inp
      }
      case 'paragraphCollection': {
        const inp: ParagraphCollectionComponentContentInput = {
          paragraphCollection: {
            paragraphs: [],
          },
        }

        const paragraphs = component as JSONParagraphCollection[]
        for (let i = 0; i < paragraphs.length; i++) {
          const { title, body, images, videos } = paragraphs[i]

          inp.paragraphCollection.paragraphs.push({
            title: {
              text: getTranslation(title, language),
            },
            ...(body && { body: createRichTextInput(body, language) }),
            ...(images && {
              images: await createImagesInput({
                images,
                language,
                context,
                onUpdate,
              }),
            }),
            ...(videos && {
              videos: await createVideosInput({
                videos,
                language,
                context,
                onUpdate,
              }),
            }),
          })
        }

        if (Object.keys(inp).length > 0) {
          return inp
        }

        break
      }
      case 'propertiesTable': {
        const inp: PropertiesTableComponentContentInput = {
          propertiesTable: {
            sections: [],
          },
        }

        const sections = (component as JSONPropertiesTable) || []
        sections.forEach((section) => {
          const properties: KeyValuePairInput[] = []
          if (section.properties) {
            Object.keys(section.properties).forEach((key) => {
              properties.push({
                key,
                value: section.properties?.[key],
              } as KeyValuePairInput)
            })
          }

          inp.propertiesTable.sections?.push({
            title: section.title,
            properties,
          })
        })

        return inp
      }
      case 'componentChoice': {
        const choice = component as JSONComponentChoice

        const [selectedComponentId] = Object.keys(choice)

        if (!selectedComponentId) {
          return {
            componentChoice: null,
          }
        }

        const componentConfig = componentDefinition.config as any
        const selectedComponentDefinition = componentConfig.choices.find(
          (c: any) => c.id === selectedComponentId
        )

        const content = await createComponentInput(
          selectedComponentDefinition,
          choice[selectedComponentId],
          context
        )

        const inp: ComponentChoiceComponentContentInput = {
          componentChoice: {
            componentId: selectedComponentId,
            ...content,
          },
        }
        return inp
      }
      case 'itemRelations': {
        const inp: ItemRelationsComponentContentInput = {
          itemRelations: {
            itemIds: [], // Will be populated later
          },
        }
        return inp
      }
      case 'gridRelations': {
        const gridsComponent = component as JSONGrid[]
        const gridIds: string[] = []

        gridsComponent.forEach((g) => {
          const found = grids.find(
            (a) => a.name === getTranslation(g.name, language)
          )
          if (found?.id) {
            gridIds.push(found.id)
          }
        })

        const inp: GridRelationsComponentContentInput = {
          gridRelations: {
            gridIds,
          },
        }
        return inp
      }
      case 'contentChunk': {
        const chunks = (component as JSONContentChunk) || []
        const inp: ContentChunkComponentContentInput = {
          contentChunk: {
            chunks: [],
          },
        }

        for (let i = 0; i < chunks.length; i++) {
          const newChunk: ComponentContentInput[] = []
          const chunk = chunks[i]
          const chunkKeys = Object.keys(chunk)
          for (let x = 0; x < chunkKeys.length; x++) {
            const componentId = chunkKeys[x]
            const selectedComponentDefinition = componentDefinition.config.components.find(
              (c: any) => c.id === componentId
            )

            if (selectedComponentDefinition) {
              const content: any = await createComponentInput(
                selectedComponentDefinition,
                chunk[componentId],
                context
              )
              if (content) {
                newChunk.push({
                  componentId,
                  ...content,
                })
              }
            }
          }
          if (newChunk.length > 0) {
            inp.contentChunk.chunks.push(newChunk)
          }
        }

        return inp
      }
    }
  }

  const componentIds = Object.keys(item.components)

  /**
   * If you don't supply any components, let's not continue.
   * The intention of the user is probably to only update
   * any provided components
   */
  if (componentIds.length === 0) {
    return undefined
  }

  for (let i = 0; i < componentIds.length; i++) {
    const componentId = componentIds[i]
    const componentDefinition = shape.components?.find(
      (c) => c.id === componentId
    )
    if (componentDefinition && item.components) {
      if (componentId in item.components) {
        const component = item.components?.[componentId]
        /**
         * Make sure we don't just do a truthy check here,
         * because true & "" & 0 are all valid content
         */
        if (typeof component !== 'undefined') {
          const content = await createComponentInput(
            componentDefinition,
            component,
            context
          )

          if (typeof content !== 'undefined') {
            input[componentId] = {
              componentId,
              ...content,
            }
          }
        }
      }
    }
  }

  return input
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
  language: string,
  context: BootstrapperContext
): Promise<string[]> {
  const result = await context.callPIM({
    query: gql`
      query GET_ITEM_TOPICS($itemId: ID!, $language: String!) {
        item {
          get(id: $itemId, language: $language) {
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

function getSubscriptionPlanMeteredVariables({
  planIdentifier,
  context,
}: {
  planIdentifier: string
  context: BootstrapperContext
}): SubscriptionPlanMeteredVariable[] {
  const plan = context.subscriptionPlans?.find(
    (p) => p.identifier === planIdentifier
  )
  return plan?.meteredVariables || []
}

function getSubscriptionPlanPeriodId({
  planIdentifier,
  periodName,
  context,
}: {
  planIdentifier: string
  periodName: string
  context: BootstrapperContext
}): null | string {
  const plan = context.subscriptionPlans?.find(
    (p) => p.identifier === planIdentifier
  )
  if (plan) {
    return plan.periods?.find((p) => p.name === periodName)?.id || null
  }

  return null
}

function subscriptionPlanPrincingJsonToInput(
  pricing: JSONProductSubscriptionPlanPricing,
  meteredVaribles: SubscriptionPlanMeteredVariable[]
): SubscriptionPlanPriceInput {
  function handleMeteredVariable(
    mv: JSONProductVariantSubscriptionPlanMeteredVariable
  ): SubscriptionPlanMeteredVariableReferenceInput {
    const id = meteredVaribles.find((m) => m.identifier === mv.identifier)?.id
    if (!id) {
      throw new Error('Cannot find id for metered variable ' + mv.identifier)
    }

    return {
      id,
      tierType: mv.tierType,
      tiers: mv.tiers?.map((t) => ({
        threshold: t.threshold,
        priceVariants: handleJsonPriceToPriceInput({
          jsonPrice: t.price,
        }),
      })),
    }
  }

  return {
    priceVariants: handleJsonPriceToPriceInput({
      jsonPrice: pricing.price,
    }),
    meteredVariables: pricing.meteredVariables.map(handleMeteredVariable),
  }
}

function handleJsonPriceToPriceInput({
  jsonPrice,
  existingProductVariantPriceVariants,
}: {
  jsonPrice?: number | JSONProductVariantPriceVariants
  existingProductVariantPriceVariants?: ProductPriceVariant[] | null
}): PriceVariantReferenceInput[] {
  if (
    typeof jsonPrice === 'undefined' &&
    !existingProductVariantPriceVariants
  ) {
    return [
      {
        identifier: 'default',
        price: 0,
      },
    ]
  }

  const priceVariants: PriceVariantReferenceInput[] =
    existingProductVariantPriceVariants || []

  if (jsonPrice && typeof jsonPrice === 'object') {
    const p = jsonPrice as Record<string, number>
    Object.keys(jsonPrice).forEach((identifier) => {
      const existingEntry = priceVariants.find(
        (i) => i.identifier === identifier
      )
      if (existingEntry) {
        existingEntry.price = p[identifier]
      } else {
        priceVariants.push({
          identifier,
          price: p[identifier],
        })
      }
    })
  } else if (typeof jsonPrice !== 'undefined') {
    const defaultStock = priceVariants.find((i) => i.identifier === 'default')
    if (defaultStock) {
      defaultStock.price = jsonPrice
    } else {
      priceVariants.push({
        identifier: 'default',
        price: jsonPrice,
      })
    }
  }

  return priceVariants.map(({ identifier, price }) => ({
    identifier,
    price,
  }))
}

function handleJsonStockToStockInput({
  jsonStock,
  existingProductVariantStockLocations,
}: {
  jsonStock?: number | JSONProductVariantStockLocations
  existingProductVariantStockLocations?: ProductStockLocation[] | null
}): undefined | StockLocationReferenceInput[] {
  if (typeof jsonStock === undefined && !existingProductVariantStockLocations) {
    return undefined
  }

  const stockVariants: StockLocationReferenceInput[] =
    existingProductVariantStockLocations || []

  if (jsonStock && typeof jsonStock === 'object') {
    const p = jsonStock as Record<string, number>
    Object.keys(jsonStock).forEach((identifier) => {
      const existingEntry = stockVariants.find(
        (i) => i.identifier === identifier
      )
      if (existingEntry) {
        existingEntry.stock = p[identifier]
      } else {
        stockVariants.push({
          identifier,
          stock: p[identifier],
        })
      }
    })
  } else if (typeof jsonStock !== 'undefined') {
    const defaultStock = stockVariants.find((i) => i.identifier === 'default')
    if (defaultStock) {
      defaultStock.stock = jsonStock
    } else {
      stockVariants.push({
        identifier: 'default',
        stock: jsonStock,
      })
    }
  }

  return stockVariants.map(({ identifier, stock, meta }) => ({
    identifier,
    stock: stock ?? 0,
    meta: meta || [],
  }))
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

  const rootItemId = await getTenantRootItemId(context)
  const allGrids = await getAllGrids(context.defaultLanguage.code, context)

  /**
   * First off, let's start uploading all the images
   * in parallel with all the other PIM mutations
   */
  const allMediaUrls = getAllMediaUrls(spec.items)
  allMediaUrls.forEach(context.uploadFileFromUrl)

  // Pull the status every second
  const getFileuploaderStatusInterval = setInterval(() => {
    const doneUploads = context.fileUploader.workerQueue.filter(
      (u) => u.status !== 'not-started'
    )
    const progress = doneUploads.length / allMediaUrls.length
    onUpdate({
      message: 'media-upload-progress',
      progress,
    })

    if (progress === 1) {
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

  // Double the item count since we're doing add/update _and_ item relations later
  totalItems *= 2

  let finishedItems = 0

  async function createOrUpdateItem(
    item: JSONItem,
    parentId: string
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
        context,
        onUpdate,
      })
      item._topicsData = {}
      if (item.topics) {
        item._topicsData = {
          topicIds: await getTopicIds({
            topics: item.topics || [],
            language: context.defaultLanguage.code,
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
            },
            ...(item.topics && item._topicsData),
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
        context,
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
        existingProductVariants = await getProductVariants(
          language,
          itemId,
          context
        )
      }

      /**
       * Start with the basic item information
       */
      updates.push(
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

            updates.push(
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

      if (jsonVariant.images) {
        variant.images = await createImagesInput({
          images: jsonVariant.images,
          language,
          context,
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
        let existingProductVariant = existingProductVariants?.find(
          (v) =>
            v.sku === vr.sku ||
            (v.externalReference &&
              v.externalReference === vr.externalReference)
        )
        if (!existingProductVariant && vr.externalReference) {
          existingProductVariant = existingProductVariants?.find(
            (v) => v.externalReference === vr.externalReference
          )
        }
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
        context,
      }),
    }

    if (itemId) {
      /**
       * Get the item version info now and store it in the
       * context cace before any changes are made to it.
       * The version info will be read later before a
       * potential publishing of an item
       */
      if (context.config.itemPublish === 'auto') {
        versionsInfo = await getItemVersionsForLanguages({
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
        itemId !== parentId
      ) {
        /**
         * Move the item if it is a part of a children array,
         * or if item.parentExternalReference is passed
         */
        await context.callPIM({
          query: buildMoveItemMutation(itemId, {
            parentId,
          }),
        })
      }

      // Merge in existing topic
      if (item.topics && context.config.itemTopics === 'amend') {
        const existingTopicIds = await getExistingTopicIdsForItem(
          itemId,
          context.defaultLanguage.code,
          context
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

    // Handle remaining languages
    const remainingLanguages = context.languages
      .filter((l) => !l.isDefault)
      .map((l) => l.code)

    for (let i = 0; i < remainingLanguages.length; i++) {
      await updateForLanguage(remainingLanguages[i], itemId)
    }

    return itemId
  }

  async function handleItem(item: JSONItem, parentId?: string) {
    if (!item) {
      return
    }

    const itemAndParentId = await getItemId({
      externalReference: item.externalReference,
      cataloguePath: item.cataloguePath,
      context,
      language: context.defaultLanguage.code,
      tenantId: context.tenantId,
      shapeIdentifier: item.shape,
    })

    item.id = itemAndParentId.itemId
    item._parentId = itemAndParentId.parentId

    if (item.parentExternalReference || item.parentCataloguePath) {
      const parentItemAndParentId = await getItemId({
        externalReference: item.parentExternalReference,
        cataloguePath: item.parentCataloguePath,
        context,
        language: context.defaultLanguage.code,
        tenantId: context.tenantId,
      })
      parentId = parentItemAndParentId.itemId
    }

    // If the item exists in Crystallize already
    item._exists = Boolean(item.id)

    item.id = (await createOrUpdateItem(item, parentId || rootItemId)) as string

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
        context.itemJSONCataloguePathToIDMap.set(item.cataloguePath, {
          itemId: item.id,
          parentId: parentId || rootItemId,
        })
      }

      if ('children' in item) {
        const itm = item as JSONFolder

        if (itm.children) {
          await Promise.all(
            itm.children.map((child) => handleItem(child, itm.id))
          )
        }
      }
    }
  }

  async function handleItemRelationsAndPublish(item: JSONItem) {
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
            const { itemId } = await getItemId({
              externalReference: itemRelation.externalReference,
              cataloguePath: itemRelation.cataloguePath,
              context,
              language: context.defaultLanguage.code,
              tenantId: context.tenantId,
            })

            if (itemId) {
              ids.push(itemId)
            }
          }
        })
      )

      return ids
    }

    if (item.id) {
      // Pull the item info from the cache
      const versionsInfo = context.itemVersions.get(item.id)

      if (item.components && item.id) {
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
                                      (c: any) =>
                                        c.componentId === itemRelationId
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
                    language: context.defaultLanguage.code,
                    input: mutationInput,
                  },
                })
              }
            }
          })
        )
      }

      // Publish if needed
      if (item.id) {
        for (let i = 0; i < context.languages.length; i++) {
          const passedPublishConfig = item._options?.publish
          if (typeof passedPublishConfig === 'boolean') {
            if (passedPublishConfig) {
              await publishItem(context.languages[i].code, item.id, context)
            }
          } else if (
            context.config.itemPublish === 'publish' ||
            !versionsInfo ||
            versionsInfo[context.languages[i].code] ===
              ItemVersionDescription.Published
          ) {
            await publishItem(context.languages[i].code, item.id, context)
          }
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
          await handleItemRelationsAndPublish(itm.children[i])
        }
      }
    }
  }

  const chunks = chunkArray({
    array: spec.items,
    chunkSize: context.config.experimental?.parallelize ? 5 : 1,
  })

  for (let i = 0; i < chunks.length; i++) {
    await Promise.all(
      chunks[i].map(async (c) => {
        try {
          await handleItem(c, rootItemId)
        } catch (e) {
          console.log(e)
          onUpdate({
            warning: {
              code: 'CANNOT_HANDLE_ITEM',
              message: `Skipping "${getTranslation(
                c.name,
                context.defaultLanguage.code
              )}"`,
            },
          })
        }
      })
    )
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
    await handleItemRelationsAndPublish(spec.items[i])
  }

  clearInterval(getFileuploaderStatusInterval)

  onUpdate({
    progress: 1,
  })
}
