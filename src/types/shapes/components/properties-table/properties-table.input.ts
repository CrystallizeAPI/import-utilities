import { ComponentInput, ComponentConfigInput } from '../component.input'

export interface PropertiesTableComponentConfigInput
  extends ComponentConfigInput {
  propertiesTable: {
    sections: {
      title: string
      keys: string[]
    }[]
  }
}

export interface PropertiesTableComponentInput extends ComponentInput {
  config: PropertiesTableComponentConfigInput
}
