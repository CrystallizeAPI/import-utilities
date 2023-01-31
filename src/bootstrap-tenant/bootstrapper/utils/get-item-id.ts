import gql from 'graphql-tag'
import { BootstrapperContext } from '.'

const externalReferenceQuery = gql`
  query GET_ID_FROM_EXTERNAL_REFERENCE(
    $externalReferences: [String!]
    $language: String!
    $tenantId: ID!
  ) {
    item {
      getMany(
        externalReferences: $externalReferences
        language: $language
        tenantId: $tenantId
      ) {
        id
        shape {
          identifier
        }
        tree {
          path
          parentId
        }
      }
    }
  }
`

const cataloguePathQuery = gql`
  query GET_ID_FROM_PATH($path: String, $language: String) {
    published: catalogue(path: $path, language: $language, version: published) {
      id
      parent {
        id
      }
    }
    draft: catalogue(path: $path, language: $language, version: draft) {
      id
      parent {
        id
      }
    }
  }
`

export interface ItemAndParentId {
  itemId?: string
  parentId?: string
}

export interface IGetItemIdProps {
  context: BootstrapperContext
  cataloguePath?: string
  externalReference?: string
  shapeIdentifier?: string
  language: string
}

export const getItemId = async ({
  context,
  cataloguePath,
  externalReference,
  language,
}: IGetItemIdProps): Promise<ItemAndParentId> => {
  let idAndParent: ItemAndParentId = {}

  /**
   * Prioritise external reference if it exists. It is a better choice
   * for item reference since it is language independent, and suffers
   * from no async operations, unlike catalogue path.
   */
  if (externalReference) {
    idAndParent =
      context.itemExternalReferenceToIDMap.get(externalReference) || {}
    if (idAndParent?.itemId) {
      return idAndParent
    }
    return fetchItemIdFromExternalReference({
      context,
      externalReference,
      language,
    })
  }

  if (cataloguePath) {
    idAndParent = context.itemCataloguePathToIDMap.get(cataloguePath) || {}
    if (idAndParent.itemId) {
      return idAndParent
    }

    idAndParent = await fetchItemIdFromCataloguePath({
      context,
      cataloguePath,
      language,
    })
    if (idAndParent.itemId) {
      return idAndParent
    }
  }

  return idAndParent
}

const fetchItemIdFromExternalReference = async ({
  context,
  externalReference,
  language,
}: {
  context: BootstrapperContext
  externalReference: string
  shapeIdentifier?: string
  language: string
}): Promise<ItemAndParentId> => {
  const response = await context.callPIM({
    query: externalReferenceQuery,
    variables: {
      externalReferences: [externalReference],
      language,
      tenantId: context.tenantId,
    },
  })

  const items = response.data?.item?.getMany

  if (!items?.length || !items[0]) {
    return {}
  }

  const item = items[0]

  return {
    itemId: item.id,
    parentId: item.tree?.parentId,
  }
}

const fetchItemIdFromCataloguePath = async ({
  context,
  cataloguePath,
  language,
}: {
  context: BootstrapperContext
  cataloguePath: string
  language: string
}): Promise<ItemAndParentId> => {
  const response = await context.callCatalogue({
    query: cataloguePathQuery,
    variables: {
      path: cataloguePath,
      language,
    },
  })

  // Favor draft version over published (draft is what we default to after all)
  const item = response.data?.draft || response.data?.published
  if (!item) {
    return {}
  }
  const idAndParent = {
    itemId: item.id,
    parentId: item.parent?.id,
  }

  return idAndParent
}
