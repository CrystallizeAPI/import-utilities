import gql from 'graphql-tag'
import { MassClientInterface } from '@crystallize/js-api-client'
import { Shape } from '@crystallize/schema/shape'
import { SubscriptionPlan } from '../../../generated/graphql'
import {
  JSONLanguage,
  JSONPriceVariant,
  JSONVatType,
  JSONStockLocation,
  JSONItem,
} from '../../json-spec'
import { IcallAPI, IcallAPIResult } from './api'
import { ItemAndParentId } from './get-item-id'
import { remoteFileUpload, RemoteFileUploadResult } from './remote-file-upload'
import { LogLevel } from './types'
import { KillableWorker } from './killable-worker'

export * from './api'
export * from './get-item-id'

export const EVENT_NAMES = {
  DONE: 'BOOTSTRAPPER_DONE',
  ERROR: 'BOOTSTRAPPER_ERROR',
  WARNING: 'BOOTSTRAPPER_WARNING',
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
  ITEM_CREATED: 'BOOTSTRAPPER_ITEM_CREATED',
  ITEM_UPDATED: 'BOOTSTRAPPER_ITEM_UPDATED',
  ITEM_PUBLISHED: 'BOOTSTRAPPER_ITEM_PUBLISHED',
  ITEMS_UPDATE: 'BOOTSTRAPPER_ITEMS_UPDATE',
  ITEMS_DONE: 'BOOTSTRAPPER_ITEMS_DONE',
  ORDERS_UPDATE: 'BOOTSTRAPPER_ORDERS_UPDATE',
  ORDERS_DONE: 'BOOTSTRAPPER_ORDERS_DONE',
  CUSTOMERS_UPDATE: 'BOOTSTRAPPER_CUSTOMERS_UPDATE',
  CUSTOMERS_DONE: 'BOOTSTRAPPER_CUSTOMERS_DONE',
  STOCK_LOCATIONS_UPDATE: 'BOOTSTRAPPER_STOCK_LOCATIONS_UPDATE',
  STOCK_LOCATIONS_DONE: 'BOOTSTRAPPER_STOCK_LOCATIONS_DONE',
}

export type EVENT_NAMES_KEYS = keyof typeof EVENT_NAMES
export type EVENT_NAMES_VALUES = typeof EVENT_NAMES[EVENT_NAMES_KEYS]

export interface AreaWarning {
  message: string
  code: 'FFMPEG_UNAVAILABLE' | 'SHAPE_ID_TRUNCATED' | 'OTHER'
}

export interface AreaError {
  message: string
  code:
    | 'UPLOAD_FAILED'
    | 'SHAPE_ID_MISSING'
    | 'CANNOT_HANDLE_ITEM'
    | 'CANNOT_HANDLE_PRODUCT'
    | 'CANNOT_HANDLE_ITEM_RELATION'
    | 'PARENT_FOLDER_NOT_FOUND'
    | 'OTHER'
  item?: JSONItem
}

export interface AreaUpdate {
  progress?: number
  message?: string
  warning?: AreaWarning
  error?: AreaError
}

export interface Config {
  itemTopics?: 'amend' | 'replace'
  itemPublish?: 'publish' | 'auto'
  shapeComponents?: 'amend' | 'replace'
  logLevel?: LogLevel
  multilingual?: boolean
  experimental: {
    parallelize?: boolean // Deprecated
  }
}

export type BootstrapperError = {
  willRetry: boolean
  error: string
  areaError?: AreaError
  type?: 'error' | 'warning'
}

export type BootstrapperWarning = AreaWarning

