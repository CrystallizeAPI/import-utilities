import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { TopicInput } from '../types'

export const buildCreateTopicMutation = (
  input: TopicInput,
  language: string,
  queryFields: Record<string, any> = {
    id: true,
    name: true,
  }
): string => {
  const mutation = {
    mutation: {
      topic: {
        create: {
          __args: {
            input,
            language,
          },
          ...queryFields,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
