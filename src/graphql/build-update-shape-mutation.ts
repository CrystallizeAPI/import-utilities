import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ShapeUpdateInput } from '../types'

export const buildUpdateShapeMutation = (input: ShapeUpdateInput): string => {
  const mutation = {
    mutation: {
      shape: {
        update: {
          __args: input,
          identifier: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}

export const buildUpdateShapeQueryAndVariables = (
  input: ShapeUpdateInput
): {
  query: DocumentNode
  variables: Record<string, any>
} => {
  const query = gql`
    mutation UPDATE_SHAPE($language: String!, $input: UpdateShapeInput!) {
      shape {
        update(input: $input) {
          identifier
          name
        }
      }
    }
  `

  const variables = {
    input,
  }

  return {
    query,
    variables,
  }
}
