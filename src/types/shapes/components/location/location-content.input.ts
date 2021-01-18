import { ComponentContentInput } from '../component-content.input'

export interface LocationComponentContentInput extends ComponentContentInput {
  location: {
    lat?: number
    long?: number
  }
}
