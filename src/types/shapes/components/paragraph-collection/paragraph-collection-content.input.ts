import { ComponentContentInput } from '../component-content.input'
import { ImagesComponentContentInput } from '../images/images-content.input'
import { RichTextComponentContentInput } from '../rich-text/rich-text-content.input'
import { SingleLineComponentContentInput } from '../single-line/single-line-content.input'
import { VideosComponentContentInput } from '../videos/videos-content.input'

export interface ParagraphCollectionComponentContentInput
  extends ComponentContentInput {
  paragraphCollection: {
    paragraphs: {
      title?: SingleLineComponentContentInput
      body?: RichTextComponentContentInput
      images?: ImagesComponentContentInput[]
      videos?: VideosComponentContentInput[]
    }[]
  }
}
