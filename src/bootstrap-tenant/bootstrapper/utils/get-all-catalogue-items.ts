import { BootstrapperContext } from '.'
import { PriceVariant } from '../../../generated/graphql'
import {
  JSONComponentContent,
  JSONDocument,
  JSONFolder,
  JSONItem,
  JSONItemTopic,
  JSONProduct,
  JSONProductSubscriptionPlan,
  JSONProductSubscriptionPlanPeriod,
  JSONProductSubscriptionPlanPricing,
  JSONProductVariant,
  JSONProductVariantPriceVariants,
  JSONProductVariantSubscriptionPlanMeteredVariableTier,
  JSONTopic,
} from '../../json-spec'

function handleImage(image: any) {
  return {
    src: image.url,
    altText: image.altText,
    caption: image.caption,
  }
}

function handlePriceVariants(
  priceVariants: { identifier: string; price: number }[]
): JSONProductVariantPriceVariants {
  if (!priceVariants) {
    return {}
  }

  const p: JSONProductVariantPriceVariants = {}

  priceVariants.forEach((pV) => {
    p[pV.identifier] = pV.price
  })

  return p
}

function handleSubscriptionPlan(plan: any): JSONProductSubscriptionPlan {
  function handleTier(
    tier: any
  ): JSONProductVariantSubscriptionPlanMeteredVariableTier {
    return {
      threshold: tier.threshold,
      price: handlePriceVariants(tier.priceVariants),
    }
  }

  function handlePricing(pricing: any): JSONProductSubscriptionPlanPricing {
    return {
      period: pricing.period,
      unit: pricing.unit,
      price: handlePriceVariants(pricing.priceVariants),
      meteredVariables: pricing.meteredVariables.map((m: any) => ({
        id: m.id,
        identifier: m.identifier,
        name: m.name,
        tierType: m.tierType,
        tiers: m.tiers?.map(handleTier),
      })),
    }
  }

  function handlePeriod(period: any): JSONProductSubscriptionPlanPeriod {
    return {
      id: period.id,
      name: period.name,
      initial: period.initial ? handlePricing(period.initial) : undefined,
      recurring: handlePricing(period.recurring),
    }
  }

  return {
    identifier: plan.identifier,
    name: plan.name,
    periods: plan.periods.map(handlePeriod),
  }
}

function handleVideo(video: any) {
  return {
    src: video.playlist,
    title: video.title,
    thumbnails: video.thumbnails?.map(handleImage),
  }
}

function handleFile(file: any) {
  return {
    src: file.url,
    title: file.title,
  }
}

function handleParagraph(paragraph: any) {
  return {
    title: paragraph?.title?.text,
    body: paragraph?.body,
    images: paragraph?.images?.map(handleImage),
    videos: paragraph?.videos?.map(handleVideo),
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

export interface ItemsCreateSpecOptions {
  basePath?: String
  version?: 'published' | 'draft'
}

export async function getAllCatalogueItems(
  language: string,
  context: BootstrapperContext,
  options?: ItemsCreateSpecOptions
): Promise<JSONItem[]> {
  const version = options?.version || 'draft'

  async function getItem(path: string): Promise<JSONItem | null> {
    const itemResponse = await context.callCatalogue({
      query: GET_ITEM_QUERY,
      variables: {
        language,
        version,
        path,
      },
    })

    const rawData = itemResponse.data?.catalogue

    if (!rawData) {
      return null
    }

    return handleItem(rawData)
  }

  async function handleItem(item: any): Promise<JSONItem> {
    const jsonItem = {
      name: item.name,
      cataloguePath: item.cataloguePath,
      externalReference: item.externalReference,
      shape: item.shape.identifier,
      components: handleComponents(item.components),
      topics: item.topics,
    }

    // Product specifics
    if (item.vatType) {
      const jsonProduct = jsonItem as JSONProduct
      jsonProduct.vatType = item.vatType.name
      jsonProduct.variants = item.variants.map((v: any) => {
        const attributes: Record<string, string> = {}
        v.attributes?.forEach(
          ({ attribute, value }: any) => (attributes[attribute] = value)
        )

        const variant: JSONProductVariant = {
          name: v.name,
          sku: v.sku,
          price: handlePriceVariants(v.priceVariants),
          isDefault: v.isDefault,
          attributes,
          externalReference: v.externalReference,
          stock: v.stock,
          images: v.images?.map(handleImage),
          subscriptionPlans: v.subscriptionPlans?.map(handleSubscriptionPlan),
        }

        return variant
      })
    } else {
      const itemWithChildren = jsonItem as JSONFolder
      const children = await getChildren()
      if (children.length > 0) {
        itemWithChildren.children = children
      }
    }

    async function getChildren(): Promise<JSONItem[]> {
      const children: JSONItem[] = []

      let after: string | undefined = undefined

      async function crawlChildren() {
        const pageSize = 1000
        const pageResponse = await context.callCatalogue({
          query: GET_ITEM_CHILDREN_PAGE,
          variables: {
            language,
            version,
            path: item.cataloguePath,
            after,
            pageSize,
          },
        })

        const page = pageResponse.data?.catalogue?.subtree

        if (page.edges?.length) {
          const paths: string[] = page.edges.map((e: any) => e.node.path)
          for (let i = 0; i < paths.length; i++) {
            const item = await getItem(paths[i])
            if (item) {
              children.push(item)
            }
          }

          if (page.pageInfo?.hasNextPage && page.edges?.length === pageSize) {
            after = page.pageInfo.endCursor
            await crawlChildren()
          }
        }
      }

      await crawlChildren()

      return children
    }

    return jsonItem
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
        case 'gridRelations': {
          return c.content?.grids
        }
        case 'boolean': {
          return c.content?.value
        }
        case 'images': {
          return c.content?.images?.map(handleImage)
        }
        case 'videos': {
          return c.content?.videos?.map(handleVideo)
        }
        case 'files': {
          return c.content?.files?.map(handleFile)
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

  const allCatalogueItems: JSONItem[] = []

  const rootItemsResponse = await context.callCatalogue({
    query: GET_ROOT_ITEMS_QUERY,
    variables: {
      language,
      version,
      path: options?.basePath || '/',
    },
  })

  const rootItems: { path: string }[] =
    rootItemsResponse.data?.catalogue?.children || []
  for (let i = 0; i < rootItems.length; i++) {
    const item = await getItem(rootItems[i].path)
    if (item) {
      allCatalogueItems.push(item)
    }
  }

  return allCatalogueItems
}

const GET_ROOT_ITEMS_QUERY = `
query GET_ROOT_CATALOGUE_ITEMS ($language: String!, $path: String!, $version: VersionLabel!) {
  catalogue(language: $language, path: $path, version: $version) {
    children {
      path
    }
  }
}
`

const GET_ITEM_QUERY = `
query GET_ITEM ($language: String!, $path: String!, $version: VersionLabel!) {
  catalogue(language: $language, path: $path, version: $version) {
    ...item
    ...product
  }
}

fragment item on Item {
  id
  name
  type
  cataloguePath: path
  externalReference
  shape {
    identifier
  }
  topics {
    path
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
    cataloguePath: path
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

const GET_ITEM_CHILDREN_PAGE = `
query GET_ITEM_CHILDREN_PAGE (
  $path: String!,
  $language: String!,
  $version: VersionLabel!,
  $after: String,
  $pageSize: Int
  ) {
  catalogue(path: $path, language: $language, version: $version) {
    subtree (
      first: $pageSize
      after: $after
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          path
        }
      }
    }
  }
}
`
