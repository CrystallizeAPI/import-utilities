import {
  ProductPriceVariant,
  PriceVariantReferenceInput,
} from '../../../generated/graphql'
import { JSONProductVariantPriceVariants } from '../../json-spec'

export function handleJsonPriceToPriceInput({
  jsonPrice,
  existingProductVariantPriceVariants,
}: {
  jsonPrice: number | JSONProductVariantPriceVariants
  existingProductVariantPriceVariants?: ProductPriceVariant[] | null
}): PriceVariantReferenceInput[] {
  const priceVariants: PriceVariantReferenceInput[] =
    existingProductVariantPriceVariants || []

  if (jsonPrice && typeof jsonPrice === 'object') {
    const p = jsonPrice as Record<string, number>
    Object.keys(jsonPrice).forEach((identifier) => {
      const existingEntry = priceVariants.find(
        (i) => i.identifier === identifier
      )
      if (existingEntry) {
        existingEntry.price = p[identifier]
      } else {
        priceVariants.push({
          identifier,
          price: p[identifier],
        })
      }
    })
  } else {
    const defaultStock = priceVariants.find((i) => i.identifier === 'default')
    if (defaultStock) {
      defaultStock.price = jsonPrice
    } else {
      priceVariants.push({
        identifier: 'default',
        price: jsonPrice,
      })
    }
  }

  return priceVariants.map(({ identifier, price }) => ({
    identifier,
    price,
  }))
}
