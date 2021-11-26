// @ts-ignore
import fromHTML from '@crystallize/content-transformer/fromHTML'

import { AreaUpdate, uploadFileFromUrl, getTranslation } from '..'
import {
  ImageComponentContentInput,
  VideoContentInput,
  Shape,
  ComponentContentInput,
  Component,
  BooleanComponentContentInput,
  SingleLineComponentContentInput,
  NumericComponentContentInput,
  LocationComponentContentInput,
  DateTimeComponentContentInput,
  ImagesComponentContentInput,
  VideosComponentContentInput,
  RichTextContentInput,
  SelectionComponentContentInput,
  ParagraphCollectionComponentContentInput,
  PropertiesTableComponentContentInput,
  KeyValuePairInput,
  ComponentChoiceComponentContentInput,
  ItemRelationsComponentContentInput,
  GridRelationsComponentContentInput,
  ContentChunkComponentContentInput,
} from '../../..'
import {
  JSONImages,
  JSONVideos,
  JSONItem,
  JSONGrid,
  JSONComponentContent,
  JSONNumeric,
  JSONLocation,
  JSONDateTime,
  JSONImage,
  JSONVideo,
  JSONRichText,
  JSONSelection,
  JSONParagraphCollection,
  JSONPropertiesTable,
  JSONComponentChoice,
  JSONContentChunk,
} from '../../json-spec'

interface ICreateImagesInput {
  images: JSONImages
  language: string
  onUpdate(t: AreaUpdate): any
}

export async function createImagesInput(
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

export async function createVideosInput(
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

export async function createComponentsInput(
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
    const componentDefinition = shape.components?.find(
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
