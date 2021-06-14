import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { LanguageInput } from '../types'

export const buildCreateLanguageMutation = (input: LanguageInput): string => {
  const mutation = {
    mutation: {
      language: {
        add: {
          __args: input,
          code: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}
