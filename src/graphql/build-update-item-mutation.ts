import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ItemType, UpdateItemInput } from '../types'

export const buildUpdateItemMutation = (
  id: string,
  input: UpdateItemInput,
  type: ItemType,
  language: string
): string => {
  const mutation: any = {
    mutation: {},
  }

  const components = input.components || {}

  mutation.mutation[type] = {
    update: {
      __args: {
        id,
        input: {
          ...input,
          components: Object.keys(components).map((componentId: string) => ({
            ...components[componentId],
            componentId,
          })),
        },
        language,
      },
      id: true,
      name: true,
    },
  }

  return jsonToGraphQLQuery(mutation)
}
