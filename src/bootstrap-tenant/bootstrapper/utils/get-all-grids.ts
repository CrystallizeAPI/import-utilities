import { BootstrapperContext } from '.'
import { JSONGrid } from '../../json-spec'

const QUERY_GET_ALL_GRIDS = `
query GET_GRIDS($tenantId: ID!, $language: String!) {
	grid {
    getMany (
      tenantId: $tenantId
      language: $language
    ) {
      id
    }
  }
}
`

const QUERY_GET_GRID = `
query GET_GRID($id: ID!, $language: String!) {
	grid {
    get (
      id: $id
      language: $language
    ) {
      id
      name
      rows {
        columns {
          itemId
          item {
            id
            externalReference
            tree {
              path(language: $language)
            }
          }
          layout {
            rowspan
            colspan
          }
        }
      }
    }
  }
}
`

type GetAllGridsOptions = {
  setItemExternalReference: boolean
}

export async function getAllGrids(
  language: string,
  context: BootstrapperContext,
  options?: GetAllGridsOptions
): Promise<JSONGrid[]> {
  const tenantId = context.tenantId

  const responseAllGrids = await context.callPIM({
    query: QUERY_GET_ALL_GRIDS,
    variables: {
      language,
      tenantId,
    },
  })

  function handleRow(row: any) {
    return {
      columns: row.columns.map((c: any) => {
        let item

        if (c.item) {
          if (options?.setItemExternalReference && !c.item.externalReference) {
            item = {
              externalReference: `crystallize-spec-ref-${c.item.id}`,
            }
          } else {
            item = {
              externalReference: c.item.tree.externalReference,
              cataloguePath: c.item.tree.path,
            }
          }
        }

        return {
          layout: c.layout,
          item,
        }
      }),
    }
  }

  async function handleGrid({ id }: { id: string }): Promise<JSONGrid> {
    // Get base grid info
    const gridResponse = await context.callPIM({
      query: QUERY_GET_GRID,
      variables: {
        id,
        language,
      },
    })

    const grid = gridResponse?.data?.grid?.get

    // Get names for remaining languages
    if (context.config.multilingual) {
      grid.name = {
        [language]: grid.name,
      }

      const remainingLanguages = context.languages
        .map((l) => l.code)
        .filter((l) => l !== language)
      await Promise.all(
        remainingLanguages.map(async (lang) => {
          grid.name[lang] = await getNameForGrid(id, lang, context)
        })
      )
    }
    return {
      ...grid,
      rows: grid.rows?.map(handleRow) || [],
    }
  }

  return Promise.all(
    responseAllGrids.data?.grid?.getMany?.map(handleGrid) || []
  )
}

async function getNameForGrid(
  id: string,
  language: string,
  context: BootstrapperContext
): Promise<string | null> {
  const response = await context.callPIM({
    query: `
      query GET_NAME_FOR_GRID (
        $id: ID!
        $language: String!
      ) {
        grid {
          get (
            id: $id
            language: $language
          ) {
            name
          }
        }
      }
    `,
    variables: {
      id,
      language,
    },
  })

  return response.data?.grid?.get?.name || null
}
