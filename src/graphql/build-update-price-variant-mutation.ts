import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { PriceVariantMutationsUpdateArgs } from '../generated/graphql'

export function buildUpdatePriceVariantQueryAndVariables(
  variables: PriceVariantMutationsUpdateArgs
): { query: DocumentNode; variables: PriceVariantMutationsUpdateArgs } {
  return {
    query: gql`
      mutation UPDATE_PRICE_VARIANT(
        $identifier: String!
        $tenantId: ID!
        $input: UpdatePriceVariantInput!
      ) {
        priceVariant {
          update(identifier: $identifier, tenantId: $tenantId, input: $input) {
            identifier
          }
        }
      }
    `,
    variables,
  }
}
