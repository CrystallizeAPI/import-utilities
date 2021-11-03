// @ts-ignore
import fromHTML from '@crystallize/content-transformer/fromHTML'

import {
  BooleanComponentContentInput,
  Component,
  ComponentChoiceComponentContentInput,
  ComponentContentInput,
  ContentChunkComponentContentInput,
  CreateProductVariantInput,
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
  buildCreateItemMutation,
  buildUpdateItemMutation,
  buildMoveItemMutation,
  buildUpdateItemComponentMutation,
} from '../../graphql'

import {
  JSONItem,
  JSONParagraphCollection,
  JsonSpec,
  JSONRichText,
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
  JSONItemTopic,
  JSONSelection,
  JSONVideos,
  JSONVideo,
  JSONGrid,
  JSONProductVariant,
} from '../json-spec'
import {
  callPIM,
  getItemIdFromCataloguePath,
  getItemIdFromExternalReference,
  getTenantId,
  getTranslation,
  AreaUpdate,
  BootstrapperContext,
  uploadFileFromUrl,
  validShapeIdentifier,
  fileUploader,
  ItemVersionDescription,
  getItemVersionsForLanguages,
} from './utils'
import { getAllGrids } from './utils/get-all-grids'
import { ffmpegAvailable } from './utils/remote-file-upload'
import { ProductVariant } from '../../generated/graphql'
import { getProductVariants } from './utils/get-product-variants'
import { getTopicIds } from './utils/get-topic-id'

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

