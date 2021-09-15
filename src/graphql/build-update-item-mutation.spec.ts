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
import { buildUpdateItemMutation } from './build-update-item-mutation'

test('update mutation for product', (t) => {
  const input: CreateProductInput = {
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

  const got = buildUpdateItemMutation(
    '1234',
    input,
    ItemType.Product,
    'en'
  ).replace(/ /g, '')
  const want: string = `
    mutation {
      product {
        update (
          id: "1234",
          input: {
            vatTypeId: "1234",
            name: "Cool Product",
            variants: [
              {
                isDefault: true,
                sku: "cool-product",
                name: "Cool Product"
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

test('update mutation for document', (t) => {
  const input: CreateDocumentInput = {
    name: 'Cool Document',
  }

  const got = buildUpdateItemMutation(
    '1234',
    input,
    ItemType.Document,
    'en'
  ).replace(/ /g, '')
  const want: string = `
    mutation {
      document {
        update (
          id: "1234",
          input: {
            name: "Cool Document"
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

test('update mutation for folder', (t) => {
  const input: CreateFolderInput = {
    name: 'Cool Folder',
  }

  const got = buildUpdateItemMutation(
    '1234',
    input,
    ItemType.Folder,
    'en'
  ).replace(/ /g, '')
  const want: string = `
    mutation {
      folder {
        update (
          id: "1234",
          input: {
            name: "Cool Folder"
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

test('update mutation for items with components', (t) => {
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
    name: 'Cool Folder',
    components: {
      properties: propertiesTableComponent,
      location: locationComponent,
    },
  }

  const got = buildUpdateItemMutation(
    '1234',
    input,
    ItemType.Folder,
    'en'
  ).replace(/ /g, '')
  const want: string = `
    mutation {
      folder {
        update (
          id: "1234",
          input: {
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

test('update mutation for items with content chunk component', (t) => {
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
    name: 'Cool Folder',
    components: {
      chunk: chunkComponent,
    },
  }

  const got = buildUpdateItemMutation(
    '1234',
    input,
    ItemType.Folder,
    'en'
  ).replace(/ /g, '')
  const want: string = `
    mutation {
      folder {
        update (
          id: "1234",
          input: {
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
