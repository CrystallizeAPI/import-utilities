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
          shapes: {
            id: true,
            name: true,
          },
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
