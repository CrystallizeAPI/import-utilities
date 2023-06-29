import {
  ContentChunkComponentConfig,
  KeyValuePairInput,
  ShapeComponent,
} from '@crystallize/schema'
import {
  BooleanComponentContentInput,
  ComponentChoiceComponentContentInput,
  ComponentContentInput,
  ContentChunkComponentContentInput,
  DateTimeComponentContentInput,
  GridRelationsComponentContentInput,
  ImagesComponentContentInput,
  ItemRelationsComponentContentInput,
  LocationComponentContentInput,
  NumericComponentContentInput,
  ParagraphCollectionComponentContentInput,
  PropertiesTableComponentContentInput,
  RichTextContentInput,
  SelectionComponentContentInput,
  SingleLineComponentContentInput,
  VideosComponentContentInput,
} from '../../../types'
import { ICreateComponentsInput } from './types'
import {
  JSONComponentChoice,
  JSONComponentContent,
  JSONContentChunk,
  JSONDateTime,
  JSONFiles,
  JSONGrid,
  JSONImages,
  JSONLocation,
  JSONNumeric,
  JSONParagraphCollection,
  JSONPropertiesTable,
  JSONRichTextTranslated,
  JSONSelection,
  JSONVideos,
} from '../../json-spec'
import {
  BootstrapperContext,
  BootstrapperError,
  EVENT_NAMES,
  getTranslation,
} from '../utils'
import { createImagesInput } from './createImagesInput'
import { createVideosInput } from './createVideosInput'
import { FileContentInput } from '../../../generated/graphql'
import { createFilesInput } from './createFilesInput'
import { createRichTextInput } from './createRichTextInput'

export async function createComponentsInput(
  props: ICreateComponentsInput
): Promise<Record<string, ComponentContentInput> | null | undefined> {
  const {
    components,
    componentDefinitions,
    language,
    grids,
    context,
    onUpdate,
  } = props

  // Explicit `null` clears all components data
  if (components === null) {
    return null
  }

  // Undefined implies no action to be taken on components
  if (!components) {
    return undefined
  }

  const input: Record<string, ComponentContentInput> = {}

  async function createComponentInput(
    componentDefinition: ShapeComponent,
    component: JSONComponentContent,
    context: BootstrapperContext
  ) {
    switch (componentDefinition?.type) {
      case 'boolean': {
        const b = component as boolean

        if (!b) {
          return {
            boolean: null,
          }
        }

        const inp: BooleanComponentContentInput = {
          boolean: {
            value: b,
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
        for (let i = 0; i < paragraphs?.length; i++) {
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
            skus: [], // Will be populated later
          },
        }
        return inp

        return undefined
      }
      case 'gridRelations': {
        const gridsComponent = component as JSONGrid[]
        const gridIds: string[] = []

        gridsComponent.forEach((g) => {
          const found = grids.find(
            (a) =>
              getTranslation(a.name, language) ===
              getTranslation(g.name, language)
          )
          if (found?.id) {
            gridIds.push(found.id)
          } else {
            const err: BootstrapperError = {
              error: `Could not find grid with name "${g.name}". Skipping the grid relation.`,
              willRetry: false,
              type: 'error',
            }
            context.emit(EVENT_NAMES.ERROR, err)
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

        for (let i = 0; i < chunks?.length; i++) {
          const newChunk: ComponentContentInput[] = []
          const chunk = chunks[i]
          const chunkKeys = Object.keys(chunk)
          for (let x = 0; x < chunkKeys.length; x++) {
            const componentId = chunkKeys[x]
            const selectedComponentDefinition = (
              componentDefinition.config as ContentChunkComponentConfig
            )?.components?.find((c: any) => c.id === componentId)

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

  const componentIds = Object.keys(components)

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
    const componentDefinition = componentDefinitions?.find(
      (c) => c.id === componentId
    )
    if (componentDefinition && components) {
      if (componentId in components) {
        const component = components?.[componentId]
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
