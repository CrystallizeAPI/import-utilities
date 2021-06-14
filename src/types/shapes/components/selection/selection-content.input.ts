import { ComponentContentInput } from '../component-content.input'

export interface SelectionComponentContentInput extends ComponentContentInput {
  selection: {
    keys: string[]
  }
}
