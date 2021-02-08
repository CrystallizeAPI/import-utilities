import test from 'ava'
import { buildGetItemsByShapeQuery } from './build-get-items-by-shape-query'

test('get items with id and language', (t) => {
  const got = buildGetItemsByShapeQuery('1234', 'my-shape', 'en').replace(
    / /g,
    ''
  )
  const want: string = `
    query {
      shape {
        get (tenantId: "1234", identifier: "my-shape") {
          identifier
          name
          items(language: "en") {
            id
            name
            components {
              componentId
              content {
                ... on BooleanContent {
                  value
                }
                ... on ComponentChoiceContent {
                  selectedComponent {
                    componentId
                    type
                  }
                }
                ... on ContentChunkContent {
                  chunks {
                    componentId
                    type
                  }
                }
                ... on DatetimeContent {
                  datetime
                }
                ... on GridRelationsContent {
                  grids {
                    id
                  }
                }
                ... on ImageContent {
                  images {
                    key
                  }
                }
                ... on ItemRelationsContent {
                  items {
                    id
                  }
                }
                ... on LocationContent {
                  lat
                  long
                }
                ... on NumericContent {
                  number
                  unit
                }
                ... on PropertiesTableContent {
                  sections {
                    title
                    properties {
                      key
                      value
                    }
                  }
                }
                ... on RichTextContent {
                  json
                  html
                }
                ... on SingleLineContent {
                  text
                }
                ... on VideoContent {
                  videos {
                    id
                    title
                  }
                }
              }
            }
            ... on Product {
              variants {
                isDefault
                name
                sku
                price
              }
            }
          }
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'query string should match')
})
