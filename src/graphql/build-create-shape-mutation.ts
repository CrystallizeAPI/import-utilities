import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ShapeInput } from '../types'

export const buildCreateShapeMutation = (input: ShapeInput): string => {
  const mutation = {
    mutation: {
      shape: {
        create: {
          __args: {
            input,
          },
          identifier: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}

export const buildCreateShapeQueryAndVariables = (
  input: ShapeInput
): {
  query: DocumentNode
  variables: Record<string, any>
} => {
  const query = gql`
    mutation CREATE_SHAPE($input: CreateShapeInput!) {
      shape {
        create(input: $input) {
          identifier
          name
        }
      }
    }
  `

  return {
    query,
    variables: {
      input,
    },
  }
}
