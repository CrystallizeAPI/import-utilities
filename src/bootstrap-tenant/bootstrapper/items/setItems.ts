import { JsonSpec, JSONFolder } from '../../json-spec'
import {
  getTranslation,
  AreaUpdate,
  BootstrapperContext,
  getTenantRootItemId,
} from '../utils'
import { ffmpegAvailable } from '../utils/remote-file-upload'
import { handleItem } from './handleItem'
import { handleItemRelationsAndPublish } from './handleItemRelationsAndPublish'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

export async function setItems({
  spec,
  onUpdate,
  context,
}: Props): Promise<void> {
  if (!spec?.items) {
    return
  }

  const ffmpeg = await ffmpegAvailable
  if (!ffmpeg) {
    onUpdate({
      warning: {
        code: 'FFMPEG_UNAVAILABLE',
        message:
          'ffmpeg is not available. Videos will not be included. Installment instructions for ffmpeg: https://ffmpeg.org/download.html',
      },
    })
  }

  const rootItemId = await getTenantRootItemId(context)

  // Get a total item count
  let totalItems = 0
  function getCount(item: JSONFolder) {
    totalItems++
    if (item && 'children' in item) {
      item.children?.forEach(getCount)
    }
  }
  spec.items.forEach(getCount)

  // Double the item count since we're doing add/update _and_ item relations later
  totalItems *= 2

  let finishedItems = 0

  for (let i = 0; i < spec.items.length; i++) {
    const item = spec.items[i]

    try {
      finishedItems = await handleItem(
        item,
        i,
        rootItemId,
        context,
        onUpdate,
        finishedItems,
        totalItems
      )
    } catch (e) {
      onUpdate({
        error: {
          code: 'CANNOT_HANDLE_ITEM',
          message: `Skipping "${getTranslation(
            item.name,
            context.targetLanguage || context.defaultLanguage
          )}"`,
          item,
        },
      })
    }
  }

  /**
   * Item relations needs to be handled at the end, after all
   * items are created
   */
  onUpdate({
    message: 'Updating item relations...',
  })

  /**
   * At this point we want to start using cached values
   * so that we don't hit the API as much and speed things up
   */

  context.useReferenceCache = true

  for (let i = 0; i < spec.items.length; i++) {
    finishedItems = await handleItemRelationsAndPublish(
      spec.items[i],
      context,
      onUpdate,
      finishedItems,
      totalItems
    )
  }

  // clearInterval(getFileuploaderStatusInterval)
  onUpdate({
    progress: 1,
  })
}
