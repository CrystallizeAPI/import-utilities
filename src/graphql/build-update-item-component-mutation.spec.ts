import test from 'ava'
import { ItemMutationsUpdateComponentArgs } from '../generated/graphql'
import { buildUpdateItemComponentMutation } from './build-update-item-component-mutation'

test('update mutation for boolean', (t) => {
  const args: ItemMutationsUpdateComponentArgs = {
    itemId: '1234',
    language: 'en',
    input: {
      componentId: 'my-boolean-component',
      boolean: {
        value: true,
      },
    },
  }

  const got = buildUpdateItemComponentMutation(args).replace(/ /g, '')

  const want: string = `
    mutation {
      item {
        updateComponent (
          itemId: "1234",
          language: "en",
          input: {
            componentId: "my-boolean-component",
            boolean: {
              value: true
            }
          }
        ) {
          id
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
