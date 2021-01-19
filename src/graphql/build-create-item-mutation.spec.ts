import test from 'ava'
import {
  LocationComponentContentInput,
  PropertiesTableComponentContentInput,
} from '../types'
import { DocumentInput } from '../types/document/document.input'
import { FolderInput } from '../types/folder/folder.input'
import { ProductInput } from '../types/product/product.input'
import { buildCreateItemMutation } from './build-create-item-mutation'

test('create mutation for product', (t) => {
  const input: ProductInput = {
    tenantId: '1234',
    shapeId: '1234',
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

  const got = buildCreateItemMutation(input, 'product', 'en').replace(/ /g, '')
  const want: string = `
    mutation {
      product {
        create (
          input: {
            tenantId: "1234",
            shapeId: "1234",
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

test('create mutation for document', (t) => {
  const input: DocumentInput = {
    tenantId: '1234',
    shapeId: '1234',
    name: 'Cool Document',
  }

  const got = buildCreateItemMutation(input, 'document', 'en').replace(/ /g, '')
  const want: string = `
    mutation {
      document {
        create (
          input: {
            tenantId: "1234",
            shapeId: "1234",
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

test('create mutation for folder', (t) => {
  const input: FolderInput = {
    tenantId: '1234',
    shapeId: '1234',
    name: 'Cool Folder',
  }

  const got = buildCreateItemMutation(input, 'folder', 'en').replace(/ /g, '')
  const want: string = `
    mutation {
      folder {
        create (
          input: {
            tenantId: "1234",
            shapeId: "1234",
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

test('create mutation for items with components', (t) => {
  const propertiesTableComponent: PropertiesTableComponentContentInput = {
    componentId: 'properties',
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
    componentId: 'location',
    location: {
      lat: 123,
      long: 123,
    },
  }

  const input: FolderInput = {
    tenantId: '1234',
    shapeId: '1234',
    name: 'Cool Folder',
    components: [propertiesTableComponent, locationComponent],
  }

  const got = buildCreateItemMutation(input, 'folder', 'en').replace(/ /g, '')
  const want: string = `
    mutation {
      folder {
        create (
          input: {
            tenantId: "1234",
            shapeId: "1234",
            name: "Cool Folder",
            components: [
              {
              componentId: "properties",
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
                }
              },
              {
                componentId: "location",
                location: {
                  lat: 123,
                  long: 123
                }
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
