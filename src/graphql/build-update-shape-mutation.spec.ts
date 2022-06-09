import test from 'ava'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

import { componentTypes } from '../types/shapes/components/component.input'
import { ShapeUpdateInput } from '../types/shapes/shape.input'
import {
  buildUpdateShapeMutation,
  buildUpdateShapeQueryAndVariables,
} from './build-update-shape-mutation'

interface testCase {
  name: string
  fn: (input: ShapeUpdateInput) => any
  input: ShapeUpdateInput
  expected: string | { query: DocumentNode; variables?: Record<string, any> }
}

const testCases: testCase[] = [
  {
    name: 'buildUpdateShapeMutation for shape without components',
    fn: buildUpdateShapeMutation,
    input: {
      id: 'some-id',
      identifier: 'my-shape',
      tenantId: '1234',
      input: {
        name: 'my shape (updated)',
      },
    },
    expected: `
      mutation {
        shape {
          update (
            id: "some-id",
            identifier: "my-shape",
            tenantId: "1234",
            input: {
              name: "my shape (updated)"
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
    name: 'buildUpdateShapeMutation for shape with basic components',
    fn: buildUpdateShapeMutation,
    input: {
      id: 'some-id',
      identifier: 'my-shape',
      tenantId: '1234',
      input: {
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
    expected: `
      mutation {
        shape {
          update (
            id: "some-id",
            identifier: "my-shape",
            tenantId: "1234",
            input: {
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
    name: 'buildUpdateShapeQueryAndVariables for shape without components',
    fn: buildUpdateShapeQueryAndVariables,
    input: {
      id: 'some-id',
      identifier: 'my-shape',
      tenantId: '1234',
      input: {
        name: 'my shape (updated)',
      },
    },
    expected: {
      query: gql`
        mutation UPDATE_SHAPE($input: UpdateShapeInput!) {
          shape {
            update(input: $input) {
              identifier
              name
            }
          }
        }
      `,
      variables: {
        input: {
          id: 'some-id',
          identifier: 'my-shape',
          tenantId: '1234',
          input: {
            name: 'my shape (updated)',
          },
        },
      },
    },
  },
  {
    name: 'buildUpdateShapeQueryAndVariables for shape with basic components',
    fn: buildUpdateShapeQueryAndVariables,
    input: {
      id: 'some-id',
      identifier: 'my-shape',
      tenantId: '1234',
      input: {
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
    expected: {
      query: gql`
        mutation UPDATE_SHAPE($input: UpdateShapeInput!) {
          shape {
            update(input: $input) {
              identifier
              name
            }
          }
        }
      `,
      variables: {
        input: {
          id: 'some-id',
          identifier: 'my-shape',
          tenantId: '1234',
          input: {
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
