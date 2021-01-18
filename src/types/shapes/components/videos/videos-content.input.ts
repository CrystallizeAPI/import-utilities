import { ComponentContentInput } from '../component-content.input'
import { ImagesComponentContentInput } from '../images/images-content.input'

export interface VideosComponentContentInput extends ComponentContentInput {
  videos: {
    key: string
    thumbnails?: ImagesComponentContentInput
    title?: string
  }[]
}
