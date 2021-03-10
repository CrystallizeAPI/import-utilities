import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { TenantInput } from '../types'

export const buildCreateTenantMutation = (input: TenantInput): string => {
  const mutation = {
    mutation: {
      tenant: {
        create: {
          __args: {
            input,
          },
          id: true,
          identifier: true,
          rootItemId: true,
          shapes: {
            identifier: true,
            name: true,
          },
          defaults: {
            language: true,
            currency: true,
          },
          vatTypes: {
            id: true,
            name: true,
          },
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
