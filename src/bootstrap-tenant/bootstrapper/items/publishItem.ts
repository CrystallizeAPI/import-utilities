import { gql } from 'graphql-request'
import { BootstrapperContext } from '../utils'

export function publishItem(
  language: string,
  id: string,
  context: BootstrapperContext
) {
  if (!id) {
    return Promise.resolve()
  }

  return context.callPIM({
    query: gql`
      mutation PUBLISH_ITEM($id: ID!, $language: String!) {
        item {
          publish(id: $id, language: $language) {
            id
          }
        }
      }
    `,
    variables: {
      id,
      language,
    },
  })
}
