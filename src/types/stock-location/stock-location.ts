export interface StockLocation {
  tenantId: string
  identifier: string
  name: string
  settings: {
    minimum: number
    unlimited: boolean
  }
}

export interface StockLocationInput {
  tenantId: string
  identifier: string
  name: string
  settings?: {
    minimum: number
  }
}
