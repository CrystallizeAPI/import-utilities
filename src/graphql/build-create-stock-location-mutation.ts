import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { StockLocationInput } from '../types'

export const buildCreateStockLocationMutation = (
  input: StockLocationInput
): string => {
  const mutation = {
    mutation: {
      stockLocation: {
        create: {
          __args: {
            input: input,
          },
          identifier: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
