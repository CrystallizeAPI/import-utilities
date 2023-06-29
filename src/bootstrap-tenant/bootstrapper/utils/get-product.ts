import { BootstrapperContext } from '.'
import { ProductVariant } from '../../../generated/graphql'

type ExistingProduct = {
  id: string
  vatType: {
    name: string
  }
  variants: ProductVariant[]
}

export async function getProduct(
  language: string,
  itemId: string,
  context: BootstrapperContext
): Promise<ExistingProduct> {
  const response = await context.callPIM({
    query: QUERY,
    variables: {
      language,
      itemId,
    },
  })

  return response.data?.product?.get
}

const QUERY = `
query GET_PRODUCT_INFO($language: String!, $itemId: ID!) {
    product {
      get(id: $itemId, language: $language) {
        vatType {
          name
        }
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
            componentId
            name
            type
            content {
              ...primitiveComponentContent
              ... on ComponentChoiceContent {
                selectedComponent {
                  componentId
                  name
                  type
                  content {
                    ...primitiveComponentContent
                  }
                }
              }
              ... on ContentChunkContent {
                chunks {
                  componentId
                  name
                  type
                  content {
                    ...primitiveComponentContent
                  }
                }
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
  
  fragment primitiveComponentContent on ComponentContent {
    ...singleLineContent
    ...richTextContent
    ...imageContent
    ...videoContent
    ...fileContent
    ...paragraphCollectionContent
    ...itemRelationsContent
    ...gridRelationsContent
    ...locationContent
    ...selectionContent
    ...booleanContent
    ...propertiesTableContent
    ...dateTimeContent
    ...numericContent
  }
  
  fragment dateTimeContent on DatetimeContent {
    datetime
  }
  
  fragment numericContent on NumericContent {
    number
    unit
  }
  
  fragment propertiesTableContent on PropertiesTableContent {
    sections {
      title
      properties {
        key
        value
      }
    }
  }
  
  fragment booleanContent on BooleanContent {
    value
  }
  
  fragment selectionContent on SelectionContent {
    options {
      key
      value
    }
  }
  
  fragment imageContent on ImageContent {
    images {
      ...image
    }
  }
  
  fragment videoContent on VideoContent {
    videos {
      ...video
    }
  }
  
  fragment fileContent on FileContent {
    files {
      ...file
    }
  }
  
  fragment singleLineContent on SingleLineContent {
    text
  }
  
  fragment richTextContent on RichTextContent {
    json
  }
  
  fragment itemRelationsContent on ItemRelationsContent {
    items {
      tree {
        path
      }
      externalReference
    }
    productVariants {
      sku
      externalReference
    }
  }
  
  fragment gridRelationsContent on GridRelationsContent {
    grids {
      name
    }
  }
  
  fragment locationContent on LocationContent {
    lat
    long
  }
  
  fragment paragraphCollectionContent on ParagraphCollectionContent {
    paragraphs {
      title {
        ...singleLineContent
      }
      body {
        ...richTextContent
      }
      images {
        ...image
      }
    }
  }
  
  fragment image on Image {
    url
    altText
    caption {
      json
    }
  }
  
  fragment video on Video {
    id
    title
    playlist(type: "m3u8")
    thumbnails {
      ...image
    }
  }
  
  fragment file on File {
    url
    title
  }
  
`
