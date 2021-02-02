import { ComponentContentInput } from '../shapes/components/component-content.input'

export interface DocumentInput {
  tenantId: string
  shapeId: string
  name: string
  components?: {
    [componentId: string]: ComponentContentInput
  }
  tree?: {
    parentId: string
  }
}
