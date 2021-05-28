import { Shape } from '../shapes/shape'

export interface Tenant {
  id: string
  identifier: string
  rootItemId: string
  vatTypes: [
    {
      id: string
      name: string
    }
  ]
  shapes: Shape[]
}
