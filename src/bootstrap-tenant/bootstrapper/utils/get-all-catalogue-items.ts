import {
  JSONComponentContent,
  JSONDocument,
  JSONFolder,
  JSONItem,
  JSONItemTopic,
  JSONProduct,
  JSONProductVariant,
  JSONTopic,
} from '../../json-spec'
import { callCatalogue } from './api'

function handleImage(image: any) {
  return {
    src: image.url,
    altText: image.altText,
    caption: image.caption,
  }
}

function handleParagraph(paragraph: any) {
  return {
    title: paragraph?.title?.text,
    body: paragraph?.body,
    images: paragraph?.images?.map(handleImage),
  }
}

function handlePropertiesTableSection(section: any) {
  const properties: Record<string, string> = {}
  section?.properties.forEach(
    ({ key, value }: any) => (properties[key] = value)
  )
  return {
    title: section?.title,
    properties,
  }
}

export async function getAllCatalogueItems(
  language: string,
  allTopics: JSONTopic[]
): Promise<JSONItem[]> {
  const response = await callCatalogue({
    query: QUERY,
    variables: {
      language,
    },
  })

  function handleItem(item: any): JSONItem {
    const jsonItem = {
      name: item.name,
      cataloguePath: item.cataloguePath,
      shape: item.shape.identifier,
      components: handleComponents(item.components),
      topics: item.topics?.map(getTopicHierarchy),
    }

    // Product specifics
    if (item.vatType) {
      const jsonProduct = jsonItem as JSONProduct
      jsonProduct.vatType = item.vatType.name
      jsonProduct.variants = item.variants.map((v: any) => {
        const attributes: Record<string, string> = {}
        v.attributes?.forEach(
          ({ key, value }: any) => (attributes[key] = value)
        )

        const variant: JSONProductVariant = {
          name: v.name,
          sku: v.sku,
          price: v.price,
          isDefault: v.isDefault,
          attributes,
          externalReference: v.externalReference,
          stock: v.stock,
          images: v.images?.map(handleImage),
        }

        return variant
      })
    }

    if (item.children) {
      const jsonFolder = jsonItem as JSONFolder
      jsonFolder.children = item.children.map(handleItem)
    }

    return jsonItem
  }

  function getTopicHierarchy(topic: any): string {
    let foundHierarchy: string[] = []
    function handleLevel(topicLevel: JSONTopic, hierachy: string[]) {
      const topicHierarchy = [...hierachy, topicLevel.name as string]
      if (topicLevel.id === topic.id) {
        foundHierarchy = topicHierarchy
      } else if (topicLevel.children) {
        topicLevel.children?.forEach((c) => handleLevel(c, topicHierarchy))
      }
    }

    allTopics.forEach((t) => handleLevel(t, []))

    return foundHierarchy.join('/')
  }

  function handleComponents(cmps?: any): Record<string, JSONComponentContent> {
    const components: Record<string, any> = {}

    function getComponentContent(c: any): any {
      if (!c) {
        return null
      }
      switch (c.type) {
        case 'singleLine': {
          return c.content?.text
        }
        case 'itemRelations': {
          return c.content?.items
        }
        case 'boolean': {
          return c.content?.value
        }
        case 'images': {
          return c.content?.images?.map(handleImage)
        }
        case 'datetime': {
          return c.content?.datetime
        }
        case 'paragraphCollection': {
          return c.content?.paragraphs?.map(handleParagraph)
        }
        case 'propertiesTable': {
          return c.content?.sections?.map(handlePropertiesTableSection)
        }
        case 'selection': {
          return c.content?.options?.map((o: any) => o.key)
        }
        case 'componentChoice': {
          const sel = c.content?.selectedComponent
          if (!sel) {
            return null
          }

          return {
            [sel.id]: getComponentContent(sel),
          }
        }
        case 'contentChunk': {
          const chunks: any[] = []
          c.content?.chunks.forEach((catalogueChunk: any[]) => {
            const chunk: Record<string, any> = {}

            catalogueChunk.forEach((component) => {
              chunk[component.id] = getComponentContent(component)
            })

            chunks.push(chunk)
          })

          return chunks
        }
        default: {
          return c.content
        }
      }
    }

    cmps?.forEach((c: any) => {
      const content = getComponentContent(c)

      if (content) {
        components[c.id] = content
      }
    })

    return components
  }

  return response.data?.catalogue?.children?.map(handleItem) || []
}

const QUERY = `
query GET_ALL_CATALOGUE_ITEMS ($language: String!) {
  catalogue(language: $language, path: "/") {
    children {
      ...item
      ...product
      children {
        ...item
        ...product
        children {
          ...item
          ...product
          children {
            ...item
            ...product
            children {
              ...item
              ...product
              children {
                ...item
                ...product
                children {
                  ...item
                  ...product
                  children {
                    ...item
                    ...product
                    children {
                      ...item
                      ...product
                      children {
                        ...item
                        ...product
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

fragment item on Item {
  id
  name
  type
  cataloguePath: path
  shape {
    identifier
  }
  topics {
    id
  }
  components {
    id
    name
    type
    content {
      ...primitiveComponentContent
      ... on ComponentChoiceContent {
        selectedComponent {
          id
          name
          type
          content {
            ...primitiveComponentContent
          }
        }
      }
      ... on ContentChunkContent {
        chunks {
          id
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

fragment primitiveComponentContent on ComponentContent {
  ...singleLineContent
  ...richTextContent
  ...imageContent
  ...paragraphCollectionContent
  ...itemRelationsContent
  ...locationContent
  ...selectionContent
  ...booleanContent
  ...propertiesTableContent
  ...dateTimeContent
  ...numericContent
}

fragment product on Product {
  id
  language
  vatType {
    name
    percent
  }
  variants {
    id
    externalReference
    name
    sku
    price
    isDefault
    priceVariants {
      identifier
      name
      price
      currency
    }
    stock
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

fragment singleLineContent on SingleLineContent {
  text
}

fragment richTextContent on RichTextContent {
  json
}

fragment itemRelationsContent on ItemRelationsContent {
  items {
    cataloguePath: path
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
`
