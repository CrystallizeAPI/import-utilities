import { getTenantId } from '.'
import { JSONGrid } from '../../json-spec'
import { callPIM } from './api'

const QUERY = `
query GET_GRIDS($tenantId: ID!, $language: String!) {
	grid {
    getMany (
      tenantId: $tenantId
      language: $language
    ) {
      name
      rows {
        columns {
          item {
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

export async function getAllGrids(language: string): Promise<JSONGrid[]> {
  const response = await callPIM({
    query: QUERY,
    variables: {
      language,
      tenantId: getTenantId(),
    },
  })

  function handleRow(row: any) {
    return {
      columns: row.columns.map((c: any) => ({
        layout: c.layout,
        item: !c.item
          ? null
          : {
              cataloguePath: c.item.tree.path,
            },
      })),
    }
  }

  function handleGrid(grid: any): JSONGrid {
    return {
      name: grid.name,
      rows: grid.rows?.map(handleRow) || [],
    }
  }

  return response.data?.grid?.getMany?.map(handleGrid) || []
}
