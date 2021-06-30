import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { GridInput } from '../types'

export const buildCreateGridMutation = (input: GridInput): string => {
  const mutation = {
    mutation: {
      grid: {
        create: {
          __args: input,
          id: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