function createRichTextInput(content: JSONRichText, language: string) {
  function stringToJson(str: string) {
    return [
      JSON.parse(
        JSON.stringify({
          kind: 'block',
          type: 'paragraph',
          textContent: str,
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

    if (keys[0] === 'html') {
      inp.json = fromHTML(content?.html)
    } else {
      const isNotTranslated = keys.length > 0 && typeof c[keys[0]] !== 'string'
      const translatedContent = isNotTranslated
        ? c
        : getTranslation(c, language)

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

interface ICreateImagesInput {
  images: JSONImages
  language: string
  onUpdate(t: AreaUpdate): any
}

async function createImagesInput(
  props: ICreateImagesInput
): Promise<ImageComponentContentInput[]> {
  const { images, language, onUpdate } = props
  const imgs: ImageComponentContentInput[] = []

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    let { key, mimeType } = image

    if (!key) {
      try {
        const uploadResult = await uploadFileFromUrl(image.src)
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

interface ICreateVideosInput {
  videos: JSONVideos
  language: string
  onUpdate(t: AreaUpdate): any
}

async function createVideosInput(
  props: ICreateVideosInput
): Promise<VideoContentInput[]> {
  const { videos, language, onUpdate } = props

  const vids: VideoContentInput[] = []

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i]
    let { key } = video

    if (!key) {
      try {
        const uploadResult = await uploadFileFromUrl(video.src)
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
          }),
        }),
      })
    }
  }

  return vids
}

interface ICreateComponentsInput {
  item: JSONItem
  shape: Shape
  language: string
  grids: JSONGrid[]
  onUpdate(t: AreaUpdate): any
}

async function createComponentsInput(
  props: ICreateComponentsInput
): Promise<Record<string, ComponentContentInput> | null | undefined> {
  const { item, shape, language, grids, onUpdate } = props

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
    component: JSONComponentContent
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
        const images = component as JSONImage[]

        const inp: ImagesComponentContentInput = {
          images: await createImagesInput({ images, language, onUpdate }),
        }

        return inp
      }
      case 'videos': {
        const videos = component as JSONVideo[]

        const inp: VideosComponentContentInput = {
          videos: await createVideosInput({ videos, language, onUpdate }),
        }
        return inp
      }
      case 'richText': {
        const inp: RichTextContentInput = createRichTextInput(
          component as JSONRichText,
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
              images: await createImagesInput({ images, language, onUpdate }),
            }),
            ...(videos && {
              videos: await createVideosInput({ videos, language, onUpdate }),
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
          choice[selectedComponentId]
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
                chunk[componentId]
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
    const componentDefinition = shape.components.find(
      (c) => c.id === componentId
    )
    if (componentDefinition && item.components) {
      if (componentId in item.components) {
        const component = item.components?.[componentId]
        if (component) {
          const content = await createComponentInput(
            componentDefinition,
            component
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
          code: 'OTHER',
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
          topicIds: await getTopicIds(
            item.topics || [],
            context.defaultLanguage.code
          ),
        }
      }

      return callPIM({
        query: buildCreateItemMutation(
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
        ),
      })
    }

    async function updateForLanguage(language: string, itemId: string) {
      if (!shape || !itemId) {
        onUpdate({
          warning: {
            code: 'OTHER',
            message: `Cannot update "${getTranslation(
              item.name,
              language
            )}" for language "${language}"`,
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

      const vatType = context.vatTypes?.find((v) => v.name === product.vatType)
      if (!vatType) {
        onUpdate({
          warning: {
            code: 'OTHER',
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
      let priceVariants
      let price
      if (jsonVariant.price && typeof jsonVariant.price === 'object') {
        const p = jsonVariant.price as Record<string, number>
        priceVariants = Object.keys(jsonVariant.price).map((identifier) => ({
          identifier,
          price: p[identifier],
        }))
      } else {
        price = jsonVariant.price
      }

      let attributes
      if (jsonVariant.attributes) {
        attributes = Object.keys(jsonVariant.attributes).map((attribute) => ({
          attribute,
          value: jsonVariant.attributes?.[attribute],
        }))
      }

      const { priceVariants: _p, ...restOfExistingProductVariant } =
        existingProductVariant || {}

      const variant: CreateProductVariantInput = {
        ...(restOfExistingProductVariant as CreateProductVariantInput),
        name: getTranslation(jsonVariant.name, language),
        sku: jsonVariant.sku,
        isDefault: jsonVariant.isDefault || false,
        stock: jsonVariant.stock ?? 0,
        ...(priceVariants
          ? { priceVariants }
          : {
              price: price ?? 0,
            }),
        ...(attributes && { attributes }),
      }

      if (jsonVariant.images) {
        variant.images = await createImagesInput({
          images: jsonVariant.images,
          language,
          onUpdate,
        })
      }

      /**
       * Temp: API does not like images being set to
       * null at the moment. #3983
       */
      if (variant.images === null) {
        delete variant.images
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
            ({ priceVariants, ...rest }) =>
              ({
                ...rest,
                priceVariants: priceVariants?.map((p) => ({
                  identifier: p.identifier,
                  price: p.price,
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
        defaultVariants.forEach((v) => (v.isDefault = false))
        defaultVariants[0].isDefault = true
      }

      return inp
    }

    let itemId = item.id

    let versionsInfo

    // Get new topics
    item._topicsData = {
      topicIds: await getTopicIds(
        item.topics || [],
        context.defaultLanguage.code
      ),
    }

    if (itemId) {
      versionsInfo = await getItemVersionsForLanguages({
        itemId,
        languages: context.languages.map((l) => l.code),
      })

      if (item._options?.moveToRoot) {
        await callPIM({
          query: buildMoveItemMutation(itemId, {
            parentId: rootItemId,
          }),
        })
      } else if (isInParentChildrenArray || item.parentExternalReference) {
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
            code: 'OTHER',
            message: `Item name cannot be empty for the default language`,
          },
        })
        console.log(JSON.stringify(item, null, 1))
        throw new Error(`Item name cannot be empty for the default language`)
      }

      const response = await createForLanguage(context.defaultLanguage.code)
      itemId = response?.data?.[shape?.type]?.create?.id
    }

    if (!itemId) {
      onUpdate({
        warning: {
          code: 'OTHER',
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

    if (item.externalReference) {
      item.id = await getItemIdFromExternalReference(
        item.externalReference,
        context.defaultLanguage.code,
        getTenantId(),
        context.useReferenceCache,
        item.shape
      )
    } else if (item.cataloguePath) {
      item.id = await getItemIdFromCataloguePath(
        item.cataloguePath,
        context.defaultLanguage.code,
        context.useReferenceCache
      )
    }

    if (item.parentExternalReference) {
      parentId = await getItemIdFromExternalReference(
        item.parentExternalReference,
        context.defaultLanguage.code,
        getTenantId(),
        context.useReferenceCache
      )
    }

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

    if (item.id && 'children' in item) {
      const itm = item as JSONFolder

      if (itm.children) {
        await Promise.all(
          itm.children.map((child) => handleItem(child, itm.id, true))
        )
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
            let id
            if (itemRelation.externalReference) {
              id = await getItemIdFromExternalReference(
                itemRelation.externalReference,
                context.defaultLanguage.code,
                getTenantId(),
                context.useReferenceCache
              )
            } else if (itemRelation.cataloguePath) {
              id = await getItemIdFromCataloguePath(
                itemRelation.cataloguePath,
                context.defaultLanguage.code,
                context.useReferenceCache
              )
            }
            if (id) {
              ids.push(id)
            }
          }
        })
      )

      return ids
    }

    if (item.components && item.id) {
      const versionsInfo = await getItemVersionsForLanguages({
        languages: context.languages.map((l) => l.code),
        itemId: item.id,
      })

      await Promise.all(
        Object.keys(item.components).map(async (componentId) => {
          const jsonItem = item.components?.[
            componentId
          ] as JSONComponentContent
          if (jsonItem) {
            const shape = context.shapes?.find(
              (s) => s.identifier === item.shape
            )
            const def = shape?.components.find((c) => c.id === componentId)

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
        if (versionsInfo[language] === ItemVersionDescription.Published) {
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
    await handleItem(spec.items[i], rootItemId, false)
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

  onUpdate({
    progress: 1,
  })
}
