import { EnumType } from 'json-to-graphql-query'
import { ComponentInput } from './components/component.input'

interface ShapeTypeEnum {
  [name: string]: EnumType
}

export const shapeTypes: ShapeTypeEnum = {
  product: new EnumType('product'),
  document: new EnumType('document'),
  folder: new EnumType('folder'),
}

export interface ShapeInput {
  tenantId?: string
  name: string
  type: EnumType
  components?: ComponentInput[]
}
