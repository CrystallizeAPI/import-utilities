import { Shape } from '../../types'

export { Shape } from '../../types'

export type JSONTranslation =
  | Record<string, string>
  | Record<string, RichTextStructured>
  | string

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
  name: JSONTranslation
  children?: Topic[]
  parentId?: string
  hierarchyPath?: string
  parentHierarchyPath?: string
}

export interface RichTextStructured {
  plainText?: string
  html?: string
  json?: JSON
}
export type RichText = RichTextStructured | string | null
export interface Image {
  src: string
  altText?: string
  caption?: RichText
}

export type ItemSingleLineContent = string

export interface ItemParagraphCollectionContent {
  title?: string
  body: RichText
  images?: Image[]
}
export type ItemImagesContent = Image[]
export type ItemBooleanContent = boolean
export type ComponentId = string

export type ComponentContent =
  | ItemSingleLineContent
  | RichText
  | ItemParagraphCollectionContent[]
  | ItemImagesContent
  | ItemBooleanContent
  | ComponentContentChunkContent
  | ItemComponentChoiceContent
  | null
export type ItemComponents = Record<ComponentId, ComponentContent>
export interface ComponentContentChunkContent {
  repeatable: boolean
  chunks: ItemComponents[]
}
export interface ItemComponentChoiceContent {
  selectedComponent?: ComponentContent
}

export interface Item {
  path?: string
  id?: string
  name: JSONTranslation
  shape: string
  components?: ItemComponents
  children?: Item[]
}

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: PriceVariant[]
  languages?: Language[]
  vatTypes?: VatType[]
  topicMaps?: Topic[]
  items?: Item[]
}
