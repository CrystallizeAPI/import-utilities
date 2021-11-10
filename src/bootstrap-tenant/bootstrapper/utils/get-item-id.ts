import { callCatalogue, callPIM } from './api'

const cache = new Map()

export function clearCache() {
  cache.clear()
}

export async function getItemIdFromExternalReference(
  externalReference: string,
  language: string,
  tenantId: string,
  useCache: boolean,
  shapeIdentifier?: string
): Promise<string> {
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

  const id = items[0]?.id || ''

  if (useCache) {
    cache.set(`externalReference:${externalReference}`, id)
  }

  return id
}

export async function getItemIdFromCataloguePath(
  path: string,
  language: string,
  useCache: boolean
): Promise<string> {
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
        }
      }
    `,
    variables: {
      path,
      language,
    },
  })

  const id = response.data?.catalogue?.id || ''

  if (useCache) {
    cache.set(`path:${path}`, id)
  }

  return id
}
