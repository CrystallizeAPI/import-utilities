import { ShapeComponent } from '@crystallize/schema'
import {
  JSONComponentChoice,
  JSONComponentContent,
  JSONFiles,
  JSONGrid,
  JSONImages,
  JSONVideos,
} from '../../json-spec'
import { AreaUpdate, BootstrapperContext } from '../utils'

export interface ICreateComponentsInput {
  components?: ItemComponents
  componentDefinitions?: ShapeComponent[]
  language: string
  grids: JSONGrid[]
  context: BootstrapperContext
  onUpdate(t: AreaUpdate): any
}

export type ItemComponents = Record<
  string,
  JSONComponentContent | JSONComponentChoice
> | null

export interface ICreateMediaInput {
  language: string
  context: BootstrapperContext
  onUpdate(t: AreaUpdate): any
}

export interface ICreateImagesInput extends ICreateMediaInput {
  images: JSONImages
}

export interface ICreateVideosInput extends ICreateMediaInput {
  videos: JSONVideos
}

export interface ICreateFilesInput extends ICreateMediaInput {
  files: JSONFiles
}
