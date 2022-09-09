import { Shape, ShapeComponent } from '@crystallize/schema/shape'
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

  return existingShapes.map((eShape): JSONShape => {
    const shape: Shape = {
      name: eShape.name,
      identifier: eShape.identifier,
      type: eShape.type,
    }
    return toJSONShape(shape)
  })
}

const shouldDefer = (data: Shape): boolean => {
  const filterCmp = (cmp: ShapeComponent) =>
    cmp.type === 'itemRelations' &&
    cmp.config?.itemRelations?.acceptedShapeIdentifiers?.length
  return (
    !!data.components?.filter(filterCmp).length ||
    !!data.variantComponents?.filter(filterCmp).length
  )
}

async function createOrUpdateShape(
  data: Shape,
  context: BootstrapperContext,
  isDeferred: boolean = false
): Promise<Status> {
  const s = { ...data }
  let defer = false

  if (!isDeferred && shouldDefer(data)) {
    delete s.components
    delete s.variantComponents
    defer = true
  }

  try {
    const result = await shapeOperation(s).execute(
      context.client as MassClientInterface
    )
    if (!result) {
      return Status.error
    }
    if (defer) {
      return Status.deferred
    }
    return Status.updated
  } catch (err) {
    console.error(err)
    return Status.error
  }
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
    const result = await createOrUpdateShape(data, context)
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
    const shape = deferredShapes[i]
    const result = await createOrUpdateShape(shape, context, true)
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
