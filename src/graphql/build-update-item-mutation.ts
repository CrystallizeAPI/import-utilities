import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { DocumentInput } from '../types/document/document.input'
import { FolderInput } from '../types/folder/folder.input'
import { ProductInput } from '../types/product/product.input'

export const buildUpdateItemMutation = (
  id: string,
  input: ProductInput | DocumentInput | FolderInput,
  type: 'product' | 'document' | 'folder',
  language: string
): string => {
  const mutation: any = {
    mutation: {},
  }

  const components = input.components || {}
  delete input.shapeId

  mutation.mutation[type] = {
    update: {
      __args: {
        id,
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
