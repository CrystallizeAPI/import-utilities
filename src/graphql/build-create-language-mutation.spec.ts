import test from 'ava'

import { LanguageInput } from '../types/language/language'
import { buildCreateLanguageMutation } from './build-create-language-mutation'

test('create mutation for price variant', (t) => {
  const language: LanguageInput = {
    tenantId: '1234',
    input: {
      code: 'no',
      name: 'Norsk',
    },
  }

  const got = buildCreateLanguageMutation(language).replace(/ /g, '')
  const want: string = `
    mutation {
      language {
        add (
          tenantId: "1234",
          input: {
            code: "no",
            name: "Norsk"
          }
        ) {
          code
          name
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
