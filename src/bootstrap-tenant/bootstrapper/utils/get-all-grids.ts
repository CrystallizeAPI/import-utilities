import { BootstrapperContext } from '.'
import { JSONGrid } from '../../json-spec'

const QUERY = `
query GET_GRIDS($tenantId: ID!, $language: String!) {
	grid {
    getMany (
      tenantId: $tenantId
      language: $language
    ) {
      id
      name
      rows {
        columns {
          item {
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

export async function getAllGrids(
  language: string,
  context: BootstrapperContext
): Promise<JSONGrid[]> {
  const tenantId = context.tenantId

  const response = await context.callPIM({
    query: QUERY,
    variables: {
      language,
      tenantId,
    },
  })

  function handleRow(row: any) {
    return {
      columns: row.columns.map((c: any) => ({
        layout: c.layout,
        item: !c.item
          ? null
          : {
              externalReference: c.item.tree.externalReference,
              cataloguePath: c.item.tree.path,
            },
      })),
    }
  }

  async function handleGrid(grid: any): Promise<JSONGrid> {
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
          grid.name[lang] = await getNameForGrid(grid.id, lang, context)
        })
      )
    }
    return {
      ...grid,
      rows: grid.rows?.map(handleRow) || [],
    }
  }

  return Promise.all(response.data?.grid?.getMany?.map(handleGrid) || [])
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
