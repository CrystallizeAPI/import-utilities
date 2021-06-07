import { buildCreateLanguageMutation } from '../../graphql'

import { JsonSpec, JSONLanguage } from '../json-spec'
import { callPIM, getTenantId, StepStatus } from './utils'

interface TenantSettings {
  availableLanguages: JSONLanguage[]
  defaultLanguage?: string
}

async function getTenantSettings(): Promise<TenantSettings> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_LANGUAGES($tenantId: ID!) {
        tenant {
          get(id: $tenantId) {
            defaults {
              language
            }
            availableLanguages {
              code
              name
            }
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  const data = r.data?.tenant?.get || {}
  const availableLanguages = data.availableLanguages || []
  const defaultLanguage =
    data?.defaults?.language || availableLanguages[0]?.code
  availableLanguages.forEach(
    (l: JSONLanguage) => (l.isDefault = l.code === defaultLanguage)
  )

  return {
    availableLanguages,
    defaultLanguage,
  }
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
}

export async function setLanguages({
  spec,
  onUpdate,
}: Props): Promise<JSONLanguage[]> {
  const tenantSettings = await getTenantSettings()

  const existingLanguages = tenantSettings.availableLanguages

  if (!spec?.languages) {
    return tenantSettings.availableLanguages
  }

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

        if (result?.errors) {
          console.log(JSON.stringify(result?.errors, null, 1))
        }

        onUpdate({
          done: false,
          message: `${language.name}: ${result?.errors ? 'error' : 'added'}`,
        })
      })
    )
  } else {
    onUpdate({
      done: false,
      message: `No new languages found`,
    })
  }

  // Compose a list of all languages to be used later
  const languages: JSONLanguage[] = [...existingLanguages, ...missingLanguages]

  const defaultLanguage =
    spec.languages.find((l) => l.isDefault)?.code ||
    tenantSettings.defaultLanguage ||
    languages[0].code
  languages.forEach((l) => {
    l.isDefault = l.code === defaultLanguage
  })

  if (defaultLanguage !== tenantSettings.defaultLanguage) {
    const result = await callPIM({
      query: `
        mutation {
          tenant {
            update(
              id: "${getTenantId()}"
              input: {
                defaults: {
                  language: "${defaultLanguage}"
                }
              }
            ) {
              id
            }
          }
        }
      `,
    })

    if (result?.errors) {
      console.log(JSON.stringify(result?.errors, null, 1))
    }

    onUpdate({
      done: false,
      message: `Setting default language to "${defaultLanguage}": ${
        result?.errors ? 'error' : 'success'
      }`,
    })
  }

  return languages
}
