import { ComponentContentInput } from '../component-content.input'

export interface ItemRelationsContentInput {
  itemIds: string[]
  skus: string[]
}

export interface ItemRelationsComponentContentInput
  extends ComponentContentInput {
  itemRelations: ItemRelationsContentInput
}
