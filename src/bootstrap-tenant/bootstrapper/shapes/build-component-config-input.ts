import { ComponentConfigInput } from '../../../generated/graphql'
import { InvalidItemRelationShapeIdentifier } from '../errors'
import { Shape, Component } from '../../../types'
import { getComponentType } from './get-component-type'
import { EnumType } from 'json-to-graphql-query'

export interface ComponentConfigInputSettings {
  config: ComponentConfigInput
  deferUpdate?: boolean
}

const buildItemRelationsComponentConfigInput = (
  component: Component,
  existingShapes: Shape[],
  isDeferred: boolean
): ComponentConfigInputSettings | null => {
  if (!component.config) {
    return null
  }

  const conf: ComponentConfigInputSettings = {
    config: {
      itemRelations: {
        ...component.config,
      },
    },
  }

  if (!component.config?.acceptedShapeIdentifiers?.length) {
    delete conf.config?.itemRelations?.acceptedShapeIdentifiers
    return conf
  }

  // API throws an error if related shape identifier does not exist.
  // We need to defer an update for this shape after the initial shape creation is complete.
  let deferUpdate = false
  component.config.acceptedShapeIdentifiers.map((identifier: string) => {
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
  })

  if (deferUpdate) {
    conf.deferUpdate = true
    delete conf.config?.itemRelations?.acceptedShapeIdentifiers
  }
  return conf
}

export const buildComponentConfigInput = (
  component: Component,
  existingShapes: Shape[],
  isDeferred: boolean
): ComponentConfigInputSettings | null => {
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
            files: {
              ...component.config,
              maxFileSize: component.config.maxFileSize
                ? {
                    size: component.config.maxFileSize.size,
                    unit: new EnumType(component.config.maxFileSize.unit),
                  }
                : undefined,
            },
          },
        }
      }
      return null
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
      let shouldDefer
      return {
        config: {
          componentChoice: {
            ...component.config,
            choices: component.config?.choices?.map((c: any) => {
              const conf = buildComponentConfigInput(
                c,
                existingShapes,
                isDeferred
              )
              const cmp = {
                ...c,
                type: getComponentType(c.type),
              }
              if (conf?.config) {
                cmp.config = conf.config
              }
              if (conf?.deferUpdate) {
                shouldDefer = true
              }
              return cmp
            }),
          },
        },
        deferUpdate: shouldDefer,
      }
    }
    case 'contentChunk': {
      let shouldDefer
      return {
        config: {
          contentChunk: {
            ...component.config,
            components: component.config?.components?.map((c: any) => {
              const conf = buildComponentConfigInput(
                c,
                existingShapes,
                isDeferred
              )
              const cmp = {
                ...c,
                type: getComponentType(c.type),
              }
              if (conf?.config) {
                cmp.config = conf.config
              }
              if (conf?.deferUpdate) {
                shouldDefer = true
              }
              return cmp
            }),
          },
        },
        deferUpdate: shouldDefer,
      }
    }
  }

  return null
}
