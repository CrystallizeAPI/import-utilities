import { ComponentContentInput } from '../component-content.input'
import { ImageComponentContentInput } from '../images/images-content.input'

export interface VideoContentInput {
  key: string
  thumbnails?: ImageComponentContentInput[]
  title?: string
}
export interface VideosComponentContentInput extends ComponentContentInput {
  videos: VideoContentInput[]
}
