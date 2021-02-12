import { CreateItemInput } from '../item'
import { CreateProductVariantInput } from './create-product-variant-input'

export interface CreateProductInput extends CreateItemInput {
  vatTypeId: string
  variants: CreateProductVariantInput[]
}
