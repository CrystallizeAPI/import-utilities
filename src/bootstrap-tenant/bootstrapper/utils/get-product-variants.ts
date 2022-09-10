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
        components {
          ...componentContent
        }
      }
    }
  }
}

fragment componentContent on Component {
  componentId
  type
  content {
    ... on BooleanContent {
      value
    }
    ... on ComponentChoiceContent {
      selectedComponent {
        componentId
        type
      }
    }
    ... on DatetimeContent {
      datetime
    }
    ... on GridRelationsContent {
      grids {
        id
      }
    }
    ... on ImageContent {
      images {
        key
      }
    }
    ... on ItemRelationsContent {
      items {
        id
      }
    }
    ... on LocationContent {
      lat
      long
    }
    ... on NumericContent {
      number
      unit
    }
    ... on PropertiesTableContent {
      sections {
        title
        properties {
          key
          value
        }
      }
    }
    ... on RichTextContent {
      json
      html
    }
    ... on SingleLineContent {
      text
    }
    ... on VideoContent {
      videos {
        id
        title
      }
    }

    ... on ContentChunkContent {
      chunks {
        componentId
        type
        content {
          ... on BooleanContent {
            value
          }
          ... on ComponentChoiceContent {
            selectedComponent {
              componentId
              type
            }
          }
          ... on DatetimeContent {
            datetime
          }
          ... on GridRelationsContent {
            grids {
              id
            }
          }
          ... on ImageContent {
            images {
              key
            }
          }
          ... on ItemRelationsContent {
            items {
              id
            }
          }
          ... on LocationContent {
            lat
            long
          }
          ... on NumericContent {
            number
            unit
          }
          ... on PropertiesTableContent {
            sections {
              title
              properties {
                key
                value
              }
            }
          }
          ... on RichTextContent {
            json
            html
          }
          ... on SingleLineContent {
            text
          }
          ... on VideoContent {
            videos {
              id
              title
            }
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
