import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ItemType, UpdateItemInput } from '../types'

export const buildUpdateItemMutation = (
  id: string,
  input: UpdateItemInput,
  type: ItemType,
  language: string
): string => {
  const mutation: any = {
    mutation: {},
  }

  let components: undefined | any[] = undefined
  if (input.components) {
    components = Object.keys(input.components).map((componentId: string) => ({
      ...input.components?.[componentId],
      componentId,
    }))
  }

  mutation.mutation[type] = {
    update: {
      __args: {
        id,
        input: {
          ...input,
          ...(components && { components }),
        },
        language,
      },
      id: true,
      name: true,
    },
  }

  return jsonToGraphQLQuery(mutation)
}

export function buildUpdateItemQueryAndVariables(
  id: string,
  input: UpdateItemInput,
  type: ItemType,
  language: string
): { query: DocumentNode; variables: Record<string, any> } {
  let inputType:
    | 'UpdateDocumentInput'
    | 'UpdateFolderInput'
    | 'UpdateProductInput'
  let topFieldName: 'document' | 'folder' | 'product'

  switch (type) {
    case ItemType.Document: {
      inputType = 'UpdateDocumentInput'
      topFieldName = 'document'
      break
    }
    case ItemType.Folder: {
      inputType = 'UpdateFolderInput'
      topFieldName = 'folder'
      break
    }
    case ItemType.Product: {
      inputType = 'UpdateProductInput'
      topFieldName = 'product'
      break
    }
    default: {
      throw new Error(`Update item failed. Type "${type}" is not supported`)
    }
  }

  const variables = {
    id,
    language,
    input: {
      ...input,
    } as Record<string, any>,
  }

  if (input.components) {
    const components = input.components as Record<string, any>
    variables.input.components = Object.keys(components).map(
      (componentId: string) => ({
        componentId,
        ...components[componentId],
      })
    )
  }

  return {
    query: gql`
      mutation UPDATE_ITEM ($id: ID!, $language: String!, $input: ${inputType}!) {
        ${topFieldName} {
          update (id: $id, language: $language, input: $input) {
            id
          }
        }
      }
    `,
    variables,
  }
}
