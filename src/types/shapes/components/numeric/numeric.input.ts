import { ComponentInput, ComponentConfigInput } from '../component.input'

export interface NumericComponentConfigInput extends ComponentConfigInput {
  numeric: {
    decimalPlaces: number
    units?: string[]
  }
}

export interface NumericComponentInput extends ComponentInput {
  config: NumericComponentConfigInput
}
