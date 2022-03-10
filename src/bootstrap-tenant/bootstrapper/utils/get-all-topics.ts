import gql from 'graphql-tag'
import { BootstrapperContext } from '.'
import { JSONTopic } from '../../json-spec'

function getTopicById(topics: JSONTopic[], id: string): JSONTopic | null {
  let found: JSONTopic | null = null

  function search(item: JSONTopic) {
    if (!found) {
      if (item.id === id) {
        found = item
      } else {
        item.children?.forEach(search)
      }
    }
  }

  topics.forEach(search)

  return found
}

export async function getAllTopicsForSpec(
  lng: string,
  context: BootstrapperContext
): Promise<JSONTopic[]> {
  const tenantId = context.tenantId

  const languages = context.config.multilingual
    ? context.languages.map((l) => l.code)
    : [lng]

  async function handleLanguage(language: string) {
    function tr(val: any) {
      return { [language]: val }
    }

    async function getTopicChildren(
      id: string
    ): Promise<
      {
        id: string
        name: string
        path: string
      }[]
    > {
      const response = await context.callPIM({
        query: gql`
          query GET_TOPIC($id: ID!, $language: String!) {
            topic {
              get(id: $id, language: $language) {
                children {
                  id
                  name
                  path
                }
              }
            }
          }
        `,
        variables: {
          id,
          language,
        },
      })

      return response.data?.topic?.get?.children || []
    }

    async function handleTopic(props: {
      id: string
      name: string
      path: string
    }): Promise<JSONTopic> {
      const topic: JSONTopic = props
      topic.name = tr(topic.name)

      const children = await getTopicChildren(props.id)

      if (children?.length > 0) {
        const childrenWithChildren: JSONTopic[] = []
        await Promise.all(
          children.map(async (child) => {
            const childTopic = await handleTopic(child)
            childrenWithChildren.push(childTopic)
          })
        )

        topic.children = childrenWithChildren
      }

      return topic
    }

    const responseForRootTopics = await context.callPIM({
      query: gql`
        query GET_TENANT_ROOT_TOPICS($tenantId: ID!, $language: String!) {
          topic {
            getRootTopics(tenantId: $tenantId, language: $language) {
              id
              name
              path
            }
          }
        }
      `,
      variables: {
        tenantId,
        language,
      },
    })

    const topicMaps: JSONTopic[] = []

    const rootTopics: {
      id: string
      name: string
      path: string
    }[] = responseForRootTopics.data?.topic?.getRootTopics || []

    await Promise.all(
      rootTopics.map(async (rootTopic) => {
        const topic = await handleTopic(rootTopic)
        if (topic) {
          topicMaps.push(topic)
        }
      })
    )
    return topicMaps
  }

  const topicMaps: JSONTopic[] = []

  for (let i = 0; i < languages.length; i++) {
    const language = languages[i]
    const topicsForLanguage = await handleLanguage(language)

    function handleTopic(topic: JSONTopic) {
      const existingTopic = getTopicById(topicMaps, topic.id as string)
      if (!existingTopic) {
        console.log('Could not find existing topic by id. Strange.', topic)
      } else {
        Object.assign(existingTopic.name, topic.name)
        topic.children?.forEach(handleTopic)
      }
    }

    if (topicMaps.length === 0) {
      topicMaps.push(...topicsForLanguage)
    } else {
      topicsForLanguage.forEach(handleTopic)
    }
  }

  return topicMaps
}
