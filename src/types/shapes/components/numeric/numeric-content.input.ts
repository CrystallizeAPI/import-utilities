import { ComponentContentInput } from '../component-content.input'

export interface NumericComponentContentInput extends ComponentContentInput {
  numeric: {
    number: number
    unit?: string
  }
}
