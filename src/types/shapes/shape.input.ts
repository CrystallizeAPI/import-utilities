import { EnumType } from 'json-to-graphql-query'
import { ComponentInput } from './components/component.input'
import { KeyValuePairInput } from './key-value-pair.input'

export const shapeTypes = {
  product: new EnumType('product'),
  document: new EnumType('document'),
  folder: new EnumType('folder'),
}

export interface ShapeInput {
  identifier?: string
  tenantId?: string
  name: string
  type: EnumType
  meta?: KeyValuePairInput[]
  components?: ComponentInput[]
}

export interface ShapeUpdateInput {
  id: string
  identifier: string
  tenantId: string
  input: ShapeUpdateInputInput
}

export interface ShapeUpdateInputInput {
  name?: string
  meta?: KeyValuePairInput[]
  components?: ComponentInput[]
}
