import { BootstrapperContext } from '.'
import { callCatalogue, callPIM } from './api'

const cache = new Map()

export interface ItemAndParentId {
  itemId?: string
  parentId?: string
}

export function clearCache() {
  cache.clear()
}

export async function getItemId(props: {
  externalReference?: string
  cataloguePath?: string
  language: string
  tenantId: string
  context: BootstrapperContext
  shapeIdentifier?: string
}): Promise<ItemAndParentId> {
  const {
    externalReference,
    cataloguePath,
    language,
    tenantId,
    shapeIdentifier,
    context,
  } = props

  let idAndParent: ItemAndParentId = {}

  if (externalReference) {
    idAndParent = await getItemIdFromExternalReference(
      externalReference,
      language,
      tenantId,
      context.useReferenceCache,
      shapeIdentifier
    )
  }

  if (!idAndParent.itemId && cataloguePath) {
    idAndParent = await getItemIdFromCataloguePath(
      cataloguePath,
      language,
      context.useReferenceCache
    )

    if (!idAndParent.itemId) {
      idAndParent =
        context.itemJSONCataloguePathToIDMap.get(cataloguePath) || {}
    }
  }

  return idAndParent
}

async function getItemIdFromExternalReference(
  externalReference: string,
  language: string,
  tenantId: string,
  useCache: boolean,
  shapeIdentifier?: string
): Promise<ItemAndParentId> {
  if (useCache) {
    const cacheItem = cache.get(`externalReference:${externalReference}`)
    if (cacheItem) {
      return cacheItem
    }
  }

  const response = await callPIM({
    query: `
      query GET_ID_FROM_EXTERNAL_REFERENCE(
        $externalReferences: [String!]
        $language: String!
        $tenantId: ID!
      ) {
        item {
          getMany(externalReferences: $externalReferences, language: $language, tenantId: $tenantId) {
            id
            shape {
              identifier
            }
            tree {
              parentId
            }
          }
        }
      }
    `,
    variables: {
      externalReferences: [externalReference],
      language,
      tenantId,
    },
  })

  let items = response.data?.item?.getMany || []

  if (shapeIdentifier) {
    items = items.filter((s: any) => s.shape.identifier === shapeIdentifier)
  }

  const item = items[0]
  if (!item) {
    return {}
  }
  const idAndParent = {
    itemId: item.id,
    parentId: item.tree?.parentId,
  }

  if (useCache) {
    cache.set(`externalReference:${externalReference}`, idAndParent)
  }

  return idAndParent
}

async function getItemIdFromCataloguePath(
  path: string,
  language: string,
  useCache: boolean
): Promise<ItemAndParentId> {
  if (useCache) {
    const cacheItem = cache.get(`path:${path}`)
    if (cacheItem) {
      return cacheItem
    }
  }

  const response = await callCatalogue({
    query: `
      query GET_ID_FROM_PATH ($path: String, $language: String) {
        catalogue(path: $path, language: $language) {
          id
          parent {
            id
          }
        }
      }
    `,
    variables: {
      path,
      language,
    },
  })

  const item = response.data?.catalogue
  if (!item) {
    return {}
  }
  const idAndParent = {
    itemId: item.id,
    parentId: item.parent?.id,
  }

  if (useCache) {
    cache.set(`path:${path}`, idAndParent)
  }

  return idAndParent
}
