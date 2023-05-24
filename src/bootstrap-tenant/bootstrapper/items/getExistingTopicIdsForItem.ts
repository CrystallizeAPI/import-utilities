import gql from 'graphql-tag'
import { BootstrapperContext } from '../utils'

export async function getExistingTopicIdsForItem(
  itemId: string,
  language: string,
  context: BootstrapperContext
): Promise<string[]> {
  const result = await context.callPIM({
    query: gql`
      query GET_ITEM_TOPICS($itemId: ID!, $language: String!) {
        item {
          get(id: $itemId, language: $language) {
            topics {
              id
            }
          }
        }
      }
    `,
    variables: {
      itemId,
      language,
    },
  })

  return result.data?.item?.get?.topics?.map((t: any) => t.id) || []
}
