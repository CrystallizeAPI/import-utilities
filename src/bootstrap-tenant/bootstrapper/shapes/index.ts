import {
  Shape,
  ShapeComponent,
  ShapeComponentConfig,
} from '@crystallize/schema/shape'
import {
  shape as shapeOperation,
  getManyShapesQuery,
} from '@crystallize/import-export-sdk/shape'
import { MassClientInterface } from '@crystallize/js-api-client'

import {
  JSONShape,
  JSONShapeComponent,
  JSONShapeComponentComponentChoiceConfig,
  JSONShapeComponentConfig,
  JSONShapeComponentContentChunkConfig,
  JsonSpec,
} from '../../json-spec'
import { AreaUpdate, BootstrapperContext } from '../utils'
import { buildcomponentInput } from './build-component-input'

enum Status {
  created = 'created',
  updated = 'updated',
  error = 'error',
  deferred = 'deferred',
}

const toImportSdkShapeComponent = (
  data: JSONShapeComponent
): ShapeComponent => {
  if (!data.config) {
    return data as ShapeComponent
  }

  if (data.type === 'contentChunk') {
    const config = {
      contentChunk: {
        ...data.config,
        components: (
          data.config as JSONShapeComponentContentChunkConfig
        ).components.map(toImportSdkShapeComponent),
      },
    }
    return {
      ...data,
      config,
    }
  }

  if (data.type === 'componentChoice') {
    const config = {
      componentChoice: {
        ...data.config,
        choices: (
          data.config as JSONShapeComponentComponentChoiceConfig
        ).choices.map(toImportSdkShapeComponent),
      },
    }
    return {
      ...data,
      config,
    }
  }

  return {
    ...data,
    config: {
      [data.type]: data.config,
    },
  }
}

const toJSONShapeComponent = (data: ShapeComponent): JSONShapeComponent =>
  data.config
    ? {
        ...data,
        /** @ts-ignore */
        config: data.config[data.type] as JSONShapeComponentConfig,
      }
    : (data as JSONShapeComponent)

const toImportSdkShape = (data: JSONShape): Shape => {
  if (!data.components?.length && !data.variantComponents?.length) {
    return data as Shape
  }

  return {
    ...data,
    components: data.components?.map(toImportSdkShapeComponent),
    variantComponents: data.variantComponents?.map(toImportSdkShapeComponent),
  }
}

const toJSONShape = (data: Shape): JSONShape => {
  if (!data.components?.length && !data.variantComponents?.length) {
    return data as JSONShape
  }

  return {
    ...data,
    components: data.components?.map(toJSONShapeComponent),
    variantComponents: data.variantComponents?.map(toJSONShapeComponent),
  }
}

export async function getExistingShapesForSpec(
  context: BootstrapperContext,
  onUpdate: (t: AreaUpdate) => any
): Promise<JSONShape[]> {
  const { query, variables } = getManyShapesQuery({
    tenantId: context.tenantId,
  })
  const existingShapes: Shape[] = await context.client
    ?.pimApi(query, variables)
    .then((res) => res?.shape?.getMany)

  function handleComponent(cmp: any) {
    const base: ShapeComponent = {
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

  return existingShapes.map((eShape): JSONShape => {
    const shape: Shape = {
      name: eShape.name,
      identifier: eShape.identifier,
      type: eShape.type,
      components: eShape?.components?.map(handleComponent),
    }
    return toJSONShape(shape)
  })
}

async function createOrUpdateShape(
  data: Shape,
  existingShapes: Shape[],
  onUpdate: (t: AreaUpdate) => {},
  context: BootstrapperContext,
  isDeferred: boolean = false
): Promise<string> {
  let shouldDefer
  let status
  try {
    const existingShape = existingShapes.find(
      (s) => s.identifier === data.identifier
    )
    const components =
      data.components?.map((component) => {
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

    if (existingShape) {
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
      }

      const identifier = existingShape.identifier
      if (!identifier) {
        throw new Error(
          `Cannot update shape without identifier: ${existingShape.name}`
        )
      }

      const result = await shapeOperation(data).execute(
        context.client as MassClientInterface
      )
      status = result ? Status.updated : Status.error
    } else {
      const result = await shapeOperation(data).execute(
        context.client as MassClientInterface
      )
      status = result ? Status.created : Status.error
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

const getExistingShapes = async (
  context: BootstrapperContext
): Promise<Shape[]> => {
  if (!context.client) {
    return []
  }

  const { query, variables } = getManyShapesQuery({
    tenantId: context.tenantId,
  })
  return context.client
    .pimApi(query, variables)
    .then((res) => res?.shape?.getMany)
}

export async function setShapes({
  spec,
  onUpdate,
  context,
}: Props): Promise<Shape[]> {
  if (!context.client) {
    throw new Error('missing @crystallize/js-api-client instace')
  }

  // Get all the shapes from the tenant
  const existingShapes: Shape[] = await getExistingShapes(context)
  const deferredShapes: Shape[] = []

  if (!spec?.shapes) {
    return existingShapes
  }

  let finished = 0
  for (let i = 0; i < spec.shapes.length; i++) {
    const data: Shape = toImportSdkShape(spec.shapes[i])
    const result = await createOrUpdateShape(
      data,
      existingShapes,
      onUpdate,
      context
    )
    if (result === 'deferred') {
      deferredShapes.push(data)
    } else {
      finished++
    }

    onUpdate({
      progress: finished / spec.shapes.length,
      message: `${data.name} (${data.identifier}): ${result}`,
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
