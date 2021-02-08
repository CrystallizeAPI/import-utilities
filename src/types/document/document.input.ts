import { ComponentContentInput } from '../shapes/components/component-content.input'

export interface DocumentInput {
  tenantId?: string
  shapeIdentifier?: string
  name: string
  components?: {
    [componentId: string]: ComponentContentInput
  }
  tree?: {
    parentId: string
  }
}
