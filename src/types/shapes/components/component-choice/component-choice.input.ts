import { ComponentInput, ComponentConfigInput } from '../component.input'

export interface ComponentChoiceComponentConfigInput
  extends ComponentConfigInput {
  componentChoice: {
    choices: ComponentInput[]
  }
}

export interface ComponentChoiceComponentInput extends ComponentInput {
  config: ComponentChoiceComponentConfigInput
}
