import test from 'ava'
import {
  ContentChunkComponentContentInput,
  ItemType,
  LocationComponentContentInput,
  NumericComponentContentInput,
  PropertiesTableComponentContentInput,
} from '../types'
import { CreateDocumentInput } from '../types/document/create-document-input'
import { CreateFolderInput } from '../types/folder/create-folder-input'
import { CreateProductInput } from '../types/product/create-product-input'
import { buildCreateItemMutation } from './build-create-item-mutation'

test('create mutation for product', (t) => {
  const input: CreateProductInput = {
    tenantId: '1234',
    shapeIdentifier: 'cool-product',
    vatTypeId: '1234',
    name: 'Cool Product',
    variants: [
      {
        isDefault: true,
        sku: 'cool-product',
        name: 'Cool Product',
      },
    ],
  }

  const got = buildCreateItemMutation(input, ItemType.Product, 'en').replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      product {
        create (
          input: {
            tenantId: "1234",
            shapeIdentifier: "cool-product",
            vatTypeId: "1234",
            name: "Cool Product",
            variants: [
              {
                isDefault: true,
                sku: "cool-product",
                name: "Cool Product"
              }
            ],
            components: []
          },
          language: "en"
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

test('create mutation for document', (t) => {
  const input: CreateDocumentInput = {
    tenantId: '1234',
    shapeIdentifier: 'cool-document',
    name: 'Cool Document',
  }

  const got = buildCreateItemMutation(input, ItemType.Document, 'en').replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      document {
        create (
          input: {
            tenantId: "1234",
            shapeIdentifier: "cool-document",
            name: "Cool Document",
            components: []
          },
          language: "en"
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

test('create mutation for folder', (t) => {
  const input: CreateFolderInput = {
    tenantId: '1234',
    shapeIdentifier: 'cool-folder',
    name: 'Cool Folder',
  }

  const got = buildCreateItemMutation(input, ItemType.Folder, 'en').replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      folder {
        create (
          input: {
            tenantId: "1234",
            shapeIdentifier: "cool-folder",
            name: "Cool Folder",
            components: []
          },
          language: "en"
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

test('create mutation for items with components', (t) => {
  const propertiesTableComponent: PropertiesTableComponentContentInput = {
    propertiesTable: {
      sections: [
        {
          title: 'Properties',
          properties: [
            {
              key: 'Coolness',
              value: '100%',
            },
          ],
        },
      ],
    },
  }

  const locationComponent: LocationComponentContentInput = {
    location: {
      lat: 123,
      long: 123,
    },
  }

  const input: CreateFolderInput = {
    tenantId: '1234',
    shapeIdentifier: 'cool-folder',
    name: 'Cool Folder',
    components: {
      properties: propertiesTableComponent,
      location: locationComponent,
    },
  }

  const got = buildCreateItemMutation(input, ItemType.Folder, 'en').replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      folder {
        create (
          input: {
            tenantId: "1234",
            shapeIdentifier: "cool-folder",
            name: "Cool Folder",
            components: [
              {
                propertiesTable: {
                  sections: [
                    {
                      title: "Properties",
                      properties: [
                        {
                          key: "Coolness",
                          value: "100%"
                        }
                      ]
                    }
                  ]
                },
                componentId: "properties"
              },
              {
                location: {
                  lat: 123,
                  long: 123
                },
                componentId: "location"
              }
            ]
          },
          language: "en"
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

test('create mutation for items with content chunk component', (t) => {
  const locationComponent: LocationComponentContentInput = {
    componentId: 'location',
    location: {
      lat: 123,
      long: 123,
    },
  }
  const numericComponent: NumericComponentContentInput = {
    componentId: 'numeric',
    numeric: {
      number: 123,
    },
  }
  const chunkComponent: ContentChunkComponentContentInput = {
    contentChunk: {
      chunks: [[locationComponent, numericComponent]],
    },
  }

  const input: CreateFolderInput = {
    tenantId: '1234',
    shapeIdentifier: 'cool-folder',
    name: 'Cool Folder',
    components: {
      chunk: chunkComponent,
    },
  }

  const got = buildCreateItemMutation(input, ItemType.Folder, 'en').replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      folder {
        create (
          input: {
            tenantId: "1234",
            shapeIdentifier: "cool-folder",
            name: "Cool Folder",
            components: [
              {
                contentChunk: {
                  chunks: [
                    [
                      {
                        componentId: "location",
                        location: {
                          lat: 123,
                          long: 123
                        }
                      },
                      {
                        componentId: "numeric",
                        numeric: {
                          number: 123
                        }
                      }
                    ]
                  ]
                },
                componentId: "chunk"
              }
            ]
          },
          language: "en"
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
