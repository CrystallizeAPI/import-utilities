import { ComponentConfigInput } from '../../../generated/graphql'
import { InvalidItemRelationShapeIdentifier } from '../errors'
import { Shape, Component } from '../../../types'
import { getComponentType } from './get-component-type'

export interface ComponentConfigInputSettings {
  config?: ComponentConfigInput
  deferUpdate?: boolean
}

const buildItemRelationsComponentConfigInput = (
  component: Component,
  existingShapes: Shape[],
  isDeferred: boolean
): ComponentConfigInputSettings => {
  if (!component.config?.itemRelations?.acceptedShapeIdentifiers?.length) {
    const conf = {
      config: component.config,
    }
    delete component.config?.itemRelations?.acceptedShapeIdentifiers
    return conf
  }

  // API throws an error if related shape identifier does not exist.
  // We need to defer an update for this shape after the initial shape creation is complete.
  let deferUpdate = false
  component.config.itemRelations.acceptedShapeIdentifiers.map(
    (identifier: string) => {
      if (
        !existingShapes.find((shape: Shape) => shape.identifier === identifier)
      ) {
        if (isDeferred) {
          // If we're updating the shape then we will throw an error, as the
          // related shapes should already exist. This also prevents an
          // endless loop of deferred updates when spec is invalid.
          throw new InvalidItemRelationShapeIdentifier(identifier)
        }

        deferUpdate = true
      }
    }
  )

  const conf: ComponentConfigInputSettings = {
    config: component.config,
    deferUpdate,
  }
  if (deferUpdate) {
    delete conf.config?.itemRelations?.acceptedShapeIdentifiers
  }
  return conf
}

export const buildComponentConfigInput = (
  component: Component,
  existingShapes: Shape[],
  isDeferred: boolean
): ComponentConfigInputSettings => {
  switch (component.type) {
    case 'propertiesTable': {
      // When updating an existing shape, we get "sections"
      const conf = component.config?.sections || component.config

      return {
        config: {
          propertiesTable: { sections: conf || [] },
        },
      }
    }
    case 'numeric': {
      return {
        config: {
          numeric: component.config,
        },
      }
    }
    case 'files': {
      if (component.config) {
        return {
          config: {
            files: component.config,
          },
        }
      }
      return {}
    }
    case 'selection': {
      return {
        config: {
          selection: component.config,
        },
      }
    }
    case 'itemRelations':
      return buildItemRelationsComponentConfigInput(
        component,
        existingShapes,
        isDeferred
      )
    case 'componentChoice': {
      return {
        config: {
          componentChoice: {
            ...component.config,
            choices: component.config?.choices?.map((c: any) => ({
              ...c,
              type: getComponentType(c.type),
              ...buildComponentConfigInput(c, existingShapes, isDeferred),
            })),
          },
        },
      }
    }
    case 'contentChunk': {
      return {
        config: {
          contentChunk: {
            ...component.config,
            components: component.config?.components?.map((c: any) => ({
              ...c,
              type: getComponentType(c.type),
              ...buildComponentConfigInput(c, existingShapes, isDeferred),
            })),
          },
        },
      }
    }
  }

  return {}
}
