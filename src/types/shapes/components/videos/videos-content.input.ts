import { ComponentContentInput } from '../component-content.input'
import { ImagesComponentContentInput } from '../images/images-content.input'

export interface VideoContentInput {
  key: string
  thumbnails?: ImagesComponentContentInput
  title?: string
}
export interface VideosComponentContentInput extends ComponentContentInput {
  videos: VideoContentInput[]
}
