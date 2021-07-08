import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { GridUpdateInput } from '../types'

export const buildUpdateGridMutation = (input: GridUpdateInput): string => {
  const mutation = {
    mutation: {
      grid: {
        update: {
          __args: input,
          id: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
