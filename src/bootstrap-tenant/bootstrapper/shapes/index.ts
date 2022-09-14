import {
  ComponentChoiceComponentConfig,
  ContentChunkComponentConfig,
  ItemRelationsComponentConfig,
  Shape,
  ShapeComponent,
} from '@crystallize/schema/shape'
import {
  shape as shapeOperation,
  getManyShapesQuery,
} from '@crystallize/import-export-sdk/shape'
import { MassClientInterface } from '@crystallize/js-api-client'

import { JsonSpec } from '../../json-spec'
import { AreaUpdate, BootstrapperContext } from '../utils'

enum Status {
  created = 'created',
  updated = 'updated',
  error = 'error',
  deferred = 'deferred',
}

export async function getExistingShapesForSpec(
  context: BootstrapperContext
): Promise<Shape[]> {
  const { query, variables } = getManyShapesQuery({
    tenantId: context.tenantId,
  })
  const existingShapes: Shape[] = await context.client
    ?.pimApi(query, variables)
    .then((res) => res?.shape?.getMany)
  return existingShapes
}

const shouldDefer = (data: Shape): boolean => {
  const filterRelations = (cmp: ShapeComponent) =>
    cmp.type === 'itemRelations' &&
    (cmp.config as ItemRelationsComponentConfig)?.acceptedShapeIdentifiers
      ?.length

  const filterChunks = (cmp: ShapeComponent) =>
    cmp.type === 'contentChunk' &&
    (cmp.config as ContentChunkComponentConfig).components.filter(
      filterRelations
    )?.length

  const filterChoices = (cmp: ShapeComponent) =>
    cmp.type === 'componentChoice' &&
    (cmp.config as ComponentChoiceComponentConfig).choices.filter(
      filterRelations
    )?.length

  return (
    !!data.components?.filter(filterRelations).length ||
    !!data.components?.filter(filterChunks).length ||
    !!data.components?.filter(filterChoices).length ||
    !!data.variantComponents?.filter(filterRelations).length ||
    !!data.variantComponents?.filter(filterChunks).length ||
    !!data.variantComponents?.filter(filterChoices).length
  )
}

async function handleShape(
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
    if (context.config.logLevel === 'verbose') {
      console.error(err)
    }
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

  const { query, variables } = getManyShapesQuery(
    {
      tenantId: context.tenantId,
    },
    {
      includeComponents: true,
    }
  )
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
    const data = spec.shapes[i] as Shape
    const result = await handleShape(data, context)
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
    const result = await handleShape(shape, context, true)
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
