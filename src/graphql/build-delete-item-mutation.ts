import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ItemType } from '../types'

export const buildDeleteItemMutation = (id: string, type: ItemType): string => {
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
