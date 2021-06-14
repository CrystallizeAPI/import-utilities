import { Shape, shapeTypes, componentTypes, Component } from '../../types'
import {
  buildCreateShapeMutation,
  buildUpdateShapeMutation,
} from '../../graphql'

import { JsonSpec } from '../json-spec'
import { callPIM, getTenantId, StepStatus, validShapeIdentifier } from './utils'
import { EnumType } from 'json-to-graphql-query'

export async function getExistingShapesForSpec(): Promise<Shape[]> {
  const existingShapes = await getExistingShapes()

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
    const shape: Shape = {
      name: eShape.name,
      id: validShapeIdentifier(eShape.id),
      identifier: validShapeIdentifier(eShape.identifier),
      type: eShape.type,
      components: eShape?.components.map(handleComponent),
    }
    return shape
  })
}

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
  try {
    const tenantId = getTenantId()
    const existingShape = existingShapes.find(
      (s) => s.identifier === shape.identifier
    )
    const components = shape.components?.map((c) => {
      return {
        id: c.id,
        name: c.name,
        type: getComponentType(c.type),
        ...(c.description && { description: c.description }),
        ...buildComponentConfigInput(c),
      }
    })

    if (existingShape) {
      const r = await callPIM({
        query: buildUpdateShapeMutation({
          id: existingShape.id,
          identifier: existingShape.identifier,
          tenantId,
          input: {
            components,
          },
        }),
      })

      if (r?.data?.shape?.update) {
        return 'updated'
      }
    } else {
      const r = await callPIM({
        query: buildCreateShapeMutation({
          identifier: shape.identifier,
          type: getShapeType(shape.type),
          name: shape.name,
          tenantId: getTenantId(),
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
  onUpdate(t: StepStatus): any
}

export async function setShapes({ spec, onUpdate }: Props): Promise<Shape[]> {
  // Get all the shapes from the tenant
  const existingShapes = await getExistingShapes()

  if (!spec?.shapes) {
    return existingShapes
  }

  for (let i = 0; i < spec.shapes.length; i++) {
    const shape = spec.shapes[i]
    const result = await createOrUpdateShape(shape, existingShapes, onUpdate)
    onUpdate({
      done: false,
      message: `${shape.name} (${shape.identifier}): ${result}`,
    })
  }

  return await getExistingShapes()
}
