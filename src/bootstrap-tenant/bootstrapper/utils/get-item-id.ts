import gql from 'graphql-tag'
import { BootstrapperContext } from '.'
import { JSONItem } from '../../json-spec'

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
    catalogue(path: $path, language: $language) {
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
  shapeIdentifier,
  language,
}: IGetItemIdProps): Promise<ItemAndParentId> => {
  let idAndParent: ItemAndParentId = {}

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

  if (externalReference) {
    idAndParent =
      context.itemExternalReferenceToIDMap.get(externalReference) || {}
    if (idAndParent?.itemId) {
      return idAndParent
    }
    return fetchItemIdFromExternalReference({
      context,
      externalReference,
      shapeIdentifier,
      language,
    })
  }

  return idAndParent
}

const fetchItemIdFromExternalReference = async ({
  context,
  externalReference,
  shapeIdentifier,
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

  let items = response.data?.item?.getMany || []

  if (shapeIdentifier) {
    items = items.filter((s: any) => s.shape.identifier === shapeIdentifier)
  }

  const item = items[0]
  if (!item) {
    return {}
  }

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

  const item = response.data?.catalogue
  if (!item) {
    return {}
  }
  const idAndParent = {
    itemId: item.id,
    parentId: item.parent?.id,
  }

  return idAndParent
}
