import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export const buildDeleteTopicMutation = (id: string): string => {
  const mutation = {
    mutation: {
      topic: {
        delete: {
          __args: {
            id,
          },
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
