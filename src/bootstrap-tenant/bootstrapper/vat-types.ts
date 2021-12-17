import { VatType } from '../../types'
import { buildCreateVatTypeMutation } from '../../graphql'

import { JsonSpec } from '../json-spec'
import { AreaUpdate, BootstrapperContext } from './utils'

export async function getExistingVatTypes(
  context: BootstrapperContext
): Promise<VatType[]> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
    query: `
      query GET_TENANT_VAT_TYPES($tenantId: ID!) {
        tenant {
          get(id: $tenantId) {
            vatTypes {
              id
              tenantId
              name
              percent
            }
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.tenant?.get?.vatTypes || []
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

export async function setVatTypes({
  spec,
  context,
  onUpdate,
}: Props): Promise<VatType[]> {
  // Get all the vat types from the tenant
  const existingVatTypes = await getExistingVatTypes(context)

  if (!spec?.vatTypes) {
    onUpdate({
      progress: 1,
    })
    return existingVatTypes
  }

  const existingVatTypesIdentifiers = existingVatTypes.map((l) => l.name)
  const missingVatTypes = spec.vatTypes.filter(
    (l) => !existingVatTypesIdentifiers.includes(l.name)
  )

  if (missingVatTypes.length > 0) {
    onUpdate({
      message: `Adding ${missingVatTypes.length} vatType(s)...`,
    })

    const tenantId = context.tenantId

    let finished = 0

    await Promise.all(
      missingVatTypes.map(async (vatType) => {
        const result = await context.callPIM({
          query: buildCreateVatTypeMutation({
            input: {
              tenantId,
              name: vatType.name,
              percent: vatType.percent,
            },
          }),
        })
        finished++

        onUpdate({
          progress: finished / missingVatTypes.length,
          message: `${vatType.name}: ${result?.errors ? 'error' : 'added'}`,
        })
      })
    )
  }

  onUpdate({
    progress: 1,
  })

  return getExistingVatTypes(context)
}
