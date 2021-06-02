import test from 'ava'

import { PriceVariantInput } from '../types/price-variant/price-variant'
import { buildCreatePriceVariantMutation } from './build-create-price-variant-mutation'

test('create mutation for price variant', (t) => {
  const priceVariant: PriceVariantInput = {
    identifier: 'europe',
    name: 'Europe',
    tenantId: '1234',
    currency: 'EUR',
  }

  const got = buildCreatePriceVariantMutation(priceVariant).replace(/ /g, '')
  const want: string = `
    mutation {
      priceVariant {
        create (
          input: {
            identifier: "europe",
            name: "Europe",
            tenantId: "1234",
            currency: "EUR"
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