export interface BootstrapperContext {
  client?: MassClientInterface
  tenantId: string
  tenantIdentifier: string
  fallbackFolderId: string
  defaultLanguage: string
  targetLanguage?: string
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
  topicPathToIDMap: Map<string, string>
  itemVersions: Map<string, ItemVersionsForLanguages>
  fileUploader: FileUploadManager
  uploadFileFromUrl: (
    url: string,
    fileName?: string
  ) => Promise<RemoteFileUploadResult | null>
  callPIM: (props: IcallAPI) => Promise<IcallAPIResult>
  callCatalogue: (props: IcallAPI) => Promise<IcallAPIResult>
  callSearch: (props: IcallAPI) => Promise<IcallAPIResult>
  callOrders: (props: IcallAPI) => Promise<IcallAPIResult>
  emit: (name: EVENT_NAMES_VALUES, message: any) => void
}

export type ItemEventPayload = {
  id: string
  language: string
  name: string
}

export type ItemEventPayloadCreatedOrUpdated = ItemEventPayload & {
  shape: {
    type: 'product' | 'document' | 'folder'
    identifier: string
  }
}
// Lets keep this old type in order to not break things.
export type ItemCreatedOrUpdated = ItemEventPayloadCreatedOrUpdated

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
  fileName?: string
  result: Promise<RemoteFileUploadResult | null>
}

type fileUploadQueueItem = {
  url: string
  fileName?: string
  status: 'not-started' | 'working' | 'done'
  failCount?: number
  resolve?: (result: RemoteFileUploadResult | null) => void
  reject?: (r: any) => void
}

export class FileUploadManager extends KillableWorker {
  uploads: uploadFileRecord[] = []
  maxWorkers = 2
  workerQueue: fileUploadQueueItem[] = []
  context?: BootstrapperContext

  constructor() {
    super()
    this._workIntervalId = setInterval(() => this.work(), 5)
  }

  async work() {
    if (!this.context || this.isKilled) {
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
        fileName: item.fileName,
        context: this.context,
      })

      item.resolve?.(result)
      removeWorker(item)
    } catch (e: any) {
      if (!item.failCount) {
        item.failCount = 1
      }

      // Allow for 3 fails
      let isLastAttempt = item.failCount === 3

      const fileNotFound = 'statusCode' in e && e.statusCode === 404

      if (fileNotFound) {
        isLastAttempt = true
      }

      if (isLastAttempt) {
        const msg = fileNotFound
          ? `Got 404 for file "${item.url}"`
          : e.message || JSON.stringify(e, null, 1)
        item.reject?.(msg)
        removeWorker(item)
      } else {
        item.failCount++
        item.status = 'not-started'
      }
    }
  }

  uploadFromUrl(url: string, fileName?: string) {
    const existing = this.uploads.find((u) => u.url === url)
    if (existing) {
      return existing.result
    }

    const result = this.scheduleUpload(url, fileName)

    result.catch(() => ({}))

    this.uploads.push({
      url,
      fileName,
      result,
    })

    return result
  }

  scheduleUpload(
    url: string,
    fileName?: string
  ): Promise<RemoteFileUploadResult | null> {
    return new Promise((resolve, reject) => {
      this.workerQueue.push({
        url,
        fileName,
        status: 'not-started',
        resolve,
        reject,
      })
    })
  }
}

export function validShapeIdentifier(
  shapeIdentifier: string,
  onUpdate: (t: AreaUpdate) => any
) {
  if (shapeIdentifier.length <= 64) return shapeIdentifier

  const validIdentifier =
    shapeIdentifier.substring(0, 31) +
    '-' +
    shapeIdentifier.substring(shapeIdentifier.length - 32)
  onUpdate({
    warning: {
      code: 'SHAPE_ID_TRUNCATED',
      message: `Truncating shape identifier "${shapeIdentifier}" to "${validIdentifier}"`,
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

export async function getTenantRootItemId(
  context: BootstrapperContext
): Promise<string> {
  const tenantId = context.tenantId
  const r = await context.callPIM({
    query: gql`
      query GET_TENANT_ROOT_ITEM_ID($tenantId: ID!) {
        tenant {
          get(id: $tenantId) {
            rootItemId
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.tenant?.get?.rootItemId || ''
}
