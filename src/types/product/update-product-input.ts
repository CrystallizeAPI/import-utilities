import { UpdateItemInput } from '../item'
import { UpdateProductVariantInput } from './update-product-variant-input'

export interface UpdateProductInput extends UpdateItemInput {
  vatTypeId?: string
  variants?: UpdateProductVariantInput[]
}
