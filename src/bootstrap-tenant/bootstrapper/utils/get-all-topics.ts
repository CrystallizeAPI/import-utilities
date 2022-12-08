import gql from 'graphql-tag'
import { BootstrapperContext, removeUnwantedFieldsFromThing } from '.'
import { JSONTopic } from '../../json-spec'
import {
  mergeInTranslations,
  translationFieldIdentifier,
  trFactory,
} from './multilingual'

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
    const tr = trFactory(language)

    async function getTopicChildren(id: string): Promise<
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

      const children = response.data?.topic?.get?.children || []

      return children
    }

    async function handleTopic({
      id,
      name,
      path,
    }: {
      id: string
      name: string
      path: string
    }): Promise<JSONTopic> {
      const topic: JSONTopic = {
        id,
        name: tr(name, `${id}.name`),
        path: tr(path, `${id}.path`),
      }

      const pathParts = path.split('/')
      topic.pathIdentifier = tr(
        pathParts[pathParts.length - 1],
        `${id}.pathIdentifier`
      )

      const children = await getTopicChildren(id)

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

  function handleTopic(topic: JSONTopic) {
    const existingTopic = getTopicById(topicMaps, topic.id as string)
    if (!existingTopic) {
      console.log('Could not find existing topic by id. Strange.', topic)
    } else {
      mergeInTranslations(existingTopic, topic)
      topic.children?.forEach(handleTopic)
    }
  }

  for (let i = 0; i < languages.length; i++) {
    const language = languages[i]
    const topicsForLanguage = await handleLanguage(language)

    if (topicMaps.length === 0) {
      topicMaps.push(...topicsForLanguage)
    } else {
      topicsForLanguage.forEach(handleTopic)
    }
  }

  return removeUnwantedFieldsFromThing(topicMaps, [
    'id',
    translationFieldIdentifier,
  ])
}
