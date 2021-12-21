import { TopicInput } from '../../types'
import { buildCreateTopicMutation } from '../../graphql'

import { JsonSpec, JSONTopic } from '../json-spec'
import { getTranslation, AreaUpdate, BootstrapperContext, sleep } from './utils'
import { TopicChildInput } from '../../types/topics/topic.child.input'
import { buildUpdateTopicMutation } from '../../graphql/build-update-topic-mutation'
import { getTopicId } from './utils/get-topic-id'

export function removeTopicId(topic: JSONTopic): JSONTopic {
  const { id, children, ...rest } = topic
  return {
    ...rest,
    ...(children && { children: children.map(removeTopicId) }),
  }
}

export async function getAllTopicsForSpec(
  language: string,
  context: BootstrapperContext
): Promise<JSONTopic[]> {
  const tenantId = context.tenantId

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
      query: `
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
    query: `
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

function prepareTopicForInput(
  topic: JSONTopic,
  language: string,
  context: BootstrapperContext
): TopicInput {
  const tenantId = context.tenantId
  function translateChild(t: JSONTopic): TopicChildInput {
    return {
      name: getTranslation(t.name, language) || '',
      ...(t.children && { children: t.children.map(translateChild) }),
    }
  }

  let pathIdentifier
  if (topic.pathIdentifier) {
    pathIdentifier = topic.pathIdentifier
  } else if (topic.path) {
    const parts = topic.path.split('/')
    pathIdentifier = parts[parts.length - 1]
  }

  return {
    tenantId,
    name: getTranslation(topic.name, language) || '',
    ...(pathIdentifier && { pathIdentifier }),
    ...(topic.parentId && { parentId: topic.parentId }),
    ...(topic.children && {
      children: topic.children.map(translateChild),
    }),
  }
}

async function createTopic(
  topic: JSONTopic,
  context: BootstrapperContext,
  parentId?: string
): Promise<string> {
  const language = context.defaultLanguage.code

  /**
   * Do not include children here, as we have no control over
   * how many children and levels that are passed. The API might
   * throw a 413 "request entity too large" if we send to much
   */
  const { children, ...topicWithoutChildren } = topic

  const preparedTopic = prepareTopicForInput(
    topicWithoutChildren,
    language,
    context
  )
  if (parentId) {
    preparedTopic.parentId = parentId
  } else if (topic.path) {
    // Check if there is a parent with first part of path
    const pathParts = topic.path.split('/')
    pathParts.pop()
    const parentPath = pathParts.join('/')

    const id = await getTopicId({
      topic: {
        path: parentPath,
      },
      language: context.defaultLanguage.code,
      context,
      useCache: false,
    })
    if (id) {
      preparedTopic.parentId = id
    }
  }

  // Create the topic
  const response = await context.callPIM({
    query: buildCreateTopicMutation(preparedTopic, language, {
      name: true,
      id: true,
      parentId: true,
    }),
  })

  const createdTopic = response.data?.topic?.create

  // Get the languages to set topic for
  const remainingLanguages = context.languages
    .filter((l) => !l.isDefault)
    .map((l) => l.code)

  // Keep track of the topics being updated
  const topicsToUpdate: Promise<any>[] = []

  function updateTopic(
    language: string,
    level: JSONTopic,
    levelFromSpec?: JSONTopic
  ) {
    if (!levelFromSpec) {
      return
    }

    if (level.id) {
      topicsToUpdate.push(
        context.callPIM({
          query: buildUpdateTopicMutation({
            id: level.id,
            language,
            input: {
              name: getTranslation(levelFromSpec.name, language) || '',
              parentId: level.parentId,
            },
          }),
        })
      )
    }
  }

  remainingLanguages.forEach((language) =>
    updateTopic(language, createdTopic, topicWithoutChildren)
  )

  await Promise.all(topicsToUpdate)

  return createdTopic.id
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

export async function setTopics({
  spec,
  onUpdate,
  context,
}: Props): Promise<void> {
  if (!spec?.topicMaps) {
    return
  }

  let finished = 0
  let totalTopics = 0
  function count(topic: JSONTopic) {
    totalTopics++
    if (topic.children) {
      topic.children.forEach(count)
    }
  }
  spec.topicMaps.forEach(count)

  async function handleLevel(level: JSONTopic, parentId?: string) {
    try {
      const language = context.defaultLanguage.code

      const existingTopicId = await getTopicId({
        topic: level.path ? { path: level.path } : level.name,
        language,
        context,
        useCache: false,
      })

      if (existingTopicId) {
        level.id = existingTopicId
      }

      // Can't find this topic, let's create it
      if (!existingTopicId) {
        level.id = await createTopic(level, context, parentId)
      } else {
        const preparedTopic = prepareTopicForInput(
          level,
          context.defaultLanguage.code,
          context
        )

        // Update topic
        await context.callPIM({
          query: `
            mutation UPDATE_TOPIC_NAME($id: ID!, $language: String!, $input: UpdateTopicInput!) {
              topic {
                update (
                  id: $id
                  language: $language
                  input: $input
                ) {
                  id
                }
              }
            }
            `,
          variables: {
            id: existingTopicId,
            language: context.defaultLanguage.code,
            input: {
              name: preparedTopic.name,
              ...(preparedTopic.pathIdentifier && {
                pathIdentifier: preparedTopic.pathIdentifier,
              }),
            },
          },
        })
      }

      finished++
      onUpdate({
        progress: finished / totalTopics,
        message: `${getTranslation(
          level.name,
          context.defaultLanguage.code
        )}: ${existingTopicId ? 'updated' : 'created'}`,
      })

      if (level.children) {
        const childNames = new Set()
        for (let i = 0; i < level.children.length; i++) {
          const child = level.children[i]

          if (!childNames.has(child.name)) {
            await handleLevel(child, level.id)
            childNames.add(child.name)
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  for (let i = 0; i < spec.topicMaps.length; i++) {
    await handleLevel(spec.topicMaps[i])
  }

  onUpdate({
    progress: 1,
  })
}
