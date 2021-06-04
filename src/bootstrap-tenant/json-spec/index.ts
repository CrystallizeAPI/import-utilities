import { Shape } from '../../types'

export { Shape } from '../../types'

export type Translation = Record<string, string> | string

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
  id?: string
  name: string
  percent: number
}

export interface Topic {
  id?: string
  name: Translation
  children?: Topic[]
}

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: PriceVariant[]
  languages?: Language[]
  vatTypes?: VatType[]
}
