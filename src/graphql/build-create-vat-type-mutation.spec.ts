import test from 'ava'

import { VatTypeInput } from '../types/vat-type/vat-type'
import { buildCreateVatTypeMutation } from './build-create-vat-type-mutation'

test('create mutation for vat type', (t) => {
  const vatType: VatTypeInput = {
    input: {
      tenantId: '1234',
      name: 'Regular',
      percent: 25,
    },
  }

  const got = buildCreateVatTypeMutation(vatType).replace(/ /g, '')
  const want: string = `
    mutation {
      vatType {
        create (
          input: {
            tenantId: "1234",
            name: "Regular",
            percent: 25
          }
        ) {
          name
          percent
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
