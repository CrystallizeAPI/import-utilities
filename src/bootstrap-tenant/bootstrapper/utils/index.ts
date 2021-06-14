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

export function uploadFileFromUrl(
  url: string
): Promise<RemoteFileUploadResult> {
  return remoteFileUpload(url, getTenantId())
}

export function validShapeIdentifier(str: string) {
  if (str.length <= 24) return str

  const validIdentifier = str.substr(0, 11) + '-' + str.substr(str.length - 12)
  console.log(`Truncating shape identifier "${str}" to "${validIdentifier}"`)

  return validIdentifier
}
