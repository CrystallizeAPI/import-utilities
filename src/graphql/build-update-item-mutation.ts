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

  let components: undefined | any[] = undefined
  if (input.components) {
    components = Object.keys(input.components).map((componentId: string) => ({
      ...input.components?.[componentId],
      componentId,
    }))
  }

  mutation.mutation[type] = {
    update: {
      __args: {
        id,
        input: {
          ...input,
          ...(components && { components }),
        },
        language,
      },
      id: true,
      name: true,
    },
  }

  return jsonToGraphQLQuery(mutation)
}
