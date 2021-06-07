import fetch from 'node-fetch'

import {
  Language,
  PriceVariant,
  Shape,
  JSONTranslation,
  VatType,
} from '../json-spec'

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
  defaultLanguage: Language
  languages: Language[]
  shapes?: Shape[]
  priceVariants?: PriceVariant[]
  vatTypes?: VatType[]
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export interface IcallPIM {
  query: string
  variables?: any
}

export interface IcallPIMResult {
  data: null | Record<string, any>
  errors?: Record<string, any>[]
}

let tenantId = ''
export function setTenantId(id: string) {
  tenantId = id
}

export function getTenantId() {
  return tenantId
}

let CRYSTALLIZE_ACCESS_TOKEN_ID = ''
let CRYSTALLIZE_ACCESS_TOKEN_SECRET = ''

export function setAccessTokens(id?: string, secret?: string) {
  if (!id) {
    throw new Error('Missing CRYSTALLIZE_ACCESS_TOKEN_ID')
  }
  if (!secret) {
    throw new Error('Missing CRYSTALLIZE_ACCESS_TOKEN_SECRET')
  }
  CRYSTALLIZE_ACCESS_TOKEN_ID = id
  CRYSTALLIZE_ACCESS_TOKEN_SECRET = secret
}

interface QueuedRequest {
  props: IcallPIM
  resolve: (value: IcallPIMResult) => void
}

// Only allow one request at a time to PIM
class PIMApiManager {
  queue: QueuedRequest[] = []
  status: 'idle' | 'working' = 'idle'

  constructor() {
    setInterval(() => this.work(), 25)
  }

  push(props: IcallPIM): Promise<IcallPIMResult> {
    return new Promise((resolve) => {
      this.queue.push({
        resolve,
        props,
      })
    })
  }

  async work() {
    if (this.status === 'working' || this.queue.length === 0) {
      return
    }
    this.status = 'working'

    const item = this.queue[0]

    const response = await fetch(
      'https://pim-dev.crystallize.digital/graphql',
      {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'X-Crystallize-Access-Token-Id': CRYSTALLIZE_ACCESS_TOKEN_ID,
          'X-Crystallize-Access-Token-Secret': CRYSTALLIZE_ACCESS_TOKEN_SECRET,
        },
        body: JSON.stringify(item.props),
      }
    )

    const json: IcallPIMResult = await response.json()

    item.resolve(json)

    // Remove item from queue
    this.queue.splice(0, 1)

    // Always sleep for some time between requests
    await sleep(250)

    this.status = 'idle'
  }
}

const MyPIMApiManager = new PIMApiManager()

export function callPIM(props: IcallPIM) {
  return MyPIMApiManager.push(props)
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
