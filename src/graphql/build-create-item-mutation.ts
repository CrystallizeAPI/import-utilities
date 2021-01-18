import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { DocumentInput } from '../types/document/document.input'
import { FolderInput } from '../types/folder/folder.input'
import { ProductInput } from '../types/product/product.input'

export const buildCreateItemMutation = (
  input: ProductInput | DocumentInput | FolderInput,
  type: 'product' | 'document' | 'folder',
  language: string
): string => {
  const mutation: any = {
    mutation: {},
  }
  mutation.mutation[type] = {
    create: {
      __args: {
        input,
        language,
      },
      id: true,
      name: true,
    },
  }

  return jsonToGraphQLQuery(mutation)
}
