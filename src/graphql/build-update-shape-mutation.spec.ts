import test from 'ava'

import { componentTypes } from '../types/shapes/components/component.input'
import { ShapeUpdateInput } from '../types/shapes/shape.input'
import { buildUpdateShapeMutation } from './build-update-shape-mutation'

test('update mutation for shape without components', (t) => {
  const shape: ShapeUpdateInput = {
    id: 'some-id',
    identifier: 'my-shape',
    tenantId: '1234',
    input: {
      name: 'my shape (updated)',
    },
  }

  const got = buildUpdateShapeMutation(shape).replace(/ /g, '')

  const want: string = `
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
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})

test('update mutation for shape with basic components', (t) => {
  const input: ShapeUpdateInput = {
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
  }

  const got = buildUpdateShapeMutation(input).replace(/ /g, '')
  const want: string = `
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
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
