import { EnumType } from 'json-to-graphql-query'
import { shapeTypes } from '../../../types'

export const getShapeType = (type: string): EnumType => {
  return (shapeTypes as Record<string, EnumType>)[type]
}
