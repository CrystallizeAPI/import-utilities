import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { TreeNodeInput } from '../generated/graphql'

export const buildMoveItemMutation = (
  itemId: string,
  input: TreeNodeInput
): string => {
  const mutation: any = {
    mutation: {
      tree: {
        moveNode: {
          __args: {
            itemId,
            input,
          },
          itemId: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
