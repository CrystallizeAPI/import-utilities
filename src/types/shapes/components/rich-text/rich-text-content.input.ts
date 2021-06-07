import { ComponentContentInput } from '../component-content.input'

export interface RichTextContentInput {
  json?: JSON[]
  html?: string[]
}

export interface RichTextComponentContentInput extends ComponentContentInput {
  richText: RichTextContentInput
}
