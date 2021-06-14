import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { VatTypeInput } from '../types'

export const buildCreateVatTypeMutation = (input: VatTypeInput): string => {
  const mutation = {
    mutation: {
      vatType: {
        create: {
          __args: input,
          name: true,
          percent: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
