export interface CreateProductVariantInput {
  name?: string
  sku: string
  isDefault: boolean
  stock?: number
  price?: number
  images?: {
    key: string
    mimeType?: string
    altText?: string
  }[]
  priceVariants?: {
    identifier: string
    price?: number
  }[]
}
