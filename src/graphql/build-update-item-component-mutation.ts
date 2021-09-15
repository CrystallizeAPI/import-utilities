import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ItemMutationsUpdateComponentArgs } from '../generated/graphql'

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
