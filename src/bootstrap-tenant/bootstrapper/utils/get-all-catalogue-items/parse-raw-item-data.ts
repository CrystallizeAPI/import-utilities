import { debug } from 'console'
import { ItemsCreateSpecOptions } from '.'
import {
  JSONItem,
  JSONProduct,
  JSONProductVariant,
  JSONProductVariantStockLocations,
  JSONComponentContent,
  JSONProductVariantPriceVariants,
  JSONProductSubscriptionPlanPeriod,
  JSONProductSubscriptionPlan,
  JSONProductSubscriptionPlanPricing,
  JSONProductVariantSubscriptionPlanMeteredVariableTier,
} from '../../../json-spec'
import { trFactory } from '../multilingual'

export function parseRawItemData({
  item,
  options,
  tr,
}: {
  item: any
  options?: ItemsCreateSpecOptions
  tr: ReturnType<typeof trFactory>
}): JSONItem {
  const jsonItem: JSONItem = {
    id: item.id, // Used for reference when doing multilingual spec
    name: tr(item.name, `${item.id}.name`),
    cataloguePath: item.tree.path,
    treePosition: item.tree.position,
    externalReference: item.externalReference,
    shape: item.shape.identifier,
    components: handleComponents(item.components, item.id),
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
        components: handleComponents(v.components, v.sku),
      }

      return variant
    })
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
    cmps: any,
    translationIdBase: string
  ): Record<string, JSONComponentContent> {
    const components: Record<string, any> = {}

    function getComponentContent(c: any, translationId: string): any {
      if (!c) {
        return null
      }
      switch (c.type) {
        case 'singleLine': {
          return tr(c.content?.text, translationId)
        }
        case 'richText': {
          return tr(c.content, translationId)
        }
        case 'itemRelations': {
          return {
            items: c.content?.items?.map((item: any) => {
              if (options?.setExternalReference) {
                return {
                  externalReference:
                    item.externalReference || `crystallize-spec-ref-${item.id}`,
                }
              }

              return {
                externalReference: item.externalReference,
                cataloguePath: item.tree.path,
              }
            }),
            productVariants: c.content?.productVariants?.map(
              (productVariant: any) => {
                if (options?.setExternalReference) {
                  return {
                    sku: productVariant.sku,
                    externalReference:
                      item.externalReference ||
                      `crystallize-spec-ref-${productVariant.sku}`,
                  }
                }

                return {
                  externalReference: item.externalReference,
                  cataloguePath: item.tree.path,
                }
              }
            ),
          }
        }
        case 'gridRelations': {
          return c.content?.grids
        }
        case 'boolean': {
          return c.content?.value
        }
        case 'images': {
          return c.content?.images?.map((i: any, index: number) =>
            handleImage(i, `${translationId}.${index}`)
          )
        }
        case 'videos': {
          return c.content?.videos?.map((v: any, index: number) =>
            handleVideo(v, `${translationId}.${index}`)
          )
        }
        case 'files': {
          return c.content?.files?.map((v: any, index: number) =>
            handleFile(v, `${translationId}.${index}`)
          )
        }
        case 'datetime': {
          return c.content?.datetime
        }
        case 'paragraphCollection': {
          return c.content?.paragraphs?.map((v: any, index: number) =>
            handleParagraph(v, `${translationId}.${index}`)
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
            [sel.id]: getComponentContent(sel, `${translationId}.${sel.id}`),
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
                  `${translationId}.${chunkIndex}.${component.id}`
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
    if (cmps) {
      cmps.forEach((c: any) => {
        const content = getComponentContent(c, `${translationIdBase}.${c.id}`)

        if (content) {
          components[c.id] = content
        }
      })
    }
    return components
  }

  return jsonItem
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
      meteredVariables: pricing?.meteredVariables?.map((m: any) => ({
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
