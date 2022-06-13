import { KeyValuePairInput, VideoContentInput } from '..'
import { StockLocationReferenceInput } from '../../generated/graphql'

export interface CreateProductVariantInput {
  name?: string
  externalReference?: string
  sku: string
  isDefault: boolean
  stock?: number
  price?: number
  images?: {
    key: string
    mimeType?: string
    altText?: string
  }[]
  videos?: VideoContentInput[]
  priceVariants?: {
    identifier: string
    price?: number
  }[]
  stockLocations?: StockLocationReferenceInput[]
}
