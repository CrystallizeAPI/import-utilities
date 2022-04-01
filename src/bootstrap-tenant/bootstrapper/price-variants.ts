import gql from 'graphql-tag'
import { PriceVariant } from '../../types'
import { buildCreatePriceVariantMutation } from '../../graphql'

import { JsonSpec, JSONPriceVariant as JsonPriceVariant } from '../json-spec'
import { AreaUpdate, BootstrapperContext } from './utils'
import { buildUpdatePriceVariantQueryAndVariables } from '../../graphql/build-update-price-variant-mutation'

export async function getExistingPriceVariants(
  context: BootstrapperContext
): Promise<PriceVariant[]> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
    query: gql`
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

  const specVariants = spec.priceVariants || []

  const existingPriceVariantsIdentifiers = existingPriceVariants.map(
    (p) => p.identifier
  )
  const updatePriceVariants = specVariants.filter((p) =>
    existingPriceVariantsIdentifiers.includes(p.identifier)
  )
  const addPriceVariants = specVariants.filter(
    (p) => !existingPriceVariantsIdentifiers.includes(p.identifier)
  )

  let finished = 0

  const { tenantId } = context

  // Updating existing price variants
  if (updatePriceVariants.length > 0) {
    onUpdate({
      message: `Updating ${addPriceVariants.length} price variant(s)...`,
    })

    await Promise.all(
      updatePriceVariants.map(async (priceVariant) => {
        const result = await context.callPIM(
          buildUpdatePriceVariantQueryAndVariables({
            tenantId,
            identifier: priceVariant.identifier,
            input: {
              currency: priceVariant.currency,
              name: priceVariant.name,
            },
          })
        )

        finished++

        onUpdate({
          progress: finished / specVariants.length,
          message: `${priceVariant.name}: ${
            result?.errors ? 'error' : 'updated'
          }`,
        })
      })
    )
  }

  // Adding missing price variants
  if (addPriceVariants.length > 0) {
    onUpdate({
      message: `Adding ${addPriceVariants.length} price variant(s)...`,
    })

    await Promise.all(
      addPriceVariants.map(async (priceVariant) => {
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
          progress: finished / specVariants.length,
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

  return getExistingPriceVariants(context)
}
