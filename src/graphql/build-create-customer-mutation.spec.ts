import test from 'ava'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { CreateCustomerInput } from '../types/customer/create-customer-input'
import { buildCreateCustomerMutation } from './build-create-customer-mutation'

test('create customer', (t) => {
  const input: CreateCustomerInput = {
    tenantId: '1234',
    identifier: 'my-identifier',
    firstName: 'Harry',
    middleName: 'The',
    lastName: 'Wizard',
    companyName: 'Magic & Co',
    taxNumber: '1234',
    email: 'foo@example.com',
    phone: '123456789',
    addresses: [
      {
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
  }

  const got = buildCreateCustomerMutation(input)
  const want: { query: DocumentNode; variables: Record<string, any> } = {
    query: gql`
      mutation CREATE_CUSTOMER($input: CreateCustomerInput!) {
        customer {
          create(input: $input) {
            identifier
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
