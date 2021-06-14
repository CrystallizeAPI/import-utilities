import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { PriceVariantInput } from '../types'

export const buildCreatePriceVariantMutation = (
  input: PriceVariantInput
): string => {
  const mutation = {
    mutation: {
      priceVariant: {
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
