import gql from 'graphql-tag'
import { buildCreateLanguageMutation } from '../../graphql'

import { JsonSpec, JSONLanguage } from '../json-spec'
import { AreaUpdate, BootstrapperContext } from './utils'

interface TenantSettings {
  availableLanguages: JSONLanguage[]
  defaultLanguage?: string
}

export async function getTenantSettings(
  context: BootstrapperContext
): Promise<TenantSettings> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
    query: gql`
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

  {
    availableLanguages.forEach((l: JSONLanguage) => {
      l.isDefault = l.code === defaultLanguage
    })
  }

  return {
    availableLanguages,
    defaultLanguage,
  }
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

export async function setLanguages({
  spec,
  onUpdate,
  context,
}: Props): Promise<JSONLanguage[]> {
  const tenantSettings = await getTenantSettings(context)

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
      message: `Adding ${missingLanguages.length} language(s)...`,
      progress: 0,
    })

    const tenantId = context.tenantId

    await Promise.all(
      missingLanguages.map(async (language) => {
        const result = await context.callPIM({
          query: buildCreateLanguageMutation({
            tenantId,
            input: {
              code: language.code,
              name: language.name,
            },
          }),
        })

        onUpdate({
          message: `${language.name}: ${result?.errors ? 'error' : 'added'}`,
        })
      })
    )
  }

  // Compose a list of all languages to be used later
  const languages: JSONLanguage[] = [...existingLanguages, ...missingLanguages]

  const defaultLanguage =
    spec.languages.find((l) => l.isDefault)?.code ||
    tenantSettings.defaultLanguage ||
    languages[0].code

  {
    languages.forEach((l) => {
      l.isDefault = l.code === defaultLanguage
    })
  }

  if (defaultLanguage !== tenantSettings.defaultLanguage) {
    const result = await context.callPIM({
      query: gql`
        mutation {
          tenant {
            update(
              id: "${context.tenantId}"
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

    onUpdate({
      message: `Setting default language to "${defaultLanguage}": ${
        result?.errors ? 'error' : 'success'
      }`,
    })
  }

  onUpdate({
    progress: 1,
  })

  return languages
}
