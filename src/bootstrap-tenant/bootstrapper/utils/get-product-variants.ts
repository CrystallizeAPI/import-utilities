import { BootstrapperContext } from '.'
import { ProductVariant } from '../../../generated/graphql'

export async function getProductVariants(
  language: string,
  itemId: string,
  context: BootstrapperContext
): Promise<ProductVariant[]> {
  const response = await context.callPIM({
    query: QUERY,
    variables: {
      language,
      itemId,
    },
  })

  return response.data?.product?.get?.variants || []
}

const QUERY = `
query GET_PRODUCT_INFO($language: String!, $itemId: ID!) {
  product {
    get(id: $itemId, language: $language) {
      variants {
        id
        name
        isDefault
        externalReference
        attributes {
          attribute
          value
        }
        priceVariants {
          ...pr
        }
        stockLocations {
          ...stockLocation
        }
        sku
        subscriptionPlans {
          identifier
          name
          periods {
            id
            initial {
              ...planPricing
            }
            recurring {
              ...planPricing
            }
          }
        }
        images {
          key
          altText
          caption {
            json
          }
          meta {
            key
            value
          }
        }
      }
    }
  }
}

fragment planPricing on ProductVariantSubscriptionPlanPricing {
  period
  unit
  meteredVariables {
    id
    identifier
    name
    tierType
    tiers {
      threshold
      priceVariants {
        ...pr
      }
    }
  }
  priceVariants {
    ...pr
  }
}

fragment pr on ProductPriceVariant {
  currency
  identifier
  name
  price
}

fragment stockLocation on ProductStockLocation {
  identifier
  name
  settings {
    minimum
    unlimited
  }
  stock
}
`
