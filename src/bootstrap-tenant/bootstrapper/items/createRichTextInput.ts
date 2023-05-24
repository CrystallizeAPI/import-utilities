import { RichTextContentInput } from '../../../types'
import { JSONRichTextTranslated } from '../../json-spec'
import { getTranslation } from '../utils'
// @ts-expect-error content-transformer  has no types
import fromHTML from '@crystallize/content-transformer/fromHTML'

export function createRichTextInput(
  content: JSONRichTextTranslated,
  language: string
) {
  function stringToJson(str: string) {
    return [
      JSON.parse(
        JSON.stringify({
          kind: 'block',
          type: 'paragraph',
          children: [
            {
              kind: 'inline',
              type: 'span',
              textContent: str,
            },
          ],
        })
      ),
    ]
  }

  const inp: RichTextContentInput = {}
  if (typeof content === 'string') {
    inp.json = stringToJson(content)
  } else if (typeof content === 'object') {
    /**
     * Determine if the rich text content is one of
     * {
     *  json: ...,
     *  html: ...,
     *  plainText: ...
     * }
     * or
     * {
     *  [lang]: {
     *    json: ...
     *    ...
     *  }
     * }
     *
     **/
    const c = content as any

    const keys = Object.keys(content || {})

    const isNotTranslated = ['json', 'html', 'plainText'].includes(keys[0])
    const translatedContent = isNotTranslated ? c : getTranslation(c, language)

    if (translatedContent?.html) {
      inp.json = fromHTML(translatedContent?.html)
    } else {
      if (typeof translatedContent === 'string') {
        inp.json = stringToJson(translatedContent)
      } else {
        if (translatedContent.json) {
          inp.json = translatedContent.json
        } else if (translatedContent.html) {
          inp.json = fromHTML(translatedContent.html)
        } else if (translatedContent.plainText) {
          inp.json = stringToJson(translatedContent.plainText)
        }
      }
    }
  }

  return inp
}
