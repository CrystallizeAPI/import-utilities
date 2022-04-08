import gql from 'graphql-tag'
import { Shape, shapeTypes, componentTypes, Component } from '../../types'
import {
  buildCreateShapeMutation,
  buildUpdateShapeMutation,
} from '../../graphql'

import { JsonSpec } from '../json-spec'
import { AreaUpdate, BootstrapperContext, validShapeIdentifier } from './utils'
import { EnumType } from 'json-to-graphql-query'

export async function getExistingShapesForSpec(
  context: BootstrapperContext,
  onUpdate: (t: AreaUpdate) => any
): Promise<Shape[]> {
  const existingShapes = await getExistingShapes(context)

  function handleComponent(cmp: any) {
    const base: Component = {
      id: cmp.id,
      name: cmp.name,
      type: cmp.type,
      description: cmp.description,
      config: cmp.config,
    }

    switch (cmp.type) {
      case 'componentChoice': {
        base.config = {
          ...cmp.config,
          choices: cmp.config.choices.map(handleComponent),
        }
        break
      }
      case 'contentChunk': {
        base.config = {
          ...cmp.config,
          components: cmp.config.components.map(handleComponent),
        }
        break
      }
    }

    return base
  }

  return existingShapes.map((eShape) => {
    let identifier
    if (eShape.identifier) {
      identifier = validShapeIdentifier(eShape.identifier, onUpdate)
    } else if (eShape.id) {
      identifier = validShapeIdentifier(eShape.id, onUpdate)
    }
    if (!identifier) {
      throw new Error(
        'Cannot handle shape without identifier (' + eShape.name + ')'
      )
    }

    const shape: Shape = {
      name: eShape.name,
      id: identifier,
      identifier,
      type: eShape.type,
      components: eShape?.components?.map(handleComponent),
    }
    return shape
  })
}

async function getExistingShapes(
  context: BootstrapperContext
): Promise<Shape[]> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
    query: gql`
      query GET_TENANT_SHAPES($tenantId: ID!) {
        shape {
          getMany(tenantId: $tenantId) {
            id
            identifier
            type
            name
            components {
              ...componentBase
              config {
                ...primitiveComponentConfig
                ... on ContentChunkComponentConfig {
                  repeatable
                  components {
                    ...componentBase
                    config {
                      ...primitiveComponentConfig
                    }
                  }
                }
                ... on ComponentChoiceComponentConfig {
                  choices {
                    ...componentBase
                    config {
                      ...primitiveComponentConfig
                    }
                  }
                }
              }
            }
          }
        }
      }

      fragment componentBase on ShapeComponent {
        id
        name
        type
        description
      }

      fragment primitiveComponentConfig on ComponentConfig {
        ... on NumericComponentConfig {
          decimalPlaces
          units
        }
        ... on PropertiesTableComponentConfig {
          sections {
            title
            keys
          }
        }
        ... on SelectionComponentConfig {
          min
          max
          options {
            key
            value
            isPreselected
          }
        }
        ... on FilesComponentConfig {
          acceptedContentTypes {
            contentType
            extensionLabel
          }
          min
          max
          maxFileSize {
            size
            unit
          }
        }
        ... on ItemRelationsComponentConfig {
          acceptedShapeIdentifiers
          min
          max
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.shape?.getMany || []
}

function getShapeType(type: string): EnumType {
  return (shapeTypes as Record<string, EnumType>)[type]
}
function getComponentType(type: string): EnumType {
  return (componentTypes as Record<string, EnumType>)[type]
}

function buildComponentConfigInput(component: Component) {
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
    case 'itemRelations': {
      if (component.config) {
        return {
          config: {
            itemRelations: component.config,
          },
        }
      }
      return {}
    }
    case 'componentChoice': {
      return {
        config: {
          componentChoice: {
            ...component.config,
            choices: component.config?.choices?.map((c: any) => ({
              ...c,
              type: getComponentType(c.type),
              ...buildComponentConfigInput(c),
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
              ...buildComponentConfigInput(c),
            })),
          },
        },
      }
    }
  }

  return {}
}

async function createOrUpdateShape(
  shape: Shape,
  existingShapes: Shape[],
  onUpdate: (t: AreaUpdate) => {},
  context: BootstrapperContext
): Promise<string> {
  try {
    const tenantId = context.tenantId
    const existingShape = existingShapes.find(
      (s) => s.identifier === shape.identifier
    )
    const components =
      shape.components?.map((c) => {
        return {
          id: c.id,
          name: c.name,
          type: getComponentType(c.type),
          ...(c.description && { description: c.description }),
          ...buildComponentConfigInput(c),
        }
      }) || []

    if (existingShape?.components) {
      existingShape.components.forEach((c) => {
        if (!components.some((e) => e.id === c.id)) {
          components.push({
            id: c.id,
            name: c.name,
            type: getComponentType(c.type),
            ...(c.description && { description: c.description }),
            ...buildComponentConfigInput(c),
          })
        }
      })

      const identifier = existingShape.identifier || existingShape.id
      if (!identifier) {
        throw new Error(
          'Cannot update shape without identifier (' + existingShape.name + ')'
        )
      }

      const r = await context.callPIM({
        query: buildUpdateShapeMutation({
          id: identifier,
          identifier,
          tenantId,
          input: {
            components,
            ...(shape.name && { name: shape.name }),
          },
        }),
      })

      if (r?.data?.shape?.update) {
        return 'updated'
      }
    } else {
      const r = await context.callPIM({
        query: buildCreateShapeMutation({
          identifier: shape.identifier,
          type: getShapeType(shape.type),
          name: shape.name,
          tenantId: context.tenantId,
          components,
        }),
      })
      if (r?.data?.shape?.create) {
        return 'created'
      }
    }
  } catch (e) {
    console.log(e)
  }

  return 'error'
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

export async function setShapes({
  spec,
  onUpdate,
  context,
}: Props): Promise<Shape[]> {
  // Get all the shapes from the tenant
  const existingShapes = await getExistingShapes(context)

  if (!spec?.shapes) {
    return existingShapes
  }

  let finished = 0
  for (let i = 0; i < spec.shapes.length; i++) {
    const shape = spec.shapes[i]
    const result = await createOrUpdateShape(
      shape,
      existingShapes,
      onUpdate,
      context
    )
    finished++
    onUpdate({
      progress: finished / spec.shapes.length,
      message: `${shape.name} (${shape.identifier}): ${result}`,
    })
  }

  onUpdate({
    progress: 1,
  })

  return await getExistingShapes(context)
}
