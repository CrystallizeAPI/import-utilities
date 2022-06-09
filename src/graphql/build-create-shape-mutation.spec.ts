import test from 'ava'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { componentTypes } from '../types/shapes/components/component.input'
import { ShapeInput, shapeTypes } from '../types/shapes/shape.input'
import {
  buildCreateShapeMutation,
  buildCreateShapeQueryAndVariables,
} from './build-create-shape-mutation'

interface testCase {
  name: string
  fn: (input: ShapeInput) => any
  input: ShapeInput
  expected: string | { query: DocumentNode; variables?: Record<string, any> }
}

const testCases: testCase[] = [
  {
    name: 'buildCreateShapeMutation for shape without components',
    fn: buildCreateShapeMutation,
    input: {
      identifier: 'my-shape',
      tenantId: '1234',
      name: 'Some Shape',
      type: shapeTypes.product,
    },
    expected: `
      mutation {
        shape {
          create (
            input: {
              identifier: "my-shape",
              tenantId: "1234",
              name: "Some Shape",
              type: product
            }
          ) {
            identifier
            name
          }
        }
      }
    `
      .replace(/\n/g, '')
      .replace(/ /g, ''),
  },
  {
    name: 'buildCreateShapeMutation for shape with basic components',
    fn: buildCreateShapeMutation,
    input: {
      identifier: 'my-shape',
      tenantId: '1234',
      name: 'Some Shape with Basic Components',
      type: shapeTypes.document,
      components: [
        {
          id: 'images',
          name: 'Images',
          type: componentTypes.images,
        },
        {
          id: 'description',
          name: 'Description',
          type: componentTypes.richText,
        },
      ],
    },
    expected: `
      mutation {
        shape {
          create (
            input: {
              identifier: "my-shape",
              tenantId: "1234",
              name: "Some Shape with Basic Components",
              type: document,
              components: [
                {
                  id: "images",
                  name: "Images",
                  type: images
                },
                {
                  id: "description",
                  name: "Description",
                  type: richText
                }
              ]
            }
          ) {
            identifier
            name
          }
        }
      }
    `
      .replace(/\n/g, '')
      .replace(/ /g, ''),
  },
  {
    name: 'buildCreateShapeMutation for shape with complex components',
    fn: buildCreateShapeMutation,
    input: {
      identifier: 'my-shape',
      tenantId: '1234',
      name: 'Some Shape with Complex Components',
      type: shapeTypes.document,
      components: [
        {
          id: 'chunk',
          name: 'Chunk',
          type: componentTypes.contentChunk,
          config: {
            contentChunk: {
              components: [
                {
                  id: 'relation',
                  name: 'Relation',
                  type: componentTypes.itemRelations,
                },
                {
                  id: 'isFeatured',
                  name: 'Is Featured',
                  type: componentTypes.boolean,
                },
              ],
              repeatable: true,
            },
          },
        },
        {
          id: 'properties',
          name: 'Properties',
          type: componentTypes.propertiesTable,
          config: {
            propertiesTable: {
              sections: [
                {
                  title: 'Dimensions',
                  keys: ['width', 'length', 'height'],
                },
              ],
            },
          },
        },
      ],
    },
    expected: `
      mutation {
        shape {
          create (
            input: {
              identifier: "my-shape",
              tenantId: "1234",
              name: "Some Shape with Complex Components",
              type: document,
              components: [
                {
                  id: "chunk",
                  name: "Chunk",
                  type: contentChunk,
                  config: {
                    contentChunk: {
                      components: [
                        {
                          id: "relation",
                          name: "Relation",
                          type: itemRelations
                        },
                        {
                          id: "isFeatured",
                          name: "Is Featured",
                          type: boolean
                        }
                      ],
                      repeatable: true
                    }
                  }
                },
                {
                  id: "properties",
                  name: "Properties",
                  type: propertiesTable,
                  config: {
                    propertiesTable: {
                      sections: [
                        {
                          title: "Dimensions",
                          keys: ["width", "length", "height"]
                        }
                      ]
                    }
                  }
                }
              ]
            }
          ) {
            identifier
            name
          }
        }
      }
    `
      .replace(/\n/g, '')
      .replace(/ /g, ''),
  },
  {
    name: 'buildCreateShapeQueryAndVariables for shape without components',
    fn: buildCreateShapeQueryAndVariables,
    input: {
      identifier: 'my-shape',
      tenantId: '1234',
      name: 'Some Shape',
      type: shapeTypes.product,
    },
    expected: {
      query: gql`
        mutation CREATE_SHAPE($input: CreateShapeInput!) {
          shape {
            create(input: $input) {
              identifier
              name
            }
          }
        }
      `,
      variables: {
        input: {
          identifier: 'my-shape',
          tenantId: '1234',
          name: 'Some Shape',
          type: shapeTypes.product,
        },
      },
    },
  },
  {
    name: 'buildCreateShapeQueryAndVariables for shape with basic components',
    fn: buildCreateShapeQueryAndVariables,
    input: {
      identifier: 'my-shape',
      tenantId: '1234',
      name: 'Some Shape with Basic Components',
      type: shapeTypes.document,
      components: [
        {
          id: 'images',
          name: 'Images',
          type: componentTypes.images,
        },
        {
          id: 'description',
          name: 'Description',
          type: componentTypes.richText,
        },
      ],
    },
    expected: {
      query: gql`
        mutation CREATE_SHAPE($input: CreateShapeInput!) {
          shape {
            create(input: $input) {
              identifier
              name
            }
          }
        }
      `,
      variables: {
        input: {
          identifier: 'my-shape',
          tenantId: '1234',
          name: 'Some Shape with Basic Components',
          type: shapeTypes.document,
          components: [
            {
              id: 'images',
              name: 'Images',
              type: componentTypes.images,
            },
            {
              id: 'description',
              name: 'Description',
              type: componentTypes.richText,
            },
          ],
        },
      },
    },
  },
  {
    name: 'buildUpdateShapeQueryAndVariables for shape with complex components',
    fn: buildCreateShapeQueryAndVariables,
    input: {
      identifier: 'my-shape',
      tenantId: '1234',
      name: 'Some Shape with Complex Components',
      type: shapeTypes.document,
      components: [
        {
          id: 'chunk',
          name: 'Chunk',
          type: componentTypes.contentChunk,
          config: {
            contentChunk: {
              components: [
                {
                  id: 'relation',
                  name: 'Relation',
                  type: componentTypes.itemRelations,
                },
                {
                  id: 'isFeatured',
                  name: 'Is Featured',
                  type: componentTypes.boolean,
                },
              ],
              repeatable: true,
            },
          },
        },
        {
          id: 'properties',
          name: 'Properties',
          type: componentTypes.propertiesTable,
          config: {
            propertiesTable: {
              sections: [
                {
                  title: 'Dimensions',
                  keys: ['width', 'length', 'height'],
                },
              ],
            },
          },
        },
      ],
    },
    expected: {
      query: gql`
        mutation CREATE_SHAPE($input: CreateShapeInput!) {
          shape {
            create(input: $input) {
              identifier
              name
            }
          }
        }
      `,
      variables: {
        input: {
          identifier: 'my-shape',
          tenantId: '1234',
          name: 'Some Shape with Complex Components',
          type: shapeTypes.document,
          components: [
            {
              id: 'chunk',
              name: 'Chunk',
              type: componentTypes.contentChunk,
              config: {
                contentChunk: {
                  components: [
                    {
                      id: 'relation',
                      name: 'Relation',
                      type: componentTypes.itemRelations,
                    },
                    {
                      id: 'isFeatured',
                      name: 'Is Featured',
                      type: componentTypes.boolean,
                    },
                  ],
                  repeatable: true,
                },
              },
            },
            {
              id: 'properties',
              name: 'Properties',
              type: componentTypes.propertiesTable,
              config: {
                propertiesTable: {
                  sections: [
                    {
                      title: 'Dimensions',
                      keys: ['width', 'length', 'height'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  },
]

testCases.forEach((tc) =>
  test(tc.name, (t) => {
    const actual = tc.fn(tc.input)
    if (typeof actual === 'string') {
      t.is(
        actual.replace(/ /g, ''),
        tc.expected,
        'mutation string should match'
      )
    } else {
      t.deepEqual(actual, tc.expected, 'query and variables should match')
    }
  })
)
