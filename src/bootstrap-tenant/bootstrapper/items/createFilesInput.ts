import { FileInput } from '../../../generated/graphql'
import { getTranslation } from '../utils'
import { ICreateFilesInput } from './types'

export async function createFilesInput(
  props: ICreateFilesInput
): Promise<FileInput[]> {
  const { files, language, context, onUpdate } = props

  const fs: FileInput[] = []

  for (let i = 0; i < files?.length; i++) {
    const file = files[i]
    let { key } = file

    if (!key) {
      try {
        const uploadResult = await context.uploadFileFromUrl(file.src)
        if (uploadResult) {
          key = uploadResult.key

          // Store the values so that we don't re-upload again during import
          file.key = uploadResult.key
        }
      } catch (e) {
        onUpdate({
          error: {
            code: 'UPLOAD_FAILED',
            message: `Could not upload file "${JSON.stringify(file)}"`,
          },
        })
      }
    }

    if (key) {
      fs.push({
        key,
        title: getTranslation(file.title, language),
      })
    }
  }

  return fs
}
