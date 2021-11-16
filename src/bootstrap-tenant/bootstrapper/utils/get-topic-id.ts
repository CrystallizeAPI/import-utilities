import { getTenantId } from '.'
import { JSONItemTopic } from '../../json-spec'
import { callPIM } from './api'

const cache = new Map()

export function clearCache() {
  cache.clear()
}

export async function getTopicId(
  topic: JSONItemTopic,
  language: string,
  useCache: boolean
): Promise<string | null> {
  let searchTerm: string | undefined = ''

  if (typeof topic === 'string') {
    searchTerm = topic
  } else {
    searchTerm = topic.path || topic.hierarchy
  }

  if (!searchTerm) {
    return null
  }

  if (useCache) {
    const cacheItem = cache.get(searchTerm)
    if (cacheItem) {
      return cacheItem
    }
  }

  const result = await callPIM({
    query: `
        query GET_TOPIC($tenantId: ID!, $language: String!, $searchTerm: String!) {
          search {
            topics(tenantId: $tenantId, language: $language, searchTerm: $searchTerm) {
              edges {
                node {
                  id
                  path
                }
              }
            }
          }
        }
    `,
    variables: {
      tenantId: getTenantId(),
      language,
      searchTerm,
    },
  })

  const edges = result?.data?.search?.topics?.edges || []

  let edge
  if (typeof topic !== 'string' && topic.path) {
    edge = edges.find((e: any) => e.node.path === topic.path)
  } else {
    edge = edges[edges.length - 1]
  }

  if (edge) {
    if (useCache) {
      cache.set(searchTerm, edge.node.id)
    }

    return edge.node.id
  }

  return null
}

export async function getTopicIds(
  topics: JSONItemTopic[],
  language: string,
  useCache: boolean = true
): Promise<string[]> {
  const ids = await Promise.all(
    topics.map((topic) => getTopicId(topic, language, useCache))
  )

  return ids.filter(Boolean) as string[]
}
