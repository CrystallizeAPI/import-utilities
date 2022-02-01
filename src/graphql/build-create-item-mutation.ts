import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { CreateItemInput, ItemType } from '../types'

export const buildCreateItemMutation = (
  input: CreateItemInput,
  type: ItemType,
  language: string
): string => {
  const mutation: any = {
    mutation: {},
  }

  const components = input.components || {}

  mutation.mutation[type] = {
    create: {
      __args: {
        input: {
          ...input,
          components: Object.keys(components).map((componentId: string) => ({
            ...components[componentId],
            componentId,
          })),
        },
        language,
      },
      id: true,
      name: true,
    },
  }

  return jsonToGraphQLQuery(mutation)
}

export function buildCreateItemQueryAndVariables(
  input: CreateItemInput,
  type: ItemType,
  language: string
): { query: DocumentNode; variables: Record<string, any> } {
  let inputType:
    | 'CreateDocumentInput'
    | 'CreateFolderInput'
    | 'CreateProductInput'
  let topFieldName: 'document' | 'folder' | 'product'

  switch (type) {
    case ItemType.Document: {
      inputType = 'CreateDocumentInput'
      topFieldName = 'document'
      break
    }
    case ItemType.Folder: {
      inputType = 'CreateFolderInput'
      topFieldName = 'folder'
      break
    }
    case ItemType.Product: {
      inputType = 'CreateProductInput'
      topFieldName = 'product'
      break
    }
    default: {
      throw new Error(`Create item failed. Type "${type}" is not supported`)
    }
  }

  const components = input.components || {}
  let variables = {
    language,
    input: {
      ...input,
      components: Object.keys(components).map((componentId: string) => ({
        ...components[componentId],
        componentId,
      })),
    },
  }

  return {
    query: gql`
      mutation CREATE_ITEM ($language: String!, $input: ${inputType}!) {
        ${topFieldName} {
          create (language: $language, input: $input) {
            id
          }
        }
      }
    `,
    variables,
  }
}
