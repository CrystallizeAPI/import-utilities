import {
  BootstrapperContext,
  getTenantRootItemId,
  removeUnwantedFieldsFromThing,
} from '.'
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
  JSONProductVariantStockLocations,
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
        if ('children' in item) {
          item.children?.forEach(search)
        }
      }
    }
  }

  items.forEach(search)

  return found
}

export interface ItemsCreateSpecOptions {
  basePath?: string
  version?: 'published' | 'draft'
  setExternalReference?: boolean
}

type pathValidation = {
  thisItem: boolean
  descendants: boolean
}

export function buildPathShouldBeIncludedValidator(basePath = '') {
  return function validate(path: string): pathValidation {
    if (!basePath || basePath === '/') {
      return {
        thisItem: true,
        descendants: true,
      }
    }

    const p = path || ''

    const thisItem = p.startsWith(basePath)

    return {
      thisItem,
      descendants: thisItem || basePath.startsWith(p),
    }
  }
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

  const pathShouldBeIncluded = buildPathShouldBeIncludedValidator(
    options?.basePath
  )

  async function handleLanguage(language: string) {
    const allCatalogueItemsForLanguage: JSONItem[] = []

    const tr = trFactory(language)

    async function getItem({
      id,
      item,
    }: {
      id: string
      item: { name: string }
    }): Promise<JSONItem | null> {
      const response = await context.callPIM({
        query: GET_ITEM_QUERY,
        variables: {
          language,
          version,
          id,
        },
      })

      const rawCatalogueData: JSONItem | null = response.data?.item?.get

      if (!rawCatalogueData) {
        return null
      }

      // Fallback when name is not set for draft
      if (rawCatalogueData.name === 'MISSING_NAME_FOR_LANGUAGE') {
        rawCatalogueData.name = item.name
      }

      return handleItem(rawCatalogueData)
    }

    async function handleItem(item: any): Promise<JSONItem> {
      const jsonItem: JSONItem = {
        id: item.id, // Used for reference when doing multilingual spec
        name: tr(item.name, `${item.id}.name`),
        cataloguePath: item.tree.path,
        treePosition: item.tree.position,
        externalReference: item.externalReference,
        shape: item.shape.identifier,
        components: handleComponents(item.components),
        topics: item.topics,
      }

      if (!jsonItem.externalReference && options?.setExternalReference) {
        jsonItem.externalReference = `crystallize-spec-ref-${item.id}`
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
            stock: v.stockLocations?.reduce(
              (
                acc: JSONProductVariantStockLocations,
                { identifier, stock }: { identifier: string; stock: number }
              ) => {
                acc[identifier] = stock
                return acc
              },
              {}
            ),
            images: v.images?.map((i: any, index: number) =>
              handleImage(i, `${v.sku}.images.${index}`)
            ),
            subscriptionPlans: v.subscriptionPlans?.map(handleSubscriptionPlan),
            components: handleComponents(v.components),
          }

          return variant
        })
      } else {
        const itemWithChildren = jsonItem as JSONFolder
        const children = await getChildren()
        if (children.length > 0) {
          itemWithChildren.children = children
          console.log(itemWithChildren.children.map((c) => c.cataloguePath))
        }
      }

      async function getChildren(): Promise<JSONItem[]> {
        const children: JSONItem[] = []

        const pageResponse = await context.callPIM({
          query: GET_ITEM_CHILDREN,
          variables: {
            language,
            id: item.id,
          },
        })

        const rawChilds = pageResponse.data?.tree?.getNode?.children || []

        for (let i = 0; i < rawChilds.length; i++) {
          const pathValid = pathShouldBeIncluded(rawChilds[i].path)

          if (pathValid.descendants || pathValid.thisItem) {
            const item = await getItem(rawChilds[i])
            if (item) {
              children.push(item)
            }
          }
        }

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
              return c.content?.items?.map((item: any) => {
                if (options?.setExternalReference) {
                  return {
                    externalReference:
                      item.externalReference ||
                      `crystallize-spec-ref-${item.id}`,
                  }
                }

                return {
                  externalReference: item.externalReference,
                  cataloguePath: item.tree.path,
                }
              })
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

    const rootItemId = await getTenantRootItemId(context)

    const rootItemsResponse = await context.callPIM({
      query: GET_ITEM_CHILDREN,
      variables: {
        language,
        id: rootItemId,
      },
    })

    const rootItems: {
      id: string
      position: number
      path: string
      item: {
        name: string
      }
    }[] = rootItemsResponse.data?.tree?.getNode?.children || []

    for (let i = 0; i < rootItems.length; i++) {
      const pathValid = pathShouldBeIncluded(rootItems[i].path)
      if (pathValid.descendants || pathValid.thisItem) {
        const item = await getItem(rootItems[i])
        if (item) {
          allCatalogueItemsForLanguage.push(item)
        }
      }
    }

    // Filter out on the desired path in the end
    if (options?.basePath?.length) {
      return getOnlyItemsWithPathStartingWith(
        options.basePath,
        allCatalogueItemsForLanguage
      )
    }

    return allCatalogueItemsForLanguage
  }

  const allCatalogueItems: JSONItem[] = []

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
    if ('children' in itemForNewLang) {
      itemForNewLang.children?.forEach(mergeWithExisting)
    }
  }

  for (let i = 0; i < languages.length; i++) {
    const language = languages[i]
    const itemsForLanguage = await handleLanguage(language)

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

const GET_ITEM_CHILDREN = `
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

const GET_ITEM_QUERY = `
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
export function getOnlyItemsWithPathStartingWith(
  basePath: string,
  allCatalogueItemsForLanguage: JSONItem[]
): JSONItem[] {
  if (basePath === '/') {
    return allCatalogueItemsForLanguage
  }

  const ret: JSONItem[] = []

  let foundExactFolderMatch = false

  function handleLevel(item: JSONItem) {
    if (!foundExactFolderMatch) {
      if (item.cataloguePath?.startsWith(basePath)) {
        if ('children' in item) {
          foundExactFolderMatch = true
        }

        ret.push(item)
      } else {
        const f = item as JSONFolder
        if (f.children) {
          f.children.forEach(handleLevel)
        }
      }
    }
  }

  allCatalogueItemsForLanguage.forEach(handleLevel)

  return ret
}
