import { PriceVariant } from '../../types'
import { buildCreatePriceVariantMutation } from '../../graphql'

import { JsonSpec, JSONPriceVariant as JsonPriceVariant } from '../json-spec'
import { AreaUpdate, BootstrapperContext } from './utils'

export async function getExistingPriceVariants(
  context: BootstrapperContext
): Promise<PriceVariant[]> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
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
  context: BootstrapperContext
}

export async function setPriceVariants({
  spec,
  onUpdate,
  context,
}: Props): Promise<JsonPriceVariant[]> {
  // Get all the price variants from the tenant
  const existingPriceVariants = await getExistingPriceVariants(context)

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

    const tenantId = context.tenantId

    let finished = 0

    await Promise.all(
      missingPriceVariants.map(async (priceVariant) => {
        const result = await context.callPIM({
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
