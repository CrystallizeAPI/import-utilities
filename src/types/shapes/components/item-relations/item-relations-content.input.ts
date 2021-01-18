import { ComponentContentInput } from '../component-content.input'

export interface ItemRelationsComponentContentInput
  extends ComponentContentInput {
  itemRelations: {
    itemIds: string[]
  }
}
