import { getTenantId } from '.'
import { JSONItemTopic } from '../../json-spec'
import { callPIM, IcallAPI, IcallAPIResult } from './api'

const cache = new Map()

export function clearCache() {
  cache.clear()
}

export type ApiFN = (props: IcallAPI) => Promise<IcallAPIResult>

export async function getTopicId(props: {
  topic: JSONItemTopic
  language: string
  useCache: boolean
  apiFn?: ApiFN
}): Promise<string | null> {
  const { topic, language, useCache, apiFn = callPIM } = props
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

  const result = await apiFn({
    query: `
        query GET_TOPIC($tenantId: ID!, $language: String!, $searchTerm: String!) {
          search {
            topics(tenantId: $tenantId, language: $language, searchTerm: $searchTerm) {
              edges {
                node {
                  id
                  path
                  name
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
  } else if (typeof topic === 'string') {
    edge = edges.find((e: any) => e.node.name === topic)
  } else {
    edge = edges[0]
  }

  if (edge) {
    if (useCache) {
      cache.set(searchTerm, edge.node.id)
    }

    return edge.node.id
  }

  return null
}

export async function getTopicIds({
  topics,
  language,
  useCache = true,
  apiFn = callPIM,
}: {
  topics: JSONItemTopic[]
  language: string
  useCache?: boolean
  apiFn?: ApiFN
}): Promise<string[]> {
  const ids = await Promise.all(
    topics.map((topic) => getTopicId({ topic, language, useCache, apiFn }))
  )

  return ids.filter(Boolean) as string[]
}
