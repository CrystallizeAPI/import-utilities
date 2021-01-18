import { ComponentContentInput } from '../component-content.input'
import { RichTextComponentContentInput } from '../rich-text/rich-text-content.input'

export interface ImagesComponentContentInput extends ComponentContentInput {
  images: {
    key: string
    mimeType?: string
    altText?: string
    caption?: RichTextComponentContentInput
  }[]
}
