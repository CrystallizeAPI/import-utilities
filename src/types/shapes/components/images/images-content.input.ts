import { ComponentContentInput } from '../component-content.input'
import { RichTextContentInput } from '../rich-text/rich-text-content.input'

export interface ImageComponentContentInput {
  key: string
  mimeType?: string
  altText?: string
  caption?: RichTextContentInput
}

export interface ImagesComponentContentInput extends ComponentContentInput {
  images: ImageComponentContentInput[]
}
