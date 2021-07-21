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

export interface RichTextNode {
  kind?: 'inline' | 'block'
  type?:
    | 'abbrevition'
    | 'address'
    | 'article'
    | 'aside'
    | 'code'
    | 'container'
    | 'deleted'
    | 'details'
    | 'emphasized'
    | 'figcaption'
    | 'figure'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'heading5'
    | 'heading6'
    | 'highlight'
    | 'horizontal-line'
    | 'image'
    | 'line-break'
    | 'link'
    | 'unordered-list'
    | 'ordered-list'
    | 'list-item'
    | 'paragraph'
    | 'picture'
    | 'preformatted'
    | 'quote'
    | 'section'
    | 'strong'
    | 'subscripted'
    | 'superscripted'
    | 'time'
    | 'title-of-a-work'
    | 'underlined'
  children?: RichTextNode[]
  textContent?: string
  metadata?: Record<string, unknown>
}

export interface JSONRichTextStructured {
  plainText?: string
  html?: string
  json?: RichTextNode | RichTextNode[]
}
export type JSONRichText = JSONRichTextStructured | string | null

export interface JSONMedia {
  src: string
  key?: string
}

export interface JSONImage extends JSONMedia {
  mimeType?: string
  altText?: string
  caption?: JSONRichText
}

export interface JSONVideo extends JSONMedia {
  title?: string
  thumbnails?: JSONImage[]
}

export type JSONSingleLine = string

export interface JSONParagraphCollection {
  title?: string
  body: JSONRichText
  images?: JSONImages
  videos?: JSONVideos
}
export type JSONImages = JSONImage[]
export type JSONVideos = JSONVideo[]
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
  cataloguePath?: string
  externalReference?: string
}
export interface JSONGridReference {
  name?: string
}
export type JSONItemRelation = JSONItemReference
export type JSONItemRelations = JSONItemRelation[]
export type JSONGridRelation = JSONGridReference
export type JSONGridRelations = JSONGridReference[]

export type JSONSelection = string[] | string
export type ComponentId = string

export type JSONComponentContent =
  | JSONSingleLine
  | JSONRichText
  | JSONParagraphCollection[]
  | JSONImages
  | JSONVideos
  | JSONBoolean
  | JSONDateTime
  | JSONLocation
  | JSONPropertiesTable
  | JSONItemRelations
  | JSONGridRelations
  | JSONSelection
  | JSONContentChunk
  | JSONNumeric
  | null
export type JSONComponents = Record<ComponentId, JSONComponentContent>
export type JSONContentChunk = JSONComponents[]
export type JSONComponentChoice = Record<string, JSONComponentContent>

export type JSONItem = JSONProduct | JSONDocument | JSONFolder
export type JSONStructuredTopic = {
  hierarchy: string
}
export type JSONItemTopic = JSONStructuredTopic | string
export interface JSONItemBase {
  cataloguePath?: string
  externalReference?: string
  id?: string
  name: JSONTranslation
  shape: string
  components?: Record<string, JSONComponentContent | JSONComponentChoice>
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
  item?: JSONItemReference
  itemId?: string
  layout: {
    rowspan: number
    colspan: number
  }
}

export interface JSONGridRow {
  columns: JSONGridColumn[]
}

export interface JSONGrid {
  id?: string
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
