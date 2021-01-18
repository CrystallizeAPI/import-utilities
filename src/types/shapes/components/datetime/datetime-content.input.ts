import { ComponentContentInput } from '../component-content.input'

export interface DateTimeComponentContentInput extends ComponentContentInput {
  datetime: {
    datetime: string
  }
}
