import test from 'ava'
import { TenantInput } from '../types'
import { buildCreateTenantMutation } from './build-create-tenant-mutation'
import { buildTenantQuery } from './build-tenant-query'

test('create tenant query with id', (t) => {
  const got = buildTenantQuery('1234').replace(/ /g, '')
  const want: string = `
    query {
      tenant {
        get (id: "1234") {
          id
          identifier
          name
          rootItemId
          availableLanguages {
            code
            name
            system
          }
          defaults {
            language
            currency
          }
          vatTypes {
            id
            name
            percent
          }
          shapes {
            identifier
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
