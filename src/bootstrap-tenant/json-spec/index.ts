import { Shape } from '../../types'

export interface PriceVariant {
  identifier: string
  name: string
  currency: string
}

export interface Language {
  code: string
  name: string
  isDefault?: boolean
}

export interface VatType {
  name: string
  percent: number
}

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: PriceVariant[]
  languages?: Language[]
  vatTypes?: VatType[]
}
