import test from 'ava'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { CreateOrderInput } from '../types/order/create-order-input'
import { buildCreateOrderMutation } from './build-create-order-mutation'

test('create order', (t) => {
  const input: CreateOrderInput = {
    customer: {
      identifier: 'my-identifier',
      firstName: 'Harry',
      middleName: 'The',
      lastName: 'Wizard',
      companyName: 'Magic & Co',
      taxNumber: '1234',
      addresses: [
        {
          email: 'foo@example.com',
          phone: '123456789',
          type: 'billing',
          streetNumber: '1',
          street: 'Developer',
          street2: 'Way',
          city: 'Oslo',
          state: 'Oslo',
          country: 'Norway',
          postalCode: '1234',
        },
      ],
    },
    cart: [
      {
        name: 'Product 1',
        productId: 'some-product-id',
        productVariantId: 'some-product-variant-id',
        sku: 'some-sku',
        price: {
          currency: 'NZD',
          gross: 123,
          net: 234,
          tax: {
            name: 'GST',
            percent: 15,
          },
        },
      },
    ],
    total: 234,
  }

  const got = buildCreateOrderMutation(input)
  const want: { query: DocumentNode; variables: Record<string, any> } = {
    query: gql`
      mutation CREATE_ORDER($input: CreateOrderInput!) {
        orders {
          create(input: $input) {
            id
          }
        }
      }
    `,
    variables: {
      input,
    },
  }

  t.deepEqual(got, want, 'mutation and variables should match')
})
