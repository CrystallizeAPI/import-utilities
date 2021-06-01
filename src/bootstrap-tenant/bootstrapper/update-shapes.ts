import { Shape as GQLShape, shapeTypes, componentTypes } from '../../types'
import { buildCreateShapeMutation } from '../../graphql'

import { JsonSpec, Shape } from '../json-spec'
import { callPIM, getTenantId, StepStatus } from './utils'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
}

async function getExistingShapes(): Promise<GQLShape[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_SHAPES($tenantId: ID!) {
        shape {
          getMany(tenantId: $tenantId) {
            identifier
            type
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

async function createOrUpdateRootShape(
  shape: Shape,
  existingShapes: GQLShape[]
): Promise<string> {
  const existingShape = existingShapes.find(
    (s) => s.identifier === shape.identifier
  )
  if (existingShape) {
    // Add missing components
    const existingComponents = existingShape.components.map((c) => c.id)
    const missingComponents =
      shape.components?.filter((c) => !existingComponents.includes(c.id)) || []
    if (missingComponents.length > 0) {
      console.log('Missing components for ', shape.identifier)
      console.log(missingComponents.map((c) => c.id))
    }

    return 'updated'
  } else {
    const r = await callPIM({
      query: buildCreateShapeMutation({
        identifier: shape.identifier,
        type: shapeTypes[shape.type],
        name: shape.name,
        tenantId: getTenantId(),
        components: shape.components?.map((c) => {
          return {
            id: c.id,
            name: c.name,
            type: componentTypes[c.type],
            description: c.description,
          }
        }),
      }),
    })
    if (r?.data?.shape?.create) {
      return 'created'
    }
  }

  return 'error'
}

export async function updateShapes({
  spec,
  onUpdate,
}: Props): Promise<StepStatus> {
  if (!spec?.shapes) {
    return {
      done: true,
    }
  }

  onUpdate({
    done: false,
    message: 'Shapes: starting...',
  })

  // Get all the shapes from the tenant
  const existingShapes = await getExistingShapes()

  onUpdate({
    done: false,
    message: `Found ${existingShapes.length} existing shapes`,
  })

  spec.shapes.forEach(async (shape) => {
    const result = await createOrUpdateRootShape(shape, existingShapes)
    onUpdate({
      done: false,
      message: `Shape ${shape.name} (${shape.identifier}): ${result}`,
    })
  })

  return {
    done: true,
  }
}
