import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { TopicInput } from '../types'

export const buildCreateTopicMutation = (
  input: TopicInput,
  language: string
): string => {
  const mutation = {
    mutation: {
      topic: {
        create: {
          __args: {
            input: {
              ...input,
            },
            language,
          },
          id: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
