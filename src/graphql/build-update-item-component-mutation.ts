import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ItemMutationsUpdateComponentArgs } from '../generated/graphql'

export function buildUpdateItemComponentQueryAndVariables(
  variables: ItemMutationsUpdateComponentArgs
): { query: string; variables: Record<string, any> } {
  return {
    query: `
      mutation UPDATE_ITEM_COMPONENT ($itemId: ID!, $language: String!, $input: ComponentInput!) {
        item {
          updateComponent (itemId: $itemId, language: $language, input: $input) {
            id
          }
        }
      }
    `,
    variables,
  }
}

export function buildUpdateItemComponentMutation(
  props: ItemMutationsUpdateComponentArgs
): string {
  const query: any = {
    mutation: {
      item: {
        updateComponent: {
          __args: props,
          id: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(query)
}
