import { KeyValuePairInput } from '../../key-value-pair.input'
import { ComponentContentInput } from '../component-content.input'

export interface PropertiesTableComponentContentInput
  extends ComponentContentInput {
  propertiesTable: {
    sections?: {
      title?: string
      properties?: KeyValuePairInput[]
    }[]
  }
}
