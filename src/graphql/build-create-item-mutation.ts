import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { CreateItemInput, ItemType } from '../types'

export const buildCreateItemMutation = (
  input: CreateItemInput,
  type: ItemType,
  language: string
): string => {
  const mutation: any = {
    mutation: {},
  }

  const components = input.components || {}

  mutation.mutation[type] = {
    create: {
      __args: {
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
