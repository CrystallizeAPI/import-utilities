import {
  JSONLanguage,
  JSONPriceVariant,
  Shape,
  JSONVatType,
} from '../../json-spec'
import { callCatalogue, callPIM } from './api'
import { remoteFileUpload, RemoteFileUploadResult } from './remote-file-upload'

export * from './api'

export const EVENT_NAMES = {
  DONE: 'BOOTSTRAPPER_DONE',
  STATUS_UPDATE: 'BOOTSTRAPPER_STATUS_UPDATE',
  SHAPES_UPDATE: 'BOOTSTRAPPER_SHAPES_UPDATE',
  SHAPES_DONE: 'BOOTSTRAPPER_SHAPES_DONE',
  PRICE_VARIANTS_UPDATE: 'BOOTSTRAPPER_PRICE_VARIANTS_UPDATE',
  PRICE_VARIANTS_DONE: 'BOOTSTRAPPER_PRICE_VARIANTS_DONE',
  LANGUAGES_UPDATE: 'BOOTSTRAPPER_LANGUAGES_UPDATE',
  LANGUAGES_DONE: 'BOOTSTRAPPER_LANGUAGES_DONE',
  VAT_TYPES_UPDATE: 'BOOTSTRAPPER_VAT_TYPES_UPDATE',
  VAT_TYPES_DONE: 'BOOTSTRAPPER_VAT_TYPES_DONE',
  TOPICS_UPDATE: 'BOOTSTRAPPER_TOPICS_UPDATE',
  TOPICS_DONE: 'BOOTSTRAPPER_TOPICS_DONE',
  GRIDS_UPDATE: 'BOOTSTRAPPER_GRIDS_UPDATE',
  GRIDS_DONE: 'BOOTSTRAPPER_GRIDS_DONE',
  ITEMS_UPDATE: 'BOOTSTRAPPER_ITEMS_UPDATE',
  ITEMS_DONE: 'BOOTSTRAPPER_ITEMS_DONE',
}

export interface AreaWarning {
  message: string
  code: 'FFMPEG_UNAVAILABLE' | 'UPLOAD_FAILED' | 'SHAPE_ID_TRUNCATED' | 'OTHER'
}

export interface AreaUpdate {
  progress?: number
  message?: string
  warning?: AreaWarning
}

export interface Config {
  itemTopics?: 'amend' | 'replace'
}

export interface TenantContext {
  defaultLanguage: JSONLanguage
  languages: JSONLanguage[]
  shapes?: Shape[]
  priceVariants?: JSONPriceVariant[]
  vatTypes?: JSONVatType[]
  config: Config
}

let tenantId = ''
export function setTenantId(id: string) {
  tenantId = id
}

export function getTenantId() {
  return tenantId
}

export function getTranslation(translation?: any, language?: string): string {
  if (!translation || !language) {
    return ''
  }
  if (typeof translation === 'string') {
    return translation
  }

  return translation[language] ?? ''
}

type uploadFileRecord = {
  url: string
  result: Promise<RemoteFileUploadResult | null>
}

type fileUploadQueueItem = {
  url: string
  status: 'working' | 'done' | 'not-started'
  failCount?: number
  resolve: (result: RemoteFileUploadResult | null) => void
  reject: (r: any) => void
}

class FileUploadManager {
  uploads: uploadFileRecord[] = []
  maxWorkers: number = 2
  workerQueue: fileUploadQueueItem[] = []

  constructor() {
    setInterval(() => this.work(), 5)
  }

  async work() {
    const currentWorkers = this.workerQueue.filter(
      (q) => q.status === 'working'
    ).length
    if (currentWorkers === this.maxWorkers) {
      return
    }

    const item = this.workerQueue.find((q) => q.status === 'not-started')
    if (!item) {
      return
    }

    item.status = 'working'

    try {
      const result = await remoteFileUpload(item.url, getTenantId())
      item.resolve(result)
      item.status = 'done'
    } catch (e) {
      if (!item.failCount) {
        item.failCount = 0
      }
      item.failCount++

      // Allow for 5 fails
      if (item.failCount > 5) {
        item.reject(e)
        item.status = 'done'
      } else {
        item.status = 'not-started'
      }
    }
  }

