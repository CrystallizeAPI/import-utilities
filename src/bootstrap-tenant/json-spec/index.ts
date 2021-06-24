import { KeyValuePairInput, Shape } from '../../types'

export { Shape } from '../../types'

export type JSONTranslation =
  | Record<string, string>
  | Record<string, JSONRichTextStructured>
  | string

export interface JSONPriceVariant {
  identifier: string
  name: string
  currency: string
}

export interface JSONLanguage {
  code: string
  name: string
  isDefault?: boolean
}

export interface JSONVatType {
  id?: string
  name: string
  percent: number
}

export interface JSONTopic {
  id?: string
  name: JSONTranslation
  children?: JSONTopic[]
  parentId?: string
  hierarchyPath?: string
  parentHierarchyPath?: string
}

export interface JSONRichTextStructured {
  plainText?: string
  html?: string
  json?: JSON
}
export type JSONRichText = JSONRichTextStructured | string | null
export interface JSONImage {
  src: string
  key?: string
  mimeType?: string
  altText?: string
  caption?: JSONRichText
}

export type JSONSingleLine = string

export interface JSONParagraphCollection {
  title?: string
  body: JSONRichText
  images?: JSONImage[]
}
export type JSONImages = JSONImage[]
export type JSONBoolean = boolean
export type JSONDateTime = string

export interface JSONLocation {
  lat: number
  long: number
}
export interface JSONNumeric {
  number: number
  unit?: string
}
export interface JSONPropertiesTableSection {
  title: string
  properties?: Record<string, any>
}
export type JSONPropertiesTable = JSONPropertiesTableSection[]
export interface JSONItemReference {
  cataloguePath: string
}
export type JSONItemRelation = string | JSONItemReference
export type JSONItemRelations = JSONItemRelation[]
export type JSONSelection = string[] | string
export type ComponentId = string

export type JSONComponentContent =
  | JSONSingleLine
  | JSONRichText
  | JSONParagraphCollection[]
  | JSONImages
  | JSONBoolean
  | JSONDateTime
  | JSONLocation
  | JSONPropertiesTable
  | JSONItemRelations
  | JSONSelection
  | null
export type JSONComponents = Record<
  ComponentId,
  JSONComponentContent | JSONComponentChoice
>
export type JSONContentChunk = JSONComponents[]
export type JSONComponentChoice = Record<string, JSONComponentContent>

export type JSONItem = JSONProduct | JSONDocument | JSONFolder
export type JSONStructuredTopic = {
  hierarchy: string
}
export type JSONItemTopic = JSONStructuredTopic | string
export interface JSONItemBase {
  cataloguePath?: string
  id?: string
  name: JSONTranslation
  shape: string
  components?: Record<string, JSONComponentContent>
  topics?: JSONItemTopic[]
  _componentsData?: Record<string, any>
  _topicsData?: Record<string, string[]>
}

export interface JSONFolder extends JSONItemBase {
  children?: JSONItem[]
}
export interface JSONDocument extends JSONItemBase {}

export interface JSONProductVariant {
  isDefault?: boolean
  name: JSONTranslation
  sku: string
  price: Record<string, number> | number
  images?: JSONImage[]
  stock?: number
  attributes?: Record<string, string>
  externalReference?: string
}

export interface JSONProduct extends JSONItemBase {
  variants: JSONProductVariant[]
  vatType: string
}

export interface JSONGridColumn {
  item: JSONItemReference
  layout: {
    rowspan: number
    colspan: number
  }
}

export interface JSONGridRow {
  columns: JSONGridColumn[]
}

export interface JSONGrid {
  name: JSONTranslation
  rows: JSONGridRow[]
}

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: JSONPriceVariant[]
  languages?: JSONLanguage[]
  vatTypes?: JSONVatType[]
  topicMaps?: JSONTopic[]
  items?: JSONItem[]
  grids?: JSONGrid[]
}
