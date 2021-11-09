import test from 'ava'

import { StockLocationInput } from '../types/stock-location/stock-location'
import { buildCreateStockLocationMutation } from './build-create-stock-location-mutation'

test('create mutation for price variant', (t) => {
  const stockLocation: StockLocationInput = {
    identifier: 'europe-warehouse',
    name: 'Europe Warehouse',
    tenantId: '1234',
    settings: {
      minimum: 0,
    },
  }

  const got = buildCreateStockLocationMutation(stockLocation).replace(/ /g, '')
  const want: string = `
    mutation {
      stockLocation {
        create (
          input: {
            identifier: "europe-warehouse",
            name: "Europe Warehouse",
            tenantId: "1234",
            settings: {
              minimum: 0
            }
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
