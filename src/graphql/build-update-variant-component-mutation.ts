import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { ComponentInput } from '../generated/graphql'

type UpdateProps = {
  productId: string
  sku: string
  language: string
  input: ComponentInput
}

export function buildUpdateVariantComponentQueryAndVariables(
  variables: UpdateProps
): {
  query: DocumentNode
  variables: Record<string, any>
} {
  return {
    query: gql`
      mutation UPDATE_VARIANT_COMPONENT(
        $productId: ID!
        $sku: String!
        $language: String!
        $input: ComponentInput!
      ) {
        product {
          updateVariantComponent(
            productId: $productId
            sku: $sku
            language: $language
            input: $input
          ) {
            id
          }
        }
      }
    `,
    variables,
  }
}
