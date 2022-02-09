import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { CreateCustomerInput } from '../types'

export function buildCreateCustomerMutation(
  input: CreateCustomerInput
): { query: DocumentNode; variables: Record<string, any> } {
  return {
    query: gql`
      mutation CREATE_CUSTOMER($input: CreateCustomerInput!) {
        customer {
          create(input: $input) {
            identifier
          }
        }
      }
    `,
    variables: { input },
  }
}
