import gql from 'graphql-tag'
import { Shape, Component, ComponentInput } from '../../../types'
import {
  buildCreateShapeQueryAndVariables,
  buildUpdateShapeQueryAndVariables,
} from '../../../graphql'

import { JSONShape, JsonSpec } from '../../json-spec'
import { AreaUpdate, BootstrapperContext, validShapeIdentifier } from '../utils'
import { getShapeType } from './get-shape-type'
import { buildcomponentInput } from './build-component-input'

enum Status {
  created = 'created',
  updated = 'updated',
  error = 'error',
  deferred = 'deferred',
}

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

async function createOrUpdateShape(
  shape: Shape,
  existingShapes: Shape[],
  onUpdate: (t: AreaUpdate) => {},
  context: BootstrapperContext,
  isDeferred: boolean = false
): Promise<string> {
  let shouldDefer
  let status
  try {
    const tenantId = context.tenantId
    const existingShape = existingShapes.find(
      (s) => s.identifier === shape.identifier
    )
    const components =
      shape.components?.map((component) => {
        const { input, deferUpdate } = buildcomponentInput(
          component,
          existingShapes,
          isDeferred
        )
        if (deferUpdate) {
          shouldDefer = true
        }
        return input
      }) || []

    if (existingShape?.components) {
      existingShape.components.forEach((component) => {
        if (
          !components.some(
            (existingComponent) => existingComponent.id === component.id
          )
        ) {
          const { input, deferUpdate } = buildcomponentInput(
            component,
            existingShapes,
            isDeferred
          )
          if (deferUpdate) {
            shouldDefer = true
          }
          components.push(input)
        }
      })

      const identifier = existingShape.identifier || existingShape.id
      if (!identifier) {
        throw new Error(
          'Cannot update shape without identifier (' + existingShape.name + ')'
        )
      }

      const { query, variables } = buildUpdateShapeQueryAndVariables({
        id: identifier,
        identifier,
        tenantId,
        input: {
          components,
          ...(shape.name && { name: shape.name }),
        },
      })
      const r = await context.callPIM({
        query,
        variables,
      })

      status = r?.data?.shape?.update ? Status.updated : Status.error
    } else {
      const { query, variables } = buildCreateShapeQueryAndVariables({
        identifier: shape.identifier,
        type: getShapeType(shape.type),
        name: shape.name,
        tenantId: context.tenantId,
        components,
      })
      const r = await context.callPIM({
        query,
        variables,
      })
      status = r?.data?.shape?.create ? Status.created : Status.error
    }
  } catch (err) {
    console.error(err)
    return Status.error
  }

  if (shouldDefer && status !== Status.error) {
    status = Status.deferred
  }

  return status
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
  const deferredShapes: JSONShape[] = []

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
    if (result === 'deferred') {
      deferredShapes.push(shape)
    } else {
      finished++
    }

    onUpdate({
      progress: finished / spec.shapes.length,
      message: `${shape.name} (${shape.identifier}): ${result}`,
    })
  }

  for (let i = 0; i < deferredShapes.length; i++) {
    const existingShapes = await getExistingShapes(context)
    const shape = deferredShapes[i]
    const result = await createOrUpdateShape(
      shape,
      existingShapes,
      onUpdate,
      context,
      true
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
