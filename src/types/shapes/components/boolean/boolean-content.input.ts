import { ComponentContentInput } from '../component-content.input'

export interface BooleanComponentContentInput extends ComponentContentInput {
  boolean: {
    value: boolean
  }
}
