import test from 'ava'
import { EnumType } from 'json-to-graphql-query'
import { TenantInput } from '../types'
import { componentTypes } from '../types/shapes/shape-components/shape-component.input'
import { ShapeInput, shapeTypes } from '../types/shapes/shape.input'
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
          shapes {
            id
            name
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
        name: 'Cool Product',
        type: shapeTypes.product,
      },
      {
        name: 'Less Cool Product',
        type: shapeTypes.product,
      },
    ],
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
                name: "Cool Product",
                type: product
              },
              {
                name: "Less Cool Product",
                type: product
              }
            ]
          }
        ) {
          id
          identifier
          shapes {
            id
            name
          }
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
