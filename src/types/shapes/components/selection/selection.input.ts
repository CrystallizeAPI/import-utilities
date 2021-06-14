import { ComponentInput, ComponentConfigInput } from '../component.input'

export interface SelectionOption {
  key: string
  value: string
  isPreselected: boolean
}

export interface SelectionComponentConfigInput extends ComponentConfigInput {
  selection: {
    min?: number
    max?: number
    options?: SelectionOption[]
  }
}

export interface SelectionComponentInput extends ComponentInput {
  config: SelectionComponentConfigInput
}
