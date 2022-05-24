import { EnumType } from 'json-to-graphql-query'
import { componentTypes } from '../../../types'

export const getComponentType = (type: string): EnumType => {
  return (componentTypes as Record<string, EnumType>)[type]
}
