import { EnumType } from 'json-to-graphql-query'

import {
  ComponentContentInput,
  CreateItemInput,
  ImageComponentContentInput,
  ImagesComponentContentInput,
  ItemType,
  Language,
  ParagraphCollectionComponentContentInput,
  RichTextComponentContentInput,
  RichTextContentInput,
  Shape,
  shapeTypes,
  SingleLineComponentContentInput,
} from '../../types'
import { buildCreateItemMutation, buildUpdateItemMutation } from '../../graphql'

import {
  JSONItem,
  JSONParagraphCollection,
  JSONSingleLine,
  JsonSpec,
  RichText,
  JSONRichTextStructured,
  JSONTranslation,
  JSONImages,
} from '../json-spec'
import {
  callPIM,
  getTenantId,
  getTranslation,
  StepStatus,
  TenantContext,
  uploadFileFromUrl,
} from './utils'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
  context: TenantContext
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

function createRichTextInput(content: RichText, language: string) {
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
    const isNotTranslated = keys.length > 0 && typeof c[keys[0]] !== 'string'
    const translatedContent = isNotTranslated ? c : getTranslation(c, language)

    if (typeof translatedContent === 'string') {
      inp.json = stringToJson(translatedContent)
    } else {
      if (translatedContent.json) {
        inp.json = translatedContent.json
      } else if (translatedContent.html) {
        inp.html = [translatedContent.html]
      } else if (translatedContent.plainText) {
        inp.json = stringToJson(translatedContent.plainText)
      }
    }
  }

  return inp
}

async function createImagesInput(
  images: JSONImages,
  language: string
): Promise<ImageComponentContentInput[]> {
  const imgs: ImageComponentContentInput[] = []

  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    let { key, mimeType } = image

    if (!key) {
      const uploadResult = await uploadFileFromUrl(image.src)
      key = uploadResult.key
      mimeType = uploadResult.mimeType

      // Store the values so that we don't re-upload again during import
      image.key = uploadResult.key
      image.mimeType = uploadResult.mimeType
    }

    imgs.push({
      key,
      mimeType,
      altText: getTranslation(image.altText, language),
      ...(image.caption && {
        caption: createRichTextInput(image.caption, language),
      }),
    })
  }

  return imgs
}

async function createComponentsInput(
  item: JSONItem,
  shape: Shape,
  language: string
) {
  if (!item.components) {
    return null
  }

  const input: Record<string, ComponentContentInput> = {}

  const componentIds = Object.keys(item.components)
  for (let i = 0; i < componentIds.length; i++) {
    const componentId = componentIds[i]
    const componentDefinition = shape.components.find(
      (c) => c.id === componentId
    )
    if (componentDefinition && item.components) {
      let content
      if (componentId in item.components) {
        const component = item.components?.[componentId]
        if (component) {
          switch (componentDefinition.type) {
            case 'singleLine': {
              const inp: SingleLineComponentContentInput = {
                singleLine: {
                  text: getTranslation(component, language),
                },
              }
              content = inp
              break
            }
            case 'richText': {
              const inp: RichTextContentInput = createRichTextInput(
                component as RichText,
                language
              )

              if (Object.keys(inp).length > 0) {
                content = {
                  richText: inp,
                }
              }
              break
            }
            case 'paragraphCollection': {
              const inp: ParagraphCollectionComponentContentInput = {
                componentId,
                paragraphCollection: {
                  paragraphs: [],
                },
              }

              const paragraphs = component as JSONParagraphCollection[]
              for (let i = 0; i < paragraphs.length; i++) {
                const { title, body, images } = paragraphs[i]

                inp.paragraphCollection.paragraphs.push({
                  title: {
                    text: getTranslation(title, language),
                  },
                  ...(body && { body: createRichTextInput(body, language) }),
                  ...(images && {
                    images: await createImagesInput(images, language),
                  }),
                })
              }

              if (Object.keys(inp).length > 0) {
                content = inp
              }

              break
            }
          }

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

export async function setItems({
  spec,
  onUpdate,
  context,
}: Props): Promise<void> {
  if (!spec?.items) {
    return
  }

  async function createItem(
    item: JSONItem,
    parentId: string
  ): Promise<string | null> {
    // Get the shape type
    const shape = context.shapes?.find((s) => s.identifier === item.shape)
    if (!shape) {
      console.log(JSON.stringify(context.shapes, null, 1))
      console.log('No shape found for item')
      return null
    }

    async function createForLanguage(language: string) {
      if (!shape) {
        return
      }

      return callPIM({
        query: buildCreateItemMutation(
          {
            name: getTranslation(item.name, language) || '',
            shapeIdentifier: item.shape,
            tenantId: getTenantId(),
            tree: {
              parentId,
            },
            components:
              (await createComponentsInput(item, shape, language)) || {},
          },
          // @ts-ignore
          shape?.type,
          language
        ),
      })
    }

    async function updateForLanguage(language: string, itemId: string) {
      if (!shape) {
        return
      }

      return callPIM({
        query: buildUpdateItemMutation(
          itemId,
          {
            name: getTranslation(item.name, language) || '',
            components:
              (await createComponentsInput(item, shape, language)) || {},
          },
          shape.type as ItemType,
          language
        ),
      })
    }

    const response = await createForLanguage(context.defaultLanguage.code)
    if (response?.errors) {
      console.log(JSON.stringify(response.errors, null, 1))
    }
    const itemId = response?.data?.[shape?.type]?.create?.id

    // Create for remaining languages
    const remainingLanguages = context.languages
      .filter((l) => !l.isDefault)
      .map((l) => l.code)

    for (let i = 0; i < remainingLanguages.length; i++) {
      await updateForLanguage(remainingLanguages[i], itemId)
    }

    return itemId
  }

  const rootItemId = await getTenantRootItemId()

  async function handleItem(item: JSONItem, parentId?: string) {
    const itemId = await createItem(item, parentId || rootItemId)

    if (itemId && item.children) {
      for (let i = 0; i < item.children.length; i++) {
        await handleItem(item.children[i], itemId)
      }
    }
  }

  for (let i = 0; i < spec.items.length; i++) {
    onUpdate({
      done: false,
      message: getTranslation(spec.items[i].name, context.defaultLanguage.code),
    })
    await handleItem(spec.items[i], rootItemId)
  }
}
