import { Shape } from '../../types'

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
export type RichText = JSONRichTextStructured | string | null
export interface JSONImage {
  src: string
  key?: string
  mimeType?: string
  altText?: string
  caption?: RichText
}

export type JSONSingleLine = string

export interface JSONParagraphCollection {
  title?: string
  body: RichText
  images?: JSONImage[]
}
export type JSONImages = JSONImage[]
export type JSONBoolean = boolean
export type ComponentId = string

export type JSONComponentContent =
  | JSONSingleLine
  | RichText
  | JSONParagraphCollection[]
  | JSONImages
  | JSONBoolean
  | JSONContentChunk
  | JSONComponentChoice
  | null
export type JSONComponents = Record<ComponentId, JSONComponentContent>
export interface JSONContentChunk {
  repeatable: boolean
  chunks: JSONComponents[]
}
export interface JSONComponentChoice {
  selectedComponent?: JSONComponentContent
}

export interface JSONItem {
  path?: string
  id?: string
  name: JSONTranslation
  shape: string
  components?: JSONComponents
  children?: JSONItem[]
}

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: JSONPriceVariant[]
  languages?: JSONLanguage[]
  vatTypes?: JSONVatType[]
  topicMaps?: JSONTopic[]
  items?: JSONItem[]
}
