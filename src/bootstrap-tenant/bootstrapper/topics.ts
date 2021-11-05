import { TopicInput } from '../../types'
import { buildCreateTopicMutation } from '../../graphql'

import { JsonSpec, JSONTopic } from '../json-spec'
import {
  callPIM,
  getTenantId,
  getTranslation,
  AreaUpdate,
  BootstrapperContext,
} from './utils'
import { TopicChildInput } from '../../types/topics/topic.child.input'
import { buildUpdateTopicMutation } from '../../graphql/build-update-topic-mutation'

export function removeTopicId(topic: JSONTopic): JSONTopic {
  const { id, children, ...rest } = topic
  return {
    ...rest,
    ...(children && { children: children.map(removeTopicId) }),
  }
}

export async function getAllTopicsForSpec(
  language: string
): Promise<JSONTopic[]> {
  const tenantId = getTenantId()

  async function getTopicBasics(
    id: string
  ): Promise<{
    id: string
    name: string
    path: string
    children: {
      id: string
    }[]
  } | null> {
    const response = await callPIM({
      query: `
        query GET_TOPIC($id: ID!, $language: String!) {
          topic {
            get(id: $id, language: $language) {
              id
              name
              path
              children {
                id
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

    return response.data?.topic?.get
  }

  async function handleTopic(id: string): Promise<JSONTopic | null> {
    const topicBasics = await getTopicBasics(id)

    if (!topicBasics) {
      return topicBasics
    }

    const topic: JSONTopic = {
      id: topicBasics.id,
      name: topicBasics.name,
      path: topicBasics.path,
    }

    if (topicBasics?.children?.length > 0) {
      topic.children = []

      for (let i = 0; i < topicBasics.children.length; i++) {
        const childTopic = await handleTopic(topicBasics.children[i].id)
        if (childTopic) {
          topic.children.push(childTopic)
        }
      }
    }

    return topic
  }

  const responseForRootTopics = await callPIM({
    query: `
      query GET_TENANT_ROOT_TOPICS($tenantId: ID!, $language: String!) {
        topic {
          getRootTopics(tenantId: $tenantId, language: $language) {
            id
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

  const rootTopicIds: string[] =
    responseForRootTopics.data?.topic?.getRootTopics?.map((r: any) => r.id) ||
    []

  for (let i = 0; i < rootTopicIds.length; i++) {
    const topic = await handleTopic(rootTopicIds[i])
    if (topic) {
      topicMaps.push(topic)
    }
  }

  return topicMaps
}

async function getExistingRootTopics(language: string): Promise<JSONTopic[]> {
  const tenantId = getTenantId()

  const r = await callPIM({
    query: `
      query GET_TENANT_ROOT_TOPICS($tenantId: ID!, $language: String!) {
        topic {
          getRootTopics(tenantId: $tenantId, language: $language) {
            id
            name
          }
        }
      }    
    `,
    variables: {
      tenantId,
      language,
    },
  })

  return r.data?.topic?.getRootTopics || []
}

function translateTopicForInput(
  topic: JSONTopic,
  language: string
): TopicInput {
  const tenantId = getTenantId()
  function translateChild(t: JSONTopic): TopicChildInput {
    return {
      name: getTranslation(t.name, language) || '',
      ...(t.children && { children: t.children.map(translateChild) }),
    }
  }

  return {
    tenantId,
    name: getTranslation(topic.name, language) || '',
    ...(topic.path && { pathIdentifier: topic.path }),
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

  const translatedTopic = translateTopicForInput(topicWithoutChildren, language)
  if (parentId) {
    translatedTopic.parentId = parentId
  }

  // Create the topic
  const response = await callPIM({
    query: buildCreateTopicMutation(translatedTopic, language, {
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
        callPIM({
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

function createTopicAndChildren(
  topic: JSONTopic,
  context: BootstrapperContext,
  parentId?: string
) {
  async function handleLevel(levelTopic: JSONTopic, parentId?: string) {
    const id = await createTopic(levelTopic, context, parentId)

    if (levelTopic.children) {
      const childNames = new Set()
      for (let i = 0; i < levelTopic.children.length; i++) {
        const child = levelTopic.children[i]
        console.log('child', child)
        if (!childNames.has(child.name)) {
          await handleLevel(child, id)
          childNames.add(child.name)
        }
      }
    }

    return id
  }

  return handleLevel(topic, parentId)
}

function updateTopic(
  topic: JSONTopic,
  context: BootstrapperContext,
  allTopics: JSONTopic[]
) {
  function findExistingTopic(props: {
    path?: string
    hierarchyPath?: string
  }): JSONTopic | null {
    const { hierarchyPath, path } = props

    let existing = null

    function handleTopic(topic: JSONTopic) {
      if (topic.path === path || topic.hierarchyPath === hierarchyPath) {
        existing = topic
      } else {
        topic.children?.forEach(handleTopic)
      }
    }

    if (hierarchyPath && allTopics) {
      allTopics.forEach(handleTopic)
    }

    return existing
  }

  async function handleLevel(level: JSONTopic, parentId?: string) {
    try {
      const existingTopic = findExistingTopic({
        path: level.path,
        hierarchyPath: level.hierarchyPath,
      })

      level.id = existingTopic?.id

      // Can't find this topic, let's create it
      if (!existingTopic) {
        level.id = await createTopic(level, context, parentId)
      } else {
        // Update topic name
        await callPIM({
          query: `
          mutation UPDATE_TOPIC_NAME($id: ID!, $name: String!, $language: String!) {
            topic {
              update (
                id: $id
                language: $language
                input: {
                  name: $name
                }
              ) {
                id
              }
            }
          }
          `,
          variables: {
            id: existingTopic.id,
            language: context.defaultLanguage.code,
            name: level.name,
          },
        })
      }

      if (level.children) {
        for (let i = 0; i < level.children.length; i++) {
          await handleLevel(level.children[i], level.id)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return handleLevel(topic)
}

function enrichWithHierarchyPath(topicMaps: JSONTopic[], language: string) {
  topicMaps.forEach((topicMap) => {
    function handleTopic(topic: JSONTopic, currentHierarchy: string[]) {
      const hierarchy = [
        ...currentHierarchy,
        getTranslation(topic.name, language) || '',
      ]
      topic.hierarchyPath = hierarchy.join('/')
      topic.children?.forEach((c) => handleTopic(c, hierarchy))
    }
    handleTopic(topicMap, [])
  })
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
  // Enrich the spec with hierachy paths
  enrichWithHierarchyPath(spec.topicMaps, context.defaultLanguage.code)

  const existingRootTopics = await getExistingRootTopics(
    context.defaultLanguage.code
  )
  const existingTopicMaps: JSONTopic[] = []
  const missingTopicMaps: JSONTopic[] = []

  spec?.topicMaps.forEach((topicMap) => {
    const translatedName = getTranslation(
      topicMap.name,
      context.defaultLanguage.code
    )
    if (existingRootTopics.some((t) => t.name === translatedName)) {
      existingTopicMaps.push(topicMap)
    } else {
      missingTopicMaps.push(topicMap)
    }
  })

  let finished = 0

  // Create root topics for the missing ones
  if (missingTopicMaps.length > 0) {
    onUpdate({
      message: `Creating new topic map(s) ${missingTopicMaps
        .map((t) => getTranslation(t.name, context.defaultLanguage.code))
        .join(',')}`,
    })

    for (let i = 0; i < missingTopicMaps.length; i++) {
      await createTopicAndChildren(missingTopicMaps[i], context)
      finished++
      onUpdate({
        progress: finished / spec.topicMaps.length,
        message: `Created topic map ${getTranslation(
          missingTopicMaps[i].name,
          context.defaultLanguage.code
        )}...`,
      })
    }
  } else {
    onUpdate({
      message: `No new topic maps found`,
    })
  }

  // Get all topics
  const allTopics = await getAllTopicsForSpec(context.defaultLanguage.code)
  enrichWithHierarchyPath(allTopics, context.defaultLanguage.code)

  // Add new topics for the existing topic maps
  for (let i = 0; i < existingTopicMaps.length; i++) {
    await updateTopic(existingTopicMaps[i], context, allTopics)
    finished++
    onUpdate({
      progress: finished / spec.topicMaps.length,
      message: `Updated topic map ${getTranslation(
        existingTopicMaps[i].name,
        context.defaultLanguage.code
      )}...`,
    })
  }

  onUpdate({
    progress: 1,
  })
}
