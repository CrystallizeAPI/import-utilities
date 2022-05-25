import { Component, ComponentInput, Shape } from '../../../types'
import { buildComponentConfigInput } from './build-component-config-input'
import { getComponentType } from './get-component-type'

interface BuildComponentInputResponse {
  input: ComponentInput
  deferUpdate?: boolean
}

export const buildcomponentInput = (
  component: Component,
  existingShapes: Shape[],
  isDeferred: boolean
): BuildComponentInputResponse => {
  const conf = buildComponentConfigInput(component, existingShapes, isDeferred)
  const input: ComponentInput = {
    id: component.id,
    name: component.name,
    type: getComponentType(component.type),
    ...(component.description && { description: component.description }),
  }
  if (conf?.config) {
    input.config = conf.config
  }
  return {
    input,
    deferUpdate: conf?.deferUpdate,
  }
}
