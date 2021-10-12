export interface UpdateProductVariantInput {
  isDefault: boolean
  sku: string
  name?: string
  id?: string
  priceVariants?: {
    identifier: string
    price?: number
  }[]
  stockLocations?: {
    identifier: string
    stock: number
  }[]
}
