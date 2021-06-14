import { ComponentContentInput } from '../component-content.input'
import { ImageComponentContentInput } from '../images/images-content.input'
import { RichTextContentInput } from '../rich-text/rich-text-content.input'
import { SingleLineContentInput } from '../single-line/single-line-content.input'
import { VideoContentInput } from '../videos/videos-content.input'

export interface ParagraphCollectionComponentContentInput
  extends ComponentContentInput {
  paragraphCollection: {
    paragraphs: {
      title?: SingleLineContentInput
      body?: RichTextContentInput
      images?: ImageComponentContentInput[]
      videos?: VideoContentInput[]
    }[]
  }
}
