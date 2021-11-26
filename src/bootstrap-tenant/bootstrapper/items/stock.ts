import {
  ProductStockLocation,
  StockLocationReferenceInput,
} from '../../../generated/graphql'
import { JSONProductVariantStockLocations } from '../../json-spec'

export function handleJsonStockToStockInput({
  jsonStock,
  existingProductVariantStockLocations,
}: {
  jsonStock?: number | JSONProductVariantStockLocations
  existingProductVariantStockLocations?: ProductStockLocation[] | null
}): undefined | StockLocationReferenceInput[] {
  if (typeof jsonStock === undefined) {
    return undefined
  }

  const stockVariants: StockLocationReferenceInput[] =
    existingProductVariantStockLocations || []

  if (jsonStock && typeof jsonStock === 'object') {
    const p = jsonStock as Record<string, number>
    Object.keys(jsonStock).forEach((identifier) => {
      const existingEntry = stockVariants.find(
        (i) => i.identifier === identifier
      )
      if (existingEntry) {
        existingEntry.stock = p[identifier]
      } else {
        stockVariants.push({
          identifier,
          stock: p[identifier],
        })
      }
    })
  } else {
    const defaultStock = stockVariants.find((i) => i.identifier === 'default')
    if (defaultStock) {
      defaultStock.stock = jsonStock
    } else {
      stockVariants.push({
        identifier: 'default',
        stock: jsonStock,
      })
    }
  }

  return stockVariants.map(({ identifier, stock, meta }) => ({
    identifier,
    stock,
    meta: meta || [],
  }))
}
