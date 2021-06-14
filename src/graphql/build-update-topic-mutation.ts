import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { TopicUpdateInput } from '../types'

export const buildUpdateTopicMutation = (
  args: TopicUpdateInput,
  queryFields: Record<string, any> = {
    id: true,
    name: true
  }
): string => {
  const mutation = {
    mutation: {
      topic: {
        update: {
          __args: args,
          ...queryFields
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
