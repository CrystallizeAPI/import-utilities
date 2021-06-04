import { Shape, shapeTypes, componentTypes, Component } from '../../types'
import {
  buildCreateShapeMutation,
  buildUpdateShapeMutation,
} from '../../graphql'

import { JsonSpec } from '../json-spec'
import { callPIM, getTenantId, StepStatus } from './utils'
import { EnumType } from 'json-to-graphql-query'

async function getExistingShapes(): Promise<Shape[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
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
      return {
        config: {
          propertiesTable: component.config,
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
    case 'selection': {
      return {
        config: {
          selection: component.config,
        },
      }
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
  onUpdate: (t: StepStatus) => {}
): Promise<string> {
  const tenantId = getTenantId()
  const existingShape = existingShapes.find(
    (s) => s.identifier === shape.identifier
  )

  if (existingShape) {
    const existingComponents = existingShape.components.map((c) => c.id)

    // Add missing (root) components
    const missingComponents =
      shape.components?.filter((c) => !existingComponents.includes(c.id)) || []
    if (missingComponents.length > 0) {
      onUpdate({
        done: false,
        message: `Shape "${
          shape.name
        }": Adding the following components: ${missingComponents
          .map((c) => c.name)
          .join(',')}`,
      })

      const r = await callPIM({
        query: buildUpdateShapeMutation({
          id: existingShape.id,
          identifier: existingShape.identifier,
          tenantId,
          input: {
            components: [
              ...existingShape.components.map((c) => ({
                id: c.id,
                name: c.name,
                type: getComponentType(c.type),
                ...buildComponentConfigInput(c),
              })),
              ...missingComponents.map((c) => ({
                id: c.id,
                name: c.name,
                type: getComponentType(c.type),
                ...(c.description && { description: c.description }),
                ...buildComponentConfigInput(c),
              })),
            ],
          },
        }),
      })

      if (r?.data?.shape?.update) {
        return 'updated'
      } else {
        console.log(JSON.stringify(r, null, 1))
        return 'error'
      }
    }

    return 'untouched'
  } else {
    const r = await callPIM({
      query: buildCreateShapeMutation({
        identifier: shape.identifier,
        type: getShapeType(shape.type),
        name: shape.name,
        tenantId: getTenantId(),
        components: shape.components?.map((c) => {
          return {
            id: c.id,
            name: c.name,
            type: getComponentType(c.type),
            ...(c.description && { description: c.description }),
            ...buildComponentConfigInput(c),
          }
        }),
      }),
    })
    if (r?.data?.shape?.create) {
      return 'created'
    }
    console.log(JSON.stringify(r, null, 1))
  }

  return 'error'
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
}

export async function setShapes({ spec, onUpdate }: Props): Promise<Shape[]> {
  // Get all the shapes from the tenant
  const existingShapes = await getExistingShapes()

  if (!spec?.shapes) {
    return existingShapes
  }

  onUpdate({
    done: false,
    message: `Found ${existingShapes.length} existing shapes`,
  })

  await Promise.all(
    spec.shapes.map(async (shape) => {
      const result = await createOrUpdateShape(shape, existingShapes, onUpdate)
      onUpdate({
        done: false,
        message: `Shape ${shape.name} (${shape.identifier}): ${result}`,
      })
    })
  )

  return await getExistingShapes()
}
