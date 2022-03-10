import merge from 'lodash.merge'

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

function getItemById(items: JSONItem[], id: string) {
  let found: JSONItem | null = null

  function search(item: JSONItem) {
    if (!found) {
      if (item.id === id) {
        found = item
      } else {
        ;(item as JSONFolder).children?.forEach(search)
      }
    }
  }

  items.forEach(search)

  return found
}

export interface ItemsCreateSpecOptions {
  basePath?: String
  version?: 'published' | 'draft'
}

function removeUnwantedFieldsFromThing(thing: any, fieldsToRemove: string[]) {
  function handleThing(thing: any) {
    if (Array.isArray(thing)) {
      thing.forEach(handleThing)
    } else if (thing && typeof thing === 'object') {
      try {
        fieldsToRemove.forEach((field) => delete thing[field])

        Object.values(thing).forEach(handleThing)
      } catch (e) {
        console.log(e)
      }
    }
  }

  handleThing(thing)

  return thing
}

export async function getAllCatalogueItems(
  lng: string,
  context: BootstrapperContext,
  options?: ItemsCreateSpecOptions
): Promise<JSONItem[]> {
  const version = options?.version || 'draft'
  const languages = context.config.multilingual
    ? context.languages.map((l) => l.code)
    : [lng]

  async function handleLanguage(language: string) {
    const allCatalogueItemsForLanguage: JSONItem[] = []

    function tr(val: any) {
      return { [language]: val }
    }

    function handleImage(image: any) {
      return {
        src: image.url,
        altText: tr(image.altText),
        caption: tr(image.caption),
      }
    }

    function handleVideo(video: any) {
      return {
        src: video.playlist,
        title: tr(video.title),
        thumbnails: video.thumbnails?.map(handleImage),
      }
    }

    function handleFile(file: any) {
      return {
        src: file.url,
        title: tr(file.title),
      }
    }

    function handleParagraph(paragraph: any) {
      return {
        title: tr(paragraph?.title?.text),
        body: tr(paragraph?.body),
        images: paragraph?.images?.map(handleImage),
        videos: paragraph?.videos?.map(handleVideo),
      }
    }

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
      const jsonItem: JSONItem = {
        id: item.id, // Used for reference when doing multilingual spec
        name: tr(item.name),
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
            name: tr(v.name),
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

    function handleComponents(
      cmps?: any
    ): Record<string, JSONComponentContent> {
      const components: Record<string, any> = {}

      function getComponentContent(c: any): any {
        if (!c) {
          return null
        }
        switch (c.type) {
          case 'singleLine': {
            return tr(c.content?.text)
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
        allCatalogueItemsForLanguage.push(item)
      }
    }

    return allCatalogueItemsForLanguage
  }

  const allCatalogueItems: JSONItem[] = []

  for (let i = 0; i < languages.length; i++) {
    const language = languages[i]
    const itemsForLanguage = await handleLanguage(language)

    function mergeWithExisting(itemForNewLang: JSONItem) {
      const existingItem = getItemById(
        allCatalogueItems,
        itemForNewLang.id as string
      )
      if (!existingItem) {
        console.log(
          'Huh, weird. Could not find existing item with id',
          itemForNewLang.id
        )
      } else {
        merge(existingItem, itemForNewLang)
      }

      ;(itemForNewLang as JSONFolder).children?.forEach(mergeWithExisting)
    }

    if (allCatalogueItems.length === 0) {
      allCatalogueItems.push(...itemsForLanguage)
    } else {
      const itemsForLanguage = await handleLanguage(language)

      /**
       * Remove catalogue path here, as we only want the default language
       * catalogue path to be in the spec
       */
      removeUnwantedFieldsFromThing(itemsForLanguage, ['cataloguePath'])

      itemsForLanguage.forEach(mergeWithExisting)
    }
  }

  return removeUnwantedFieldsFromThing(allCatalogueItems, ['id'])
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
