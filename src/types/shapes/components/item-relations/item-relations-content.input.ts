import { ComponentContentInput } from '../component-content.input'

export interface ItemRelationsContentInput {
  itemIds: string[]
  productVariationSkus: string[]
}

export interface ItemRelationsComponentContentInput
  extends ComponentContentInput {
  itemRelations: ItemRelationsContentInput
}
