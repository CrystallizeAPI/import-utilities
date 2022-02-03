import { EnumType } from 'json-to-graphql-query'

export const componentTypes = {
  boolean: new EnumType('boolean'),
  componentChoice: new EnumType('componentChoice'),
  contentChunk: new EnumType('contentChunk'),
  datetime: new EnumType('datetime'),
  gridRelations: new EnumType('gridRelations'),
  images: new EnumType('images'),
  itemRelations: new EnumType('itemRelations'),
  location: new EnumType('location'),
  numeric: new EnumType('numeric'),
  paragraphCollection: new EnumType('paragraphCollection'),
  propertiesTable: new EnumType('propertiesTable'),
  richText: new EnumType('richText'),
  singleLine: new EnumType('singleLine'),
  videos: new EnumType('videos'),
  selection: new EnumType('selection'),
  files: new EnumType('files'),
}

export interface ComponentConfigInput {}

export interface ComponentInput {
  id: string
  name: string
  type: EnumType
  description?: string
  config?: ComponentConfigInput
}
