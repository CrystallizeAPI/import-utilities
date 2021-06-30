import test from 'ava'
import { GridInput } from '../types/grids/grid.input'
import { buildCreateGridMutation } from './build-create-grid-mutation'

test('create grid', (t) => {
  const grid: GridInput = {
    language: 'en',
    input: {
      tenantId: '1234',
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

  const got = buildCreateGridMutation(grid).replace(/ /g, '')
  const want: string = `
    mutation {
      grid {
        create (
          language: "en",
          input: {
            tenantId: "1234",
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
