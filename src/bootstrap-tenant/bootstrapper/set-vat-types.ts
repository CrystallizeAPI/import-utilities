import { VatType } from '../../types'
import { buildCreateVatTypeMutation } from '../../graphql'

import { JsonSpec } from '../json-spec'
import { callPIM, getTenantId, StepStatus } from './utils'

async function getExistingVatTypes(): Promise<VatType[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_VAT_TYPES($tenantId: ID!) {
        tenant {
          get(id: $tenantId) {
            vatTypes {
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
  onUpdate(t: StepStatus): any
}

export async function setVatTypes({
  spec,
  onUpdate,
}: Props): Promise<StepStatus> {
  if (!spec?.vatTypes) {
    return {
      done: true,
    }
  }

  // Get all the vat types from the tenant
  const existingVatTypes = await getExistingVatTypes()

  const existingVatTypesIdentifiers = existingVatTypes.map((l) => l.name)
  const missingVatTypes = spec.vatTypes.filter(
    (l) => !existingVatTypesIdentifiers.includes(l.name)
  )

  if (missingVatTypes.length > 0) {
    onUpdate({
      done: false,
      message: `Adding ${missingVatTypes.length} vatType(s)...`,
    })

    const tenantId = getTenantId()

    await Promise.all(
      missingVatTypes.map(async (vatType) => {
        const result = await callPIM({
          query: buildCreateVatTypeMutation({
            input: {
              tenantId,
              name: vatType.name,
              percent: vatType.percent,
            },
          }),
        })

        if (result?.errors) {
          console.log(JSON.stringify(result?.errors, null, 1))
        }

        onUpdate({
          done: false,
          message: `${vatType.name}: ${result?.errors ? 'error' : 'added'}`,
        })
      })
    )
  } else {
    onUpdate({
      done: true,
      message: `All vat types already added`,
    })
  }

  return {
    done: true,
  }
}
