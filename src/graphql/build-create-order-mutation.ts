import { DocumentNode } from 'graphql'
import { gql } from 'graphql-tag'
import { CreateOrderInput } from '../types'

export function buildCreateOrderQuery(
  input: CreateOrderInput
): { query: DocumentNode; variables: Record<string, any> } {
  return {
    query: gql`
      mutation CREATE_ORDER($language: String!, $input: CreateOrderInput!) {
        orders {
          create(input: $input) {
            id
          }
        }
      }
    `,
    variables: { input },
  }
}
