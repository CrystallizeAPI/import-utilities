import { EnumType } from 'json-to-graphql-query'

interface ComponentTypeEnum {
  [name: string]: EnumType
}

export const componentTypes: ComponentTypeEnum = {
  boolean: new EnumType('boolean'),
  componentChoice: new EnumType('componentChoice'),
  contentChunk: new EnumType('contentChunk'),
  datetime: new EnumType('datetime'),
  gridRelations: new EnumType('gridRelations'),
  images: new EnumType('images'),
  itemRelations: new EnumType('itemRelations'),
  location: new EnumType('location'),
  paragraphCollection: new EnumType('paragraphCollection'),
  propertiesTable: new EnumType('propertiesTable'),
  richText: new EnumType('richText'),
  singleLine: new EnumType('singleLine'),
  videos: new EnumType('videos'),
}

export interface ComponentConfigInput {}

export interface ShapeComponentInput {
  id: string
  name: string
  type: EnumType
  description?: string
  config?: ComponentConfigInput
}
