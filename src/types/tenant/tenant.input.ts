import { ShapeInput } from '../shapes'

export interface TenantInput {
  identifier: string
  name: string
  shapes?: ShapeInput[]
}
