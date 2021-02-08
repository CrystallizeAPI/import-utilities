import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const buildTenantQuery = (id: string): string => {
  const query = {
    query: {
      tenant: {
        get: {
          __args: {
            id,
          },
          id: true,
          identifier: true,
          name: true,
          rootItemId: true,
          availableLanguages: {
            code: true,
            name: true,
            system: true,
          },
          defaults: {
            language: true,
            currency: true,
          },
          vatTypes: {
            id: true,
            name: true,
            percent: true,
          },
          shapes: {
            identifier: true,
            name: true,
          },
        },
      },
    },
  }

  return jsonToGraphQLQuery(query)
}
