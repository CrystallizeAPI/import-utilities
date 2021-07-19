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
              externalReference: c.item.tree.externalReference,
              cataloguePath: c.item.tree.path,
            },
      })),
    }
  }

  function handleGrid(grid: any): JSONGrid {
    return {
      ...grid,
      rows: grid.rows?.map(handleRow) || [],
    }
  }

  return response.data?.grid?.getMany?.map(handleGrid) || []
}
