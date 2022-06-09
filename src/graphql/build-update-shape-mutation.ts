import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ComponentType } from '../generated/graphql'
import {
  ComponentChoiceComponentConfigInput,
  ComponentInput,
  componentTypes,
  ContentChunkComponentConfigInput,
  ShapeUpdateInput,
} from '../types'

export const buildUpdateShapeMutation = (input: ShapeUpdateInput): string => {
  const mutation = {
    mutation: {
      shape: {
        update: {
          __args: input,
          identifier: true,
          name: true,
        },
      },
    },
  }

  return jsonToGraphQLQuery(mutation)
}

export const buildUpdateShapeQueryAndVariables = (
  update: ShapeUpdateInput
): {
  query: DocumentNode
  variables: Record<string, any>
} => {
  const query = gql`
    mutation UPDATE_SHAPE(
      $tenantId: ID!
      $identifier: String!
      $input: UpdateShapeInput!
    ) {
      shape {
        update(tenantId: $tenantId, identifier: $identifier, input: $input) {
          identifier
          name
        }
      }
    }
  `

  const variables = {
    identifier: update.identifier,
    input: {
      ...update.input,
      components:
        update.input.components?.map((cmp: ComponentInput) => {
          const baseComponent = {
            ...cmp,
            type: cmp.type.value,
          }
          if (cmp.type === componentTypes.contentChunk) {
            const config =
              baseComponent.config as ContentChunkComponentConfigInput
            return {
              ...baseComponent,
              config: config
                ? {
                    componentChoice: {
                      ...config?.contentChunk,
                      choices: config?.contentChunk?.components.map(
                        (cmp: ComponentInput) => ({
                          ...cmp,
                          type: cmp.type.value,
                        })
                      ),
                    },
                  }
                : {},
            }
          } else if (cmp.type === componentTypes.componentChoice) {
            const config =
              baseComponent.config as ComponentChoiceComponentConfigInput
            return {
              ...baseComponent,
              config: config
                ? {
                    componentChoice: {
                      ...config?.componentChoice,
                      choices: config?.componentChoice?.choices.map(
                        (cmp: ComponentInput) => ({
                          ...cmp,
                          type: cmp.type.value,
                        })
                      ),
                    },
                  }
                : {},
            }
          }

          return baseComponent
        }) || [],
    },
    tenantId: update.tenantId,
  }

  console.log('VARIABLES', JSON.stringify(variables, null, 2))

  return {
    query,
    variables,
  }
}
