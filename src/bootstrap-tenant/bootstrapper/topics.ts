import { TopicInput } from '../../types'
import { buildCreateTopicMutation } from '../../graphql'

import { JsonSpec, JSONTopic, JSONTranslation } from '../json-spec'
import {
  callPIM,
  getTenantId,
  getTranslation,
  StepStatus,
  TenantContext,
} from './utils'
import { TopicChildInput } from '../../types/topics/topic.child.input'
import { buildUpdateTopicMutation } from '../../graphql/build-update-topic-mutation'

const QUERY_SEARCH_TOPIC = `
  query SEARCH_TOPIC ($tenantId: ID! $language: String!, $searchTerm: String!) {
    search {
      topics (
        tenantId: $tenantId,
        language: $language
        searchTerm: $searchTerm
      ) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`

export async function getAllTopicsForSpec(
  language: string
): Promise<JSONTopic[]> {
  const tenantId = getTenantId()

  const r = await callPIM({
    query: `
      query GET_TENANT_ROOT_TOPICS($tenantId: ID!, $language: String!) {
        topic {
          getRootTopics(tenantId: $tenantId, language: $language) {
            id
            name
            children {
              id
              name
              children {
                id
                name
                children {
                  id
                  name
                  children {
                    id
                    name
                    children {
                      id
                      name
                      children {
                        id
                        name
                        children {
                          id
                          name
                          children {
                            id
                            name
                            children {
                              id
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
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
    ...(topic.parentId && { parentId: topic.parentId }),
    ...(topic.children && {
      children: topic.children.map(translateChild),
    }),
  }
}

function getNLevelTopics(numberOfLevels: number): Record<string, any> {
  const levels: Record<string, any> = {}

  let count = 0
  function addNextLevel(current: Record<string, any>) {
    current.name = true
    current.id = true
    current.parentId = true
    count++
    if (count < numberOfLevels) {
      current.children = {}
      addNextLevel(current.children)
    }
  }
  addNextLevel(levels)

  return levels
}

async function createTopic(
  topic: JSONTopic,
  context: TenantContext,
  parentId?: string
) {
  const language = context.defaultLanguage.code

  const translatedTopic = translateTopicForInput(topic, language)
  if (parentId) {
    translatedTopic.parentId = parentId
  }

  // Create the topic (including children)
  const response = await callPIM({
    query: buildCreateTopicMutation(
      translatedTopic,
      language,
      getNLevelTopics(20)
    ),
  })

  const createdTopic = response.data?.topic?.create

  // Get the languages to set topic for
  const remainingLanguages = context.languages
    .filter((l) => !l.isDefault)
    .map((l) => l.code)

  const topicsToUpdate: Promise<any>[] = []
  remainingLanguages.forEach((language) => {
    function handleLevel(level: JSONTopic, levelFromSpec?: JSONTopic) {
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

      if (level.children && levelFromSpec.children) {
        for (let i = 0; i < level.children.length; i++) {
          handleLevel(
            level.children[i],
            levelFromSpec.children.find(
              (l) => level.name === getTranslation(l.name, language)
            )
          )
        }
      }
    }

    handleLevel(createdTopic, topic)
  })

  await Promise.all(topicsToUpdate)

  return createdTopic
}

function updateTopic(topic: JSONTopic, context: TenantContext) {
  async function handleLevel(level: JSONTopic, parentId?: string) {
    try {
      const existingTopicResponse = await callPIM({
        query: QUERY_SEARCH_TOPIC,
        variables: {
          tenantId: getTenantId(),
          language: context.defaultLanguage.code,
          searchTerm: level.hierarchyPath,
        },
      })

      const topicsFromSearch =
        existingTopicResponse?.data?.search?.topics?.edges || []

      // Search has references to old topics. Remove this when it's resolved
      const topicFromSearch = topicsFromSearch[topicsFromSearch.length - 1]

      // Can't find this topic, let's create it
      if (!topicFromSearch) {
        await createTopic(level, context, parentId)
      } else if (level.children) {
        level.id = topicFromSearch.node?.id
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

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
  context: TenantContext
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
  spec.topicMaps.forEach((topicMap) => {
    function handleTopic(topic: JSONTopic, currentHierarchy: string[]) {
      const hierarchy = [
        ...currentHierarchy,
        getTranslation(topic.name, context.defaultLanguage.code) || '',
      ]
      topic.hierarchyPath = hierarchy.join('/')
      topic.parentHierarchyPath = currentHierarchy.join('/')
      topic.children?.forEach((c) => handleTopic(c, hierarchy))
    }
    handleTopic(topicMap, [])
  })

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

  if (missingTopicMaps.length > 0) {
    onUpdate({
      done: false,
      message: `Creating new topic map(s) ${missingTopicMaps
        .map((t) => getTranslation(t.name, context.defaultLanguage.code))
        .join(',')}`,
    })
  } else {
    onUpdate({
      done: false,
      message: `No new topic maps found`,
    })
  }

  // Create root topics for the missing ones
  for (let i = 0; i < missingTopicMaps.length; i++) {
    onUpdate({
      done: false,
      message: `Creating topic map ${getTranslation(
        missingTopicMaps[i].name,
        context.defaultLanguage.code
      )}...`,
    })
    await createTopic(missingTopicMaps[i], context)
  }

  // Add new topics for the existing topic maps
  for (let i = 0; i < existingTopicMaps.length; i++) {
    onUpdate({
      done: false,
      message: `Updating topic map ${getTranslation(
        existingTopicMaps[i].name,
        context.defaultLanguage.code
      )}...`,
    })
    await updateTopic(existingTopicMaps[i], context)
  }
}
