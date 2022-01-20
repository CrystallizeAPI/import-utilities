import { BootstrapperContext } from '.'
import { JSONItemTopic } from '../../json-spec'
import { IcallAPI, IcallAPIResult } from './api'

const cache = new Map()

export function clearCache() {
  cache.clear()
}

export type ApiFN = (props: IcallAPI) => Promise<IcallAPIResult>

export async function getTopicId(props: {
  topic: JSONItemTopic
  language: string
  useCache: boolean
  context: BootstrapperContext
  apiFn?: ApiFN
}): Promise<string | null> {
  const { topic, language, useCache, context, apiFn = context.callPIM } = props
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

  let id: string | null = null

  if (typeof topic !== 'string' && topic.path) {
    const result = await apiFn({
      query: `
          query GET_TOPIC_BY_PATH($tenantId: ID!, $language: String!, $path: String!) {
            topic {
              get(
                language: $language,
                path: {
                  tenantId: $tenantId
                  path: $path
                }
              ) {
                id
              }
            }
          }
      `,
      variables: {
        tenantId: context.tenantId,
        language,
        path: searchTerm,
      },
    })
    id = result?.data?.topic?.get?.id || null
  } else {
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
        tenantId: context.tenantId,
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

    id = edge?.node?.id || null
  }

  if (id) {
    if (useCache) {
      cache.set(searchTerm, id)
    }
  }

  return id
}

export async function getTopicIds({
  topics,
  language,
  useCache = true,
  context,
  apiFn = context.callPIM,
}: {
  topics: JSONItemTopic[]
  language: string
  useCache?: boolean
  context: BootstrapperContext
  apiFn?: ApiFN
}): Promise<string[]> {
  const ids = await Promise.all(
    topics.map((topic) =>
      getTopicId({ topic, language, useCache, context, apiFn })
    )
  )

  return ids.filter(Boolean) as string[]
}
