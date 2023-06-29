import { JSONProductVariantPriceVariants } from '../../json-spec'
import {
  PriceVariantReferenceInput,
  ProductPriceVariant,
} from '../../../generated/graphql'

export function handleJsonPriceToPriceInput({
  jsonPrice,
  existingProductVariantPriceVariants,
}: {
  jsonPrice?: number | JSONProductVariantPriceVariants
  existingProductVariantPriceVariants?: ProductPriceVariant[] | null
}): PriceVariantReferenceInput[] {
  if (
    typeof jsonPrice === 'undefined' &&
    !existingProductVariantPriceVariants
  ) {
    return [
      {
        identifier: 'default',
        price: 0,
      },
    ]
  }

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
  } else if (typeof jsonPrice !== 'undefined') {
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
