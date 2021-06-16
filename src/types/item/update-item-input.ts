import { ComponentContentInput } from '../shapes'

export interface UpdateItemInput {
  name: string
  topicIds?: string[]
  components?: {
    [componentId: string]: ComponentContentInput
  }
}
