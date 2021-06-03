import { Language } from '../../types'
import { buildCreateLanguageMutation } from '../../graphql'

import { JsonSpec } from '../json-spec'
import { callPIM, getTenantId, StepStatus } from './utils'

async function getExistingLanguages(): Promise<Language[]> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_LANGUAGES($tenantId: ID!) {
        tenant {
          get(id: $tenantId) {
            availableLanguages {
              code
              name
              system
            }
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.tenant?.get?.availableLanguages || []
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
}

export async function setLanguages({
  spec,
  onUpdate,
}: Props): Promise<StepStatus> {
  if (!spec?.languages) {
    return {
      done: true,
    }
  }

  // Get all the price variants from the tenant
  const existingLanguages = await getExistingLanguages()

  const existingLanguagesIdentifiers = existingLanguages.map((l) => l.code)
  const missingLanguages = spec.languages.filter(
    (l) => !existingLanguagesIdentifiers.includes(l.code)
  )

  if (missingLanguages.length > 0) {
    onUpdate({
      done: false,
      message: `Adding ${missingLanguages.length} language(s)...`,
    })

    const tenantId = getTenantId()

    await Promise.all(
      missingLanguages.map(async (language) => {
        const result = await callPIM({
          query: buildCreateLanguageMutation({
            tenantId,
            input: {
              code: language.code,
              name: language.name,
            },
          }),
        })

        onUpdate({
          done: false,
          message: `${language.name}: ${result?.errors ? 'error' : 'added'}`,
        })
      })
    )
  } else {
    onUpdate({
      done: true,
      message: `All languages already added`,
    })
  }

  return {
    done: true,
  }
}
