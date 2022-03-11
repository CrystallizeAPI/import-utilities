import { TopicInput } from '../../types'
import { buildCreateTopicMutation } from '../../graphql'

import { JsonSpec, JSONTopic } from '../json-spec'
import { getTranslation, AreaUpdate, BootstrapperContext, sleep } from './utils'
import { TopicChildInput } from '../../types/topics/topic.child.input'
import { buildUpdateTopicMutation } from '../../graphql/build-update-topic-mutation'
import { getTopicId } from './utils/get-topic-id'
import gql from 'graphql-tag'

export { getAllTopicsForSpec } from './utils/get-all-topics'

export function removeTopicId(topic: JSONTopic): JSONTopic {
  const { id, children, ...rest } = topic
  return {
    ...rest,
    ...(children && { children: children.map(removeTopicId) }),
  }
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
    pathIdentifier = getTranslation(topic.pathIdentifier, language)
  } else if (topic.path) {
    const parts = getTranslation(topic.path).split('/')
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
    const translatedPath = getTranslation(topic.path, language)
    if (translatedPath) {
      const pathParts = getTranslation(topic.path, language).split('/')
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

  const languages = context.config.multilingual
    ? context.languages.map((l) => l.code)
    : [context.defaultLanguage.code]

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
        topic: level.path
          ? { path: getTranslation(level.path, language) }
          : level.name,
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
      }

      // Keep track of the topics being updated
      const topicsToUpdate: Promise<any>[] = []

      function updateTopic(language: string, level: JSONTopic) {
        if (level.id) {
          topicsToUpdate.push(
            context.callPIM({
              query: buildUpdateTopicMutation({
                id: level.id,
                language,
                input: {
                  name: getTranslation(level.name, language) || '',
                  ...(level.pathIdentifier && {
                    pathIdentifier: getTranslation(
                      level.pathIdentifier,
                      language
                    ),
                  }),
                  ...(level.parentId && { parentId: level.parentId }),
                },
              }),
            })
          )
        }
      }

      languages.forEach((language) => updateTopic(language, level))

      await Promise.all(topicsToUpdate)

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
