import test from 'ava'
import { buildMoveItemMutation } from './build-move-item-mutation'

test('move item without position', (t) => {
  const got = buildMoveItemMutation('1234', { parentId: '5678' }).replace(
    / /g,
    ''
  )
  const want: string = `
    mutation {
      tree {
        moveNode (itemId: "1234", input: { parentId: "5678" }) {
          itemId
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})

test('move item with position', (t) => {
  const got = buildMoveItemMutation('1234', {
    parentId: '5678',
    position: 0,
  }).replace(/ /g, '')
  const want: string = `
    mutation {
      tree {
        moveNode (itemId: "1234", input: { parentId: "5678", position: 0 }) {
          itemId
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
