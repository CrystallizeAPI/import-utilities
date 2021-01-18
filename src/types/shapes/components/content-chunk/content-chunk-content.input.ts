import { ComponentContentInput } from '../component-content.input'

export interface ContentChunkComponentContentInput
  extends ComponentContentInput {
  contentChunk: {
    chunks: ComponentContentInput[][]
  }
}
