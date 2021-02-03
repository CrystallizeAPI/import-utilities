import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const buildDeleteItemMutation = (
  id: string,
  type: 'product' | 'document' | 'folder'
): string => {
  const mutation: any = {
    mutation: {},
  }

  mutation.mutation[type] = {
    delete: {
      __args: {
        id,
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
