import { TopicInput } from '../../types'
import { buildCreateTopicMutation } from '../../graphql'

import { JsonSpec, Topic } from '../json-spec'
import {
  callPIM,
  getTenantId,
  getTranslation,
  sleep,
  StepStatus,
  TenantContext,
} from './utils'
import { TopicChildInput } from '../../types/topics/topic.child.input'

async function getExistingRootTopics(language: string): Promise<Topic[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_ROOT_TOPICS($tenantId: ID!) {
        topic {
          getRootTopics(id: $tenantId, language: $language) {
            id
            name
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.topic?.getRootTopics || []
}

function translateTopicMapForInput(
  topicMap: Topic,
  language: string
): TopicInput {
  const tenantId = getTenantId()
  function translateChild(t: Topic): TopicChildInput {
    return {
      name: getTranslation(t.name, language) || '',
      ...(t.children && { children: t.children.map(translateChild) }),
    }
  }

  return {
    tenantId,
    name: getTranslation(topicMap.name, language) || '',
    ...(topicMap.children && {
      children: topicMap.children.map(translateChild),
    }),
  }
}

async function createTopicMap(topicMap: Topic, context: TenantContext) {
  const language = context.defaultLanguage.code

  const translatedTopicMap = translateTopicMapForInput(topicMap, language)

  // Create the initial map
  const response = await callPIM({
    query: buildCreateTopicMutation(translatedTopicMap, language),
  })

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 1))
  }

  // Set translations for each node
  console.log('todo: create translations for the rest')
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

  const existingRootTopics = await getExistingRootTopics(
    context.defaultLanguage.code
  )

  const missingTopicMaps = spec?.topicMaps.filter((topicMap) => {
    const translatedName = getTranslation(
      topicMap.name,
      context.defaultLanguage.code
    )
    return !existingRootTopics.some((t) => t.name === translatedName)
  })

  // Create root topics for the missing ones
  if (missingTopicMaps.length > 0) {
    for (let i = 0; i < missingTopicMaps.length; i++) {
      await createTopicMap(missingTopicMaps[i], context)
    }
  }
}