  uploadFromUrl(url: string) {
    const existing = this.uploads.find((u) => u.url === url)
    if (existing) {
      return existing.result
    }
    const result = this.scheduleUpload(url)

    this.uploads.push({
      url,
      result,
    })

    return result
  }

  scheduleUpload(url: string): Promise<RemoteFileUploadResult | null> {
    return new Promise((resolve, reject) => {
      this.workerQueue.push({
        url,
        status: 'not-started',
        resolve,
        reject,
      })
    })
  }
}

export const fileUploader = new FileUploadManager()

export function uploadFileFromUrl(
  url: string
): Promise<RemoteFileUploadResult | null> {
  return fileUploader.uploadFromUrl(url)
}

export function validShapeIdentifier(
  str: string,
  onUpdate: (t: AreaUpdate) => any
) {
  if (str.length <= 24) return str

  const validIdentifier = str.substr(0, 11) + '-' + str.substr(str.length - 12)
  onUpdate({
    warning: {
      code: 'SHAPE_ID_TRUNCATED',
      message: `Truncating shape identifier "${str}" to "${validIdentifier}"`,
    },
  })

  return validIdentifier
}

export async function getItemIdFromExternalReference(
  externalReference: string,
  language: string,
  tenantId: string
): Promise<string> {
  const response = await callPIM({
    query: `
      query GET_ID_FROM_EXTERNAL_REFERENCE(
        $externalReferences: [String!]
        $language: String!
        $tenantId: ID!
      ) {
        item {
          getMany(externalReferences: $externalReferences, language: $language, tenantId: $tenantId) {
            id
          }
        }
      }
    `,
    variables: {
      externalReferences: [externalReference],
      language,
      tenantId,
    },
  })

  return response.data?.item?.getMany?.[0]?.id || ''
}

export async function getItemIdFromCataloguePath(
  path: string,
  language: string
): Promise<string> {
  const response = await callCatalogue({
    query: `
      query GET_ID_FROM_PATH ($path: String, $language: String) {
        catalogue(path: $path, language: $language) {
          id
        }
      }
    `,
    variables: {
      path,
      language,
    },
  })

  return response.data?.catalogue?.id || ''
}

interface IgetItemVersionInfo {
  language: string
  itemId: string
}

export enum ItemVersionDescription {
  Unpublished,
  StaleVersionPublished,
  Published,
}

async function getItemVersionInfo({
  language,
  itemId,
}: IgetItemVersionInfo): Promise<ItemVersionDescription> {
  const result = await callPIM({
    query: `
      query GET_ITEM_VERSION_INFO ($itemId: ID!, $language: String!) {
        item {
          published: get (
            id: $itemId
            language: $language
            versionLabel: published
          ) {
            version {
              createdAt
            }
          }
          draft: get (
            id: $itemId
            language: $language
            versionLabel: draft
          ) {
            version {
              createdAt
            }
          }
        }
      }
    `,
    variables: {
      itemId,
      language,
    },
  })

  const draftInfo: string = result.data?.item?.draft?.version.createdAt
  const publishInfo: string | undefined =
    result.data?.item?.published?.version.createdAt

  if (publishInfo) {
    const publishDate = new Date(publishInfo)
    const draftDate = new Date(draftInfo)

    if (publishDate >= draftDate) {
      return ItemVersionDescription.Published
    }
    return ItemVersionDescription.StaleVersionPublished
  }

  return ItemVersionDescription.Unpublished
}

interface IgetItemVersionsForLanguages {
  languages: string[]
  itemId: string
}

export async function getItemVersionsForLanguages({
  languages,
  itemId,
}: IgetItemVersionsForLanguages): Promise<
  Record<string, ItemVersionDescription>
> {
  const itemVersionsForLanguages: Record<string, ItemVersionDescription> = {}

  await Promise.all(
    languages.map(async (language) => {
      itemVersionsForLanguages[language] = await getItemVersionInfo({
        language,
        itemId,
      })
    })
  )

  return itemVersionsForLanguages
}
