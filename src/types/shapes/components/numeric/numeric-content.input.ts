import { ComponentContentInput } from '../component-content.input'

export interface NumericComponentContentInput extends ComponentContentInput {
  numeric: {
    value: number
    unit?: string
  }
}
