import gql from 'graphql-tag'
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
  ORDERS_UPDATE: 'BOOTSTRAPPER_ORDERS_UPDATE',
  ORDERS_DONE: 'BOOTSTRAPPER_ORDERS_DONE',
  CUSTOMERS_UPDATE: 'BOOTSTRAPPER_CUSTOMERS_UPDATE',
  CUSTOMERS_DONE: 'BOOTSTRAPPER_CUSTOMERS_DONE',
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
    | 'CANNOT_HANDLE_ITEM_RELATION'
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
  multilingual?: boolean
  experimental: {
    parallelize?: boolean // Deprecated
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
  itemCataloguePathToIDMap: Map<string, ItemAndParentId>
  itemExternalReferenceToIDMap: Map<string, ItemAndParentId>
  itemVersions: Map<string, ItemVersionsForLanguages>
  fileUploader: FileUploadManager
  uploadFileFromUrl: (url: string) => Promise<RemoteFileUploadResult | null>
  callPIM: (props: IcallAPI) => Promise<IcallAPIResult>
  callCatalogue: (props: IcallAPI) => Promise<IcallAPIResult>
  callSearch: (props: IcallAPI) => Promise<IcallAPIResult>
  callOrders: (props: IcallAPI) => Promise<IcallAPIResult>
  emitError: (error: string) => void
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
  status: 'not-started' | 'working' | 'done'
  failCount?: number
  resolve?: (result: RemoteFileUploadResult | null) => void
  reject?: (r: any) => void
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
      item.status = 'done'

      // Remove unused fields to reduce memory footprint
      item.resolve = undefined
      item.reject = undefined
    }

    item.status = 'working'

    try {
      const result = await remoteFileUpload({
        fileUrl: item.url,
        context: this.context,
      })
      item.resolve?.(result)
      removeWorker(item)
    } catch (e: any) {
      if (!item.failCount) {
        item.failCount = 1
      }

      // Allow for 3 fails
      const isLastAttempt = item.failCount === 3

      if (isLastAttempt) {
        const msg = e.message || JSON.stringify(e, null, 1)
        item.reject?.(msg)
        removeWorker(item)
        // this.context.emitError(msg)
      } else {
        item.failCount++
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

    result.catch((e) => {})

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
    query: gql`
      query GET_ITEM_VERSION_INFO($itemId: ID!, $language: String!) {
        item {
          published: get(
            id: $itemId
            language: $language
            versionLabel: published
          ) {
            version {
              createdAt
            }
          }
          draft: get(id: $itemId, language: $language, versionLabel: draft) {
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

export type ItemVersionsForLanguages = Record<string, ItemVersionDescription>

export async function getItemVersionsForLanguages({
  languages,
  itemId,
  context,
}: IgetItemVersionsForLanguages): Promise<ItemVersionsForLanguages> {
  const existing = context.itemVersions.get(itemId)
  if (existing) {
    return existing
  }

  const itemVersionsForLanguages: ItemVersionsForLanguages = {}

  await Promise.all(
    languages.map(async (language) => {
      itemVersionsForLanguages[language] = await getItemVersionInfo({
        language,
        itemId,
        context,
      })
    })
  )

  context.itemVersions.set(itemId, itemVersionsForLanguages)

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

export function removeUnwantedFieldsFromThing(
  thing: any,
  fieldsToRemove: string[]
) {
  function handleThing(thing: any) {
    if (Array.isArray(thing)) {
      thing.forEach(handleThing)
    } else if (thing && typeof thing === 'object') {
      try {
        fieldsToRemove.forEach((field) => delete thing[field])

        Object.values(thing).forEach(handleThing)
      } catch (e) {
        console.log(e)
      }
    }
  }

  handleThing(thing)

  return thing
}
