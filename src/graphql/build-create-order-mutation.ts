import { DocumentNode } from 'graphql'
import { gql } from 'graphql-tag'
import { CreateOrderInput } from '../types'

export function buildCreateOrderMutation(
  input: CreateOrderInput
): { query: DocumentNode; variables: Record<string, any> } {
  return {
    query: gql`
      mutation CREATE_ORDER($input: CreateOrderInput!) {
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
