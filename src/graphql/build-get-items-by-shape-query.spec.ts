import test from 'ava'
import { buildGetItemsByShapeQuery } from './build-get-items-by-shape-query'

test('get items with id and language', (t) => {
  const got = buildGetItemsByShapeQuery('1234', 'en').replace(/ /g, '')
  const want: string = `
    query {
      shape {
        get (id: "1234") {
          id
          name
          items(language: "en") {
            id
            name
            components {
              componentId
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
                value
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
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'query string should match')
})
