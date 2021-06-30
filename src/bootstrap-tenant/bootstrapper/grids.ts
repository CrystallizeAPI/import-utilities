import { buildCreateGridMutation } from '../../graphql/build-create-grid-mutation'
import { GridRow } from '../../types'
import { JSONGrid, JsonSpec } from '../json-spec'
import {
  callPIM,
  getItemIdFromCataloguePath,
  getTenantId,
  getTranslation,
  StepStatus,
  TenantContext,
} from './utils'
import { getAllGrids } from './utils/get-all-grids'

interface ISetGrids {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
  context: TenantContext
}

async function createGrid(
  grid: JSONGrid,
  language: string
): Promise<string | null> {
  // Get item ids from reference
  await Promise.all(
    grid.rows.map(async (row) => {
      await Promise.all(
        row.columns.map(async (column) => {
          const path = column.item?.cataloguePath
          if (path) {
            const itemId = await getItemIdFromCataloguePath(path, language)
            if (itemId) {
              column.itemId = itemId
            }
          }
          delete column.item
        })
      )
    })
  )

  const r = await callPIM({
    query: buildCreateGridMutation({
      language,
      input: {
        tenantId: getTenantId(),
        name: getTranslation(grid.name, language),
        rows: grid.rows as GridRow[],
      },
    }),
  })

  return r.data?.grid?.create?.id || null
}

async function publishGrid(id: string, language: string) {
  return callPIM({
    query: `
      mutation ($id: ID!, $language: String!) {
        grid {
          publish (id: $id, language: $language) {
            id
          }
        }
      }
    `,
    variables: {
      id,
      language,
    },
  })
}

export async function setGrids(props: ISetGrids) {
  const { spec, context, onUpdate } = props

  if (!spec?.grids) {
    return
  }

  const language = context.defaultLanguage.code

  const existingGrids = await getAllGrids(language)
  const missingGrids: JSONGrid[] = []

  // Determine missing grids by matching the name
  spec?.grids.forEach((grid) => {
    const translatedName = getTranslation(grid.name, language)
    if (!existingGrids.some((t) => t.name === translatedName)) {
      missingGrids.push(grid)
    }
  })

  if (missingGrids.length > 0) {
    await Promise.all(
      missingGrids.map(async (grid) => {
        const id = await createGrid(grid, language)
        if (id) {
          await publishGrid(id, language)
          onUpdate({
            done: false,
            message: `Created ${getTranslation(grid.name, language)}`,
          })
        }
      })
    )
  }
}
