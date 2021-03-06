import { PriceVariant } from '../../types'
import { buildCreatePriceVariantMutation } from '../../graphql'

import { JsonSpec, JSONPriceVariant as JsonPriceVariant } from '../json-spec'
import { callPIM, getTenantId, AreaUpdate } from './utils'

export async function getExistingPriceVariants(): Promise<PriceVariant[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_PRICE_VARIANTS($tenantId: ID!) {
        priceVariant {
          getMany(tenantId: $tenantId) {
            identifier
            name
            currency
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.priceVariant?.getMany || []
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
}

export async function setPriceVariants({
  spec,
  onUpdate,
}: Props): Promise<JsonPriceVariant[]> {
  // Get all the price variants from the tenant
  const existingPriceVariants = await getExistingPriceVariants()

  if (!spec?.priceVariants) {
    return existingPriceVariants
  }

  const existingPriceVariantsIdentifiers = existingPriceVariants.map(
    (p) => p.identifier
  )
  const missingPriceVariants = spec.priceVariants.filter(
    (p) => !existingPriceVariantsIdentifiers.includes(p.identifier)
  )

  if (missingPriceVariants.length > 0) {
    onUpdate({
      message: `Adding ${missingPriceVariants.length} price variant(s)...`,
    })

    const tenantId = getTenantId()

    let finished = 0

    await Promise.all(
      missingPriceVariants.map(async (priceVariant) => {
        const result = await callPIM({
          query: buildCreatePriceVariantMutation({
            tenantId,
            identifier: priceVariant.identifier,
            name: priceVariant.name,
            currency: priceVariant.currency,
          }),
        })

        finished++

        onUpdate({
          progress: finished / missingPriceVariants.length,
          message: `${priceVariant.name}: ${
            result?.errors ? 'error' : 'added'
          }`,
        })
      })
    )
  }

  onUpdate({
    progress: 1,
  })

  const priceVariants = [...existingPriceVariants, ...missingPriceVariants]

  return priceVariants
}
