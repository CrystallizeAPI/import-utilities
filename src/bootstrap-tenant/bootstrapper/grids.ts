import gql from 'graphql-tag'
import { buildCreateGridMutation } from '../../graphql/build-create-grid-mutation'
import { buildUpdateGridMutation } from '../../graphql/build-update-grid-mutation'
import { GridRow } from '../../types'
import { JSONGrid, JsonSpec } from '../json-spec'
import {
  getItemId,
  getTranslation,
  AreaUpdate,
  BootstrapperContext,
} from './utils'
import { getAllGrids } from './utils/get-all-grids'

interface ISetGrids {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
  allowUpdate?: boolean
}

// Get item ids from reference
async function setItemIds(
  grid: JSONGrid,
  language: string,
  context: BootstrapperContext
) {
  return Promise.all(
    grid.rows.map(async (row) => {
      await Promise.all(
        row.columns.map(async (column) => {
          const { itemId } = await getItemId({
            externalReference: column.item?.externalReference,
            cataloguePath: column.item?.cataloguePath,
            context,
            language: context.defaultLanguage.code,
            tenantId: context.tenantId,
          })
          if (itemId) {
            column.itemId = itemId
          }
          delete column.item
        })
      )
    })
  )
}

async function createGrid(
  grid: JSONGrid,
  language: string,
  context: BootstrapperContext
): Promise<string | null> {
  await setItemIds(grid, language, context)

  const r = await context.callPIM({
    query: buildCreateGridMutation({
      language,
      input: {
        tenantId: context.tenantId,
        name: getTranslation(grid.name, language),
        rows: grid.rows as GridRow[],
      },
    }),
  })

  return r.data?.grid?.create?.id || null
}

async function updateGrid(
  grid: JSONGrid,
  language: string,
  context: BootstrapperContext
): Promise<string | null> {
  if (!grid.id) {
    return null
  }

  await setItemIds(grid, language, context)
  const r = await context.callPIM({
    query: buildUpdateGridMutation({
      id: grid.id,
      language,
      input: {
        name: getTranslation(grid.name, language),
        rows: grid.rows as GridRow[],
      },
    }),
  })

  return r.data?.grid?.update?.id || null
}

async function publishGrid(
  id: string,
  language: string,
  context: BootstrapperContext
) {
  return context.callPIM({
    query: gql`
      mutation($id: ID!, $language: String!) {
        grid {
          publish(id: $id, language: $language) {
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
  const { spec, context, onUpdate, allowUpdate } = props

  if (!spec?.grids) {
    return
  }

  const language = context.defaultLanguage.code

  const existingGrids = await getAllGrids(language, context)
  const missingGrids: JSONGrid[] = []

  // Determine missing grids by matching the name
  spec?.grids.forEach((grid) => {
    const translatedName = getTranslation(grid.name, language)
    if (!existingGrids.some((t) => t.name === translatedName)) {
      missingGrids.push(grid)
    }
  })

  let finishedGrids = 0

  // Add missing grids
  await Promise.all(
    missingGrids.map(async (grid) => {
      const id = await createGrid(grid, language, context)
      if (id) {
        grid.id = id

        await publishGrid(id, language, context)
        finishedGrids++
        onUpdate({
          progress: finishedGrids / missingGrids.length,
          message: `Created ${getTranslation(grid.name, language)}`,
        })
      }
    })
  )

  // Update existing grids
  if (allowUpdate) {
    await Promise.all(
      existingGrids.map(async (existingGrid) => {
        const jsonGrid = spec.grids?.find(
          (g) => getTranslation(g.name, language) === existingGrid.name
        )
        if (jsonGrid) {
          jsonGrid.id = existingGrid.id
          if (jsonGrid.id) {
            await updateGrid(jsonGrid, language, context)
            await publishGrid(jsonGrid.id, language, context)
          }
        }
      })
    )
  }

  onUpdate({
    progress: 1,
  })
}
