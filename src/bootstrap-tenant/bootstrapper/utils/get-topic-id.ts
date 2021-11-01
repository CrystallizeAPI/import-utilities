import { getTenantId } from '.'
import { JSONItemTopic } from '../../json-spec'
import { callPIM } from './api'

const cache = new Map()

export async function getTopicIds(
  topics: JSONItemTopic[],
  language: string,
  useCache: boolean = true
): Promise<string[]> {
  const ids: string[] = []

  await Promise.all(
    topics.map(async (topic) => {
      let searchTerm: string | undefined = ''

      if (typeof topic === 'string') {
        searchTerm = topic
      } else {
        searchTerm = topic.path || topic.hierarchy
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
        ids.push(edge.node.id as string)

        if (useCache) {
          cache.set(searchTerm, edge.node.id)
        }
      }
    })
  )

  return ids
}
