import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ShapeUpdateInput } from '../types'

export const buildUpdateShapeMutation = (input: ShapeUpdateInput): string => {
  const mutation = {
    mutation: {
      shape: {
        update: {
          __args: input,
          identifier: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
