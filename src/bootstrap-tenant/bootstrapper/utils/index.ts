import { SubscriptionPlan } from '../../../generated/graphql'
import { Shape } from '../../../types'
import {
  JSONLanguage,
  JSONPriceVariant,
  JSONVatType,
  JSONStockLocation,
} from '../../json-spec'
import { IcallAPI, IcallAPIResult } from './api'
import { ItemAndParentId } from './get-item-id'
import { remoteFileUpload, RemoteFileUploadResult } from './remote-file-upload'
import { LogLevel } from './types'

export * from './api'
export * from './get-item-id'

export const EVENT_NAMES = {
  DONE: 'BOOTSTRAPPER_DONE',
  ERROR: 'BOOTSTRAPPER_ERROR',
  STATUS_UPDATE: 'BOOTSTRAPPER_STATUS_UPDATE',
  SHAPES_UPDATE: 'BOOTSTRAPPER_SHAPES_UPDATE',
  SHAPES_DONE: 'BOOTSTRAPPER_SHAPES_DONE',
  PRICE_VARIANTS_UPDATE: 'BOOTSTRAPPER_PRICE_VARIANTS_UPDATE',
  PRICE_VARIANTS_DONE: 'BOOTSTRAPPER_PRICE_VARIANTS_DONE',
  SUBSCRIPTION_PLANS_UPDATE: 'BOOTSTRAPPER_SUBSCRIPTION_PLANS_UPDATE',
  SUBSCRIPTION_PLANS_DONE: 'BOOTSTRAPPER_SUBSCRIPTION_PLANS_DONE',
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
  STOCK_LOCATIONS_UPDATE: 'BOOTSTRAPPER_STOCK_LOCATIONS_UPDATE',
  STOCK_LOCATIONS_DONE: 'BOOTSTRAPPER_STOCK_LOCATIONS_DONE',
}

export interface AreaWarning {
  message: string
  code:
    | 'FFMPEG_UNAVAILABLE'
    | 'UPLOAD_FAILED'
    | 'SHAPE_ID_TRUNCATED'
    | 'CANNOT_HANDLE_ITEM'
    | 'CANNOT_HANDLE_PRODUCT'
    | 'OTHER'
}

export interface AreaUpdate {
  progress?: number
  message?: string
  warning?: AreaWarning
}

export interface Config {
  itemTopics?: 'amend' | 'replace'
  itemPublish?: 'publish' | 'auto'
  logLevel?: LogLevel
  experimental: {
    parallelize?: boolean
  }
}

export interface BootstrapperContext {
  tenantId: string
  tenantIdentifier: string
  defaultLanguage: JSONLanguage
  languages: JSONLanguage[]
  shapes?: Shape[]
  priceVariants?: JSONPriceVariant[]
  subscriptionPlans?: SubscriptionPlan[]
  vatTypes?: JSONVatType[]
  config: Config
  useReferenceCache: boolean
  stockLocations?: JSONStockLocation[]
  itemJSONCataloguePathToIDMap: Map<string, ItemAndParentId>
  fileUploader: FileUploadManager
  uploadFileFromUrl: (url: string) => Promise<RemoteFileUploadResult | null>
  callPIM: (props: IcallAPI) => Promise<IcallAPIResult>
  callCatalogue: (props: IcallAPI) => Promise<IcallAPIResult>
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

export class FileUploadManager {
  uploads: uploadFileRecord[] = []
  maxWorkers: number = 2
  workerQueue: fileUploadQueueItem[] = []
  context?: BootstrapperContext

  constructor() {
    setInterval(() => this.work(), 5)
  }

  async work() {
    if (!this.context) {
      return
    }

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

    const removeWorker = (item: fileUploadQueueItem) => {
      const index = this.workerQueue.findIndex((q) => q === item)
      this.workerQueue.splice(index, 1)
    }

    item.status = 'working'

    try {
      const result = await remoteFileUpload(item.url, this.context)
      item.resolve(result)
      removeWorker(item)
    } catch (e) {
      if (!item.failCount) {
        item.failCount = 0
      }
      item.failCount++

      // Allow for 5 fails
      if (item.failCount > 5) {
        item.reject(e)
        removeWorker(item)
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

interface IgetItemVersionInfo {
  language: string
  itemId: string
  context: BootstrapperContext
}

export enum ItemVersionDescription {
  Unpublished,
  StaleVersionPublished,
  Published,
}

async function getItemVersionInfo({
  language,
  itemId,
  context,
}: IgetItemVersionInfo): Promise<ItemVersionDescription> {
  const result = await context.callPIM({
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
  context: BootstrapperContext
}

export async function getItemVersionsForLanguages({
  languages,
  itemId,
  context,
}: IgetItemVersionsForLanguages): Promise<
  Record<string, ItemVersionDescription>
> {
  const itemVersionsForLanguages: Record<string, ItemVersionDescription> = {}

  await Promise.all(
    languages.map(async (language) => {
      itemVersionsForLanguages[language] = await getItemVersionInfo({
        language,
        itemId,
        context,
      })
    })
  )

  return itemVersionsForLanguages
}

export function chunkArray<T>({
  array,
  chunkSize,
}: {
  array: T[]
  chunkSize: number
}): [T[]] {
  return array.reduce(
    (resultArray: [T[]], item, index) => {
      const chunkIndex = Math.floor(index / chunkSize)

      if (!resultArray[chunkIndex]) {
        resultArray.push([])
      }

      resultArray[chunkIndex].push(item)

      return resultArray
    },
    [[]]
  )
}
