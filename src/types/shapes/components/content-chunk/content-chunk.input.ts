import { ComponentInput, ComponentConfigInput } from '../component.input'

export interface ContentChunkComponentConfigInput extends ComponentConfigInput {
  contentChunk: {
    components: ComponentInput[]
    repeatable?: boolean
  }
}

export interface ContentChunkComponentInput extends ComponentInput {
  config: ContentChunkComponentConfigInput
}
