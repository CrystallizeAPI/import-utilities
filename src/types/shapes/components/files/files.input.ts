import { EnumType } from 'json-to-graphql-query'
import { ComponentInput, ComponentConfigInput } from '../component.input'

export interface FilesComponentConfigInput extends ComponentConfigInput {
  files: {
    acceptedContentTypes?: {
      contentType: string
      extensionLabel?: string
    }[]
    min?: number
    max?: number
    maxFileSize?: {
      size: number
      unit: EnumType
    }
  }
}

export interface FilesComponentInput extends ComponentInput {
  config: FilesComponentConfigInput
}
