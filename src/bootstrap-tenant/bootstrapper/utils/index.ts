import { resolve } from 'path/posix'
import {
  JSONLanguage,
  JSONPriceVariant,
  Shape,
  JSONVatType,
} from '../../json-spec'
import { remoteFileUpload, RemoteFileUploadResult } from './remote-file-upload'

export * from './api'

export const EVENT_NAMES = {
  DONE: 'BOOTSTRAPPER_DONE',
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
  ITEMS_UPDATE: 'BOOTSTRAPPER_ITEMS_UPDATE',
  ITEMS_DONE: 'BOOTSTRAPPER_ITEMS_DONE',
}

export interface StepStatus {
  done: boolean
  message?: string
}

export interface TenantContext {
  defaultLanguage: JSONLanguage
  languages: JSONLanguage[]
  shapes?: Shape[]
  priceVariants?: JSONPriceVariant[]
  vatTypes?: JSONVatType[]
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
  result: Promise<RemoteFileUploadResult>
}

type fileUploadQueueItem = {
  url: string
  status: string
  resolve: (result: RemoteFileUploadResult) => void
  reject: (r: any) => void
}

class FileUploadManager {
  uploads: uploadFileRecord[] = []
  maxWorkers: number = 5
  workerQueue: fileUploadQueueItem[] = []

  constructor() {
    setInterval(() => this.work(), 5)
  }

  async work() {
    const currentWorkers = this.workerQueue.filter((q) => q.status === 'working').length
    if (currentWorkers === this.maxWorkers) {
      return
    }
    
    const item = this.workerQueue.find((q) => q.status === 'not-started')
    if (!item) {
      return
    }

    item.status = 'working';

    try {
      const result = await remoteFileUpload(item.url, getTenantId());
      item.resolve(result);
      item.status = 'done';
    } catch (e) {
      debugger;
      item.reject(e)
      item.status = 'not-started';
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

  scheduleUpload(url: string): Promise<RemoteFileUploadResult> {
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

const fileUploader = new FileUploadManager()

export function uploadFileFromUrl(
  url: string
): Promise<RemoteFileUploadResult> {
  return fileUploader.uploadFromUrl(url)
}

export function validShapeIdentifier(str: string) {
  if (str.length <= 24) return str

  const validIdentifier = str.substr(0, 11) + '-' + str.substr(str.length - 12)
  console.log(`Truncating shape identifier "${str}" to "${validIdentifier}"`)

  return validIdentifier
}
