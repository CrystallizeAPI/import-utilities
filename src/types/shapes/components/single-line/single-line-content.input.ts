import { ComponentContentInput } from '../component-content.input'

export interface SingleLineContentInput {
  text?: string
}

export interface SingleLineComponentContentInput extends ComponentContentInput {
  singleLine: SingleLineContentInput
}
