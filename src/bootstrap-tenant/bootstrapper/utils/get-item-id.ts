import gql from 'graphql-tag'
import { BootstrapperContext } from '.'

export interface ItemAndParentId {
  itemId?: string
  parentId?: string
}

interface GetItemIdProps {
  externalReference?: string
  cataloguePath?: string
  language: string
  tenantId: string
  context: BootstrapperContext
  shapeIdentifier?: string
}

export async function getItemId(
  props: GetItemIdProps
): Promise<ItemAndParentId> {
  const { externalReference, cataloguePath } = props

  let idAndParent: ItemAndParentId = {}

  if (externalReference) {
    idAndParent = await getItemIdFromExternalReference(props)
  }

  if (!idAndParent.itemId && cataloguePath) {
    return getItemIdFromCataloguePath(props)
  }

  return idAndParent
}

const getItemIdFromCataloguePath = async ({
  cataloguePath,
  language,
  context,
}: GetItemIdProps): Promise<ItemAndParentId> => {
  if (!cataloguePath) {
    return {}
  }

  const idAndParent = context.itemCataloguePathToIDMap.get(cataloguePath)
  if (idAndParent?.itemId) {
    return idAndParent
  }

  return fetchItemIdFromCataloguePath({
    path: cataloguePath,
    language,
    context,
  })
}

async function getItemIdFromExternalReference({
  externalReference,
  language,
  tenantId,
  shapeIdentifier,
  context,
}: GetItemIdProps): Promise<ItemAndParentId> {
  if (!externalReference) {
    return {}
  }

  const idAndParent =
    context.itemExternalReferenceToIDMap.get(externalReference)
  if (idAndParent?.itemId) {
    return idAndParent
  }

  const response = await context.callPIM({
    query: gql`
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
    `,
    variables: {
      externalReferences: [externalReference],
      language,
      tenantId,
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

async function fetchItemIdFromCataloguePath({
  path,
  language,
  context,
}: {
  path: string
  language: string
  context: BootstrapperContext
}): Promise<ItemAndParentId> {
  const response = await context.callCatalogue({
    query: gql`
      query GET_ID_FROM_PATH($path: String, $language: String) {
        catalogue(path: $path, language: $language) {
          id
          parent {
            id
          }
        }
      }
    `,
    variables: {
      path,
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
