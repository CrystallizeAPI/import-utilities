import test from 'ava'
import { componentTypes } from '../types/shapes/components/component.input'
import { ShapeInput, shapeTypes } from '../types/shapes/shape.input'
import { buildCreateShapeMutation } from './build-create-shape-mutation'

test('create mutation for shape without components', (t) => {
  const shape: ShapeInput = {
    tenantId: '1234',
    name: 'Some Shape',
    type: shapeTypes.product,
  }

  const got = buildCreateShapeMutation(shape).replace(/ /g, '')
  const want: string = `
    mutation {
      shape {
        create (
          input: {
            tenantId: "1234",
            name: "Some Shape",
            type: product
          }
        ) {
          id
          name
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})

test('create mutation for shape with basic components', (t) => {
  const input: ShapeInput = {
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
  }

  const got = buildCreateShapeMutation(input).replace(/ /g, '')
  const want: string = `
    mutation {
      shape {
        create (
          input: {
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
          id
          name
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
test('create mutation for shape with complex components', (t) => {
  const input: ShapeInput = {
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
  }

  const got = buildCreateShapeMutation(input).replace(/ /g, '')
  const want: string = `
    mutation {
      shape {
        create (
          input: {
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
          id
          name
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
