import { ComponentContentInput } from '../shapes/components/component-content.input'

export interface FolderInput {
  tenantId: string
  shapeId: string
  name: string
  components?: ComponentContentInput[]
  tree?: {
    parentId: string
  }
}
