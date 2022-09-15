import { BootstrapperContext, removeUnwantedFieldsFromThing } from '.'
import {
  JSONComponentContent,
  JSONFolder,
  JSONItem,
  JSONProduct,
  JSONProductSubscriptionPlan,
  JSONProductSubscriptionPlanPeriod,
  JSONProductSubscriptionPlanPricing,
  JSONProductVariant,
  JSONProductVariantPriceVariants,
  JSONProductVariantSubscriptionPlanMeteredVariableTier,
} from '../../json-spec'
import {
  mergeInTranslations,
  translationFieldIdentifier,
  trFactory,
} from './multilingual'

function byTreePosition(a: JSONItem, b: JSONItem) {
  const aP = a.treePosition as number
  const bP = b.treePosition as number

  if (aP > bP) {
    return 1
  }
  if (aP < bP) {
    return -1
  }
  return 0
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

    const tr = trFactory(language)

    async function getItem({
      path,
      id,
    }: {
      path: string
      id: string
    }): Promise<JSONItem | null> {
      /**
       * "/" represents the catalogue root and is not retrieved here.
       * If an item path is "/", then it is most likely not published
       * to the catalogue
       */
      if (path === '/') {
        return null
      }

      const [catalogueResponse, positionResponse] = await Promise.all([
        context.callCatalogue({
          query: GET_ITEM_QUERY,
          variables: {
            language,
            version,
            path,
          },
        }),
        context.callPIM({
          query: GET_ITEM_POSITION_QUERY,
          variables: {
            language,
            id,
          },
          suppressErrors: true,
        }),
      ])

      const rawCatalogueData: JSONItem | null =
        catalogueResponse.data?.catalogue

      if (!rawCatalogueData) {
        return null
      }

      // Extend with the position from PIM
      const position = positionResponse?.data?.tree?.getNode?.position
      if (position != null) {
        rawCatalogueData.treePosition = position
      }

      return handleItem(rawCatalogueData)
    }

    async function handleItem(item: any): Promise<JSONItem> {
      const jsonItem: JSONItem = {
        id: item.id, // Used for reference when doing multilingual spec
        name: tr(item.name, `${item.id}.name`),
        cataloguePath: item.cataloguePath,
        externalReference: item.externalReference,
        shape: item.shape.identifier,
        components: handleComponents(item.components),
        topics: item.topics,
        treePosition: item.treePosition,
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
            name: tr(v.name, `${v.sku}.name`),
            sku: v.sku,
            price: handlePriceVariants(v.priceVariants),
            isDefault: v.isDefault,
            attributes,
            externalReference: v.externalReference,
            stock: v.stock,
            images: v.images?.map((i: any, index: number) =>
              handleImage(i, `${v.sku}.images.${index}`)
            ),
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
            const pathAndIds: { path: string; id: string }[] = page.edges.map(
              (e: any) => e.node
            )
            for (let i = 0; i < pathAndIds.length; i++) {
              const item = await getItem(pathAndIds[i])
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

        return children.sort(byTreePosition)
      }

      function handleImage(image: any, id: string) {
        return {
          src: image.url,
          altText: tr(image.altText, `${id}.altText`),
          caption: tr(image.caption, `${id}.caption`),
        }
      }

      function handleVideo(video: any, id: string) {
        return {
          src: video.playlist,
          title: tr(video.title, `${id}.title`),
          thumbnails: video.thumbnails?.map((i: any, index: number) =>
            handleImage(i, `${id}.thumbnails.${index}`)
          ),
        }
      }

      function handleFile(file: any, id: string) {
        return {
          src: file.url,
          title: tr(file.title, `${id}.title`),
        }
      }

      function handleParagraph(paragraph: any, id: string) {
        return {
          title: tr(paragraph?.title?.text, `${id}.title`),
          body: tr(paragraph?.body, `${id}.body`),
          images: paragraph?.images?.map((i: any, index: number) =>
            handleImage(i, `${id}.images.${index}`)
          ),
          videos: paragraph?.videos?.map((v: any, index: number) =>
            handleVideo(v, `${id}.videos.${index}`)
          ),
        }
      }

      function handleComponents(
        cmps?: any
      ): Record<string, JSONComponentContent> {
        const components: Record<string, any> = {}

        function getComponentContent(c: any, id: string): any {
          if (!c) {
            return null
          }
          switch (c.type) {
            case 'singleLine': {
              return tr(c.content?.text, id)
            }
            case 'richText': {
              return tr(c.content, id)
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
              return c.content?.images?.map((i: any, index: number) =>
                handleImage(i, `${id}.${index}`)
              )
            }
            case 'videos': {
              return c.content?.videos?.map((v: any, index: number) =>
                handleVideo(v, `${id}.${index}`)
              )
            }
            case 'files': {
              return c.content?.files?.map((v: any, index: number) =>
                handleFile(v, `${id}.${index}`)
              )
            }
            case 'datetime': {
              return c.content?.datetime
            }
            case 'paragraphCollection': {
              return c.content?.paragraphs?.map((v: any, index: number) =>
                handleParagraph(v, `${id}.${index}`)
              )
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
                [sel.id]: getComponentContent(sel, `${id}.${sel.id}`),
              }
            }
            case 'contentChunk': {
              const chunks: any[] = []
              c.content?.chunks.forEach(
                (catalogueChunk: any[], chunkIndex: number) => {
                  const chunk: Record<string, any> = {}

                  catalogueChunk.forEach((component) => {
                    chunk[component.id] = getComponentContent(
                      component,
                      `${id}.${chunkIndex}.${component.id}`
                    )
                  })

                  chunks.push(chunk)
                }
              )

              return chunks
            }
            default: {
              return c.content
            }
          }
        }

        cmps?.forEach((c: any) => {
          const content = getComponentContent(c, `${item.id}.${c.id}`)

          if (content) {
            components[c.id] = content
          }
        })

        return components
      }

      return jsonItem
    }

    const rootItemsResponse = await context.callCatalogue({
      query: GET_ROOT_ITEMS_QUERY,
      variables: {
        language,
        version,
        path: options?.basePath || '/',
      },
    })

    const rootItems: { path: string; id: string }[] =
      rootItemsResponse.data?.catalogue?.children || []
    for (let i = 0; i < rootItems.length; i++) {
      const item = await getItem(rootItems[i])
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
        mergeInTranslations(existingItem, itemForNewLang)
      }

      ;(itemForNewLang as JSONFolder).children?.forEach(mergeWithExisting)
    }

    if (allCatalogueItems.length === 0) {
      allCatalogueItems.push(...itemsForLanguage)
    } else {
      /**
       * Remove catalogue path here, as we only want the default language
       * catalogue path to be in the spec
       */
      removeUnwantedFieldsFromThing(itemsForLanguage, ['cataloguePath'])

      itemsForLanguage.forEach(mergeWithExisting)
    }
  }

  allCatalogueItems.sort(byTreePosition)

  return removeUnwantedFieldsFromThing(allCatalogueItems, [
    'id',
    'treePosition',
    translationFieldIdentifier,
  ])
}

/**
 * Item positions always needs to be fetched from their published
 * version, as the draft version will not always be synced
 */
const GET_ITEM_POSITION_QUERY = `
query GET_ITEM_POSITION_QUERY ($language: String!, $id: ID!) {
  tree {
    getNode (
      itemId: $id
      language: $language
      versionLabel: published
    ) {
      position
    }
  }
}`

const GET_ROOT_ITEMS_QUERY = `
query GET_ROOT_CATALOGUE_ITEMS ($language: String!, $path: String!, $version: VersionLabel!) {
  catalogue(language: $language, path: $path, version: $version) {
    children {
      id
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
          id
          path
        }
      }
    }
  }
}
`
