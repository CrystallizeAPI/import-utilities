import {
  ShapeComponentInput,
  ComponentConfigInput,
} from '../shape-component.input'

export interface PropertiesTableComponentConfigInput
  extends ComponentConfigInput {
  propertiesTable: {
    sections: {
      title: string
      keys: string[]
    }[]
  }
}

export interface PropertiesTableComponentInput extends ShapeComponentInput {
  config: PropertiesTableComponentConfigInput
}
