import test from 'ava'
import { TenantInput } from '../types'
import { shapeTypes } from '../types/shapes/shape.input'
import { buildCreateTenantMutation } from './build-create-tenant-mutation'

test('create mutation for basic tenant', (t) => {
  const input: TenantInput = {
    identifier: 'cool-shop',
    name: 'Cool Shop',
  }

  const got = buildCreateTenantMutation(input).replace(/ /g, '')
  const want: string = `
    mutation {
      tenant {
        create(
          input: {
            identifier: "cool-shop",
            name: "Cool Shop"
          }
        ) {
          id
          identifier
          rootItemId
          shapes {
            identifier
            name
          }
          defaults {
            language
            currency
          }
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})

test('create mutation for tenant with shapes', (t) => {
  const input: TenantInput = {
    identifier: 'cool-shop',
    name: 'Cool Shop',
    shapes: [
      {
        identifier: 'cool-product',
        name: 'Cool Product',
        type: shapeTypes.product,
      },
      {
        identifier: 'less-cool-product',
        name: 'Less Cool Product',
        type: shapeTypes.product,
      },
    ],
    defaults: {
      language: 'no',
      currency: 'NOK',
    },
  }

  const got = buildCreateTenantMutation(input).replace(/ /g, '')
  const want: string = `
    mutation {
      tenant {
        create(
          input: {
            identifier: "cool-shop",
            name: "Cool Shop",
            shapes: [
              {
                identifier: "cool-product",
                name: "Cool Product",
                type: product
              },
              {
                identifier: "less-cool-product",
                name: "Less Cool Product",
                type: product
              }
            ],
            defaults: {
              language: "no",
              currency: "NOK"
            }
          }
        ) {
          id
          identifier
          rootItemId
          shapes {
            identifier
            name
          }
          defaults {
            language
            currency
          }
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
