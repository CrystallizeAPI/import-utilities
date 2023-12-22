import { ImageComponentContentInput } from '../../../types'
import { getTranslation } from '../utils'
import { createRichTextInput } from './createRichTextInput'
import { ICreateImagesInput } from './types'

export async function createImagesInput(
  props: ICreateImagesInput
): Promise<ImageComponentContentInput[]> {
  const { images, language, onUpdate, context } = props
  const imgs: ImageComponentContentInput[] = []

  for (let i = 0; i < images?.length; i++) {
    const image = images[i]
    let { key, mimeType } = image

    if (!key) {
      try {
        const uploadResult = await context.uploadFileFromUrl(
          image.src,
          image.fileName
        )
        if (uploadResult) {
          key = uploadResult.key
          mimeType = uploadResult.mimeType

          // Store the values so that we don't re-upload again during import
          image.key = uploadResult.key
          image.mimeType = uploadResult.mimeType
        }
      } catch (e: any) {
        onUpdate({
          error: {
            code: 'UPLOAD_FAILED',
            message: `Could not upload image "${JSON.stringify(image)}". Reason: ${e.message ?? 'unknown'}`,
          },
        })
      }
    }

    if (key) {
      imgs.push({
        key,
        mimeType,
        altText: getTranslation(image.altText, language),
        ...(image.caption && {
          caption: createRichTextInput(image.caption, language),
        }),
      })
    }
  }

  return imgs
}
