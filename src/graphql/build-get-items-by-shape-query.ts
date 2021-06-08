import { jsonToGraphQLQuery } from 'json-to-graphql-query'

const basicComponentContent = [
  {
    __typeName: 'BooleanContent',
    value: true,
  },
  {
    __typeName: 'ComponentChoiceContent',
    selectedComponent: {
      componentId: true,
      type: true,
    },
  },
  {
    __typeName: 'DatetimeContent',
    datetime: true,
  },
  {
    __typeName: 'GridRelationsContent',
    grids: {
      id: true,
    },
  },
  {
    __typeName: 'ImageContent',
    images: {
      key: true,
    },
  },
  {
    __typeName: 'ItemRelationsContent',
    items: {
      id: true,
    },
  },
  {
    __typeName: 'LocationContent',
    lat: true,
    long: true,
  },
  {
    __typeName: 'NumericContent',
    number: true,
    unit: true,
  },
  {
    __typeName: 'PropertiesTableContent',
    sections: {
      title: true,
      properties: {
        key: true,
        value: true,
      },
    },
  },
  {
    __typeName: 'RichTextContent',
    json: true,
    html: true,
  },
  {
    __typeName: 'SingleLineContent',
    text: true,
  },
  {
    __typeName: 'VideoContent',
    videos: {
      id: true,
      title: true,
    },
  },
]

export const buildGetItemsByShapeQuery = (
  tenantId: string,
  identifier: string,
  language: string
): string => {
  const query = {
    query: {
      shape: {
        get: {
          __args: {
            tenantId,
            identifier,
          },
          identifier: true,
          name: true,
          items: {
            __args: {
              language,
            },
            __on: {
              __typeName: 'Product',
              variants: {
                id: true,
                isDefault: true,
                name: true,
                sku: true,
                price: true,
              },
            },
            id: true,
            name: true,
            components: {
              componentId: true,
              content: {
                __on: [
                  ...basicComponentContent,
                  {
                    __typeName: 'ContentChunkContent',
                    chunks: {
                      componentId: true,
                      type: true,
                      content: {
                        __on: basicComponentContent,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  }

  return jsonToGraphQLQuery(query)
}
