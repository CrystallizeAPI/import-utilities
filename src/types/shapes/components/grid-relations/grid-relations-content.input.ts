import { ComponentContentInput } from '../component-content.input'

export interface GridRelationsComponentContentInput
  extends ComponentContentInput {
  gridRelations: {
    gridIds: string[]
  }
}
