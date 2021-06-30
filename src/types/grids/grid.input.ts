import { GridRow } from './grid'

export interface GridInput {
  language: string
  input: {
    tenantId?: string
    name: string
    rows?: GridRow[]
  }
}
