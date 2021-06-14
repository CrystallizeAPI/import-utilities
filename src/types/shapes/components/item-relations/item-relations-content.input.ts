import { ComponentContentInput } from '../component-content.input'

export interface ItemRelationsContentInput {
  itemIds: string[]
}

export interface ItemRelationsComponentContentInput
  extends ComponentContentInput {
  itemRelations: ItemRelationsContentInput
}
