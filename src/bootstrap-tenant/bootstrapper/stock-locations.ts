import { StockLocation } from '../../types'
import { buildCreateStockLocationMutation } from '../../graphql'

import { JsonSpec, JSONStockLocation as JsonStockLocation } from '../json-spec'
import { callPIM, getTenantId, AreaUpdate } from './utils'

export async function getExistingStockLocations(): Promise<StockLocation[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_STOCK_LOCATIONS($tenantId: ID!) {
        stockLocation {
          getMany(tenantId: $tenantId) {
            identifier
            name
            settings {
              minimum
              unlimited
            }
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.stockLocation?.getMany || []
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
}

export async function setStockLocations({
  spec,
  onUpdate,
}: Props): Promise<JsonStockLocation[]> {
  // Get all the stock locations from the tenant
  const existingStockLocations = await getExistingStockLocations()

  if (!spec?.stockLocations) {
    return existingStockLocations
  }

  const existingStockLocationsIdentifiers = existingStockLocations.map(
    (sl) => sl.identifier
  )
  const missingStockLocations = spec.stockLocations.filter(
    (sl) => !existingStockLocationsIdentifiers.includes(sl.identifier)
  )

  if (missingStockLocations.length > 0) {
    onUpdate({
      message: `Adding ${missingStockLocations.length} stock location(s)...`,
    })

    const tenantId = getTenantId()

    let finished = 0

    await Promise.all(
      missingStockLocations.map(async (stockLocation) => {
        const result = await callPIM({
          query: buildCreateStockLocationMutation({
            tenantId,
            identifier: stockLocation.identifier,
            name: stockLocation.name,
            ...(stockLocation.minimum
              ? { settings: { minimum: stockLocation.minimum } }
              : {}),
          }),
        })

        finished++

        onUpdate({
          progress: finished / missingStockLocations.length,
          message: `${stockLocation.name}: ${
            result?.errors ? 'error' : 'added'
          }`,
        })
      })
    )
  }

  onUpdate({
    progress: 1,
  })

  const stockLocations = [...existingStockLocations, ...missingStockLocations]

  return stockLocations
}
