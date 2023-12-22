import { VideoContentInput } from '../../../types'
import { getTranslation } from '../utils'
import { createImagesInput } from './createImagesInput'
import { ICreateVideosInput } from './types'

export async function createVideosInput(
  props: ICreateVideosInput
): Promise<VideoContentInput[]> {
  const { videos, language, context, onUpdate } = props

  const vids: VideoContentInput[] = []

  for (let i = 0; i < videos?.length; i++) {
    const video = videos[i]
    let { key } = video

    if (!key) {
      try {
        const uploadResult = await context.uploadFileFromUrl(video.src)
        if (uploadResult) {
          key = uploadResult.key

          // Store the values so that we don't re-upload again during import
          video.key = uploadResult.key
        }
      } catch (e: any) {
        onUpdate({
          error: {
            code: 'UPLOAD_FAILED',
            message: `Could not upload video "${JSON.stringify(video)}". Reason: ${e.message ?? 'unknown'}`,
          },
        })
      }
    }

    if (key) {
      vids.push({
        key,
        title: getTranslation(video.title, language),
        ...(video.thumbnails && {
          thumbnails: await createImagesInput({
            images: video.thumbnails,
            language,
            onUpdate,
            context,
          }),
        }),
      })
    }
  }

  return vids
}
