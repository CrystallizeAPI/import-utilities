import test from 'ava'
import { GridUpdateInput } from '../types/grids/grid.input'
import { buildUpdateGridMutation } from './build-update-grid-mutation'

test('create grid', (t) => {
  const grid: GridUpdateInput = {
    id: '123',
    language: 'en',
    input: {
      name: 'My grid',
      rows: [
        {
          columns: [
            {
              itemId: '987',
              layout: {
                rowspan: 2,
                colspan: 2,
              },
            },
          ],
        },
      ],
    },
  }

  const got = buildUpdateGridMutation(grid).replace(/ /g, '')
  const want: string = `
    mutation {
      grid {
        update (
          id: "123",
          language: "en",
          input: {
            name: "My grid",
            rows: [
              {
                columns: [
                  {
                    itemId: "987",
                    layout: {
                      rowspan: 2,
                      colspan: 2
                    }
                  }
                ]
              }
            ]
          }
        ) {
          id
          name
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
