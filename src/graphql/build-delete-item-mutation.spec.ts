import test from 'ava'
import { ItemType } from '../types'
import { buildDeleteItemMutation } from './build-delete-item-mutation'

test('delete mutation for product', (t) => {
  const got = buildDeleteItemMutation('1234', ItemType.Product).replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      product {
        delete (id: "1234")
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})

test('delete mutation for document', (t) => {
  const got = buildDeleteItemMutation('1234', ItemType.Document).replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      document {
        delete (id: "1234")
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})

test('delete mutation for folder', (t) => {
  const got = buildDeleteItemMutation('1234', ItemType.Folder).replace(/ /g, '')
  const want: string = `
    mutation {
      folder {
        delete (id: "1234")
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
