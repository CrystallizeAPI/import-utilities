import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const buildGetItemsByShapeQuery = (
  id: string,
  language: string
): string => {
  const query = {
    query: {
      shape: {
        get: {
          __args: {
            id,
          },
          id: true,
          name: true,
          items: {
            __args: {
              language,
            },
            id: true,
            name: true,
            components: {
              componentId: true,
              content: {
                __on: [
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
                    __typeName: 'ContentChunkContent',
                    chunks: {
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
                    value: true,
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
