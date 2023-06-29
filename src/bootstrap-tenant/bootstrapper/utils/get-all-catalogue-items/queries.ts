export const GET_ITEM_CHILDREN = `
query GET_ITEM_CHILDREN (
  $language: String!
  $id: ID!
) {
  tree {
    getNode (
      language: $language
      itemId: $id
    ) {
      children {
        id: itemId
        treePosition: position
        path
        item { name }
      }
    }
  }
}
`

export const GET_ITEM_QUERY = `
query GET_ITEM($language: String!, $id: ID!, $version: VersionLabel!) {
  item {
    get(id: $id, language: $language, versionLabel: $version) {
      ...item
      ...product
    }
  }
}

fragment item on Item {
  id
  name
  type
  tree {
    path
    position
  }
  externalReference
  shape {
    identifier
  }
  topics {
    path
  }
  components {
    ...rootComponent
  }
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

fragment product on Product {
  vatType {
    name
    percent
  }
  variants {
    externalReference
    name
    sku
    isDefault
    attributes {
      attribute
      value
    }
    priceVariants {
      identifier
      price
    }
    stock
    stockLocations {
      identifier
      name
      stock
    }
    images {
      ...image
    }
    subscriptionPlans {
      identifier
      name
      periods {
        id
        name
        initial {
          ...subscriptionPlanPricing
        }
        recurring {
          ...subscriptionPlanPricing
        }
      }
    }

    components {
      ...rootComponent
    }
  }
}

fragment rootComponent on Component {
  id: componentId
  name
  type
  content {
    ...primitiveComponentContent
    ... on ComponentChoiceContent {
      selectedComponent {
        id: componentId
        name
        type
        content {
          ...primitiveComponentContent
        }
      }
    }
    ... on ContentChunkContent {
      chunks {
        id: componentId
        name
        type
        content {
          ...primitiveComponentContent
        }
      }
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
    id
    tree {
      path
    }
    externalReference
  }
  productVariants {
    sku
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

fragment subscriptionPlanPricing on ProductVariantSubscriptionPlanPricing {
  period
  unit
  priceVariants {
    identifier
    price
  }
  meteredVariables {
    id
    identifier
    name
    tierType
    tiers {
      threshold
      priceVariants {
        identifier
        price
      }
    }
  }
}
`
