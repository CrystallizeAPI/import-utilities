import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'

let CRYSTALLIZE_ACCESS_TOKEN_ID = ''
let CRYSTALLIZE_ACCESS_TOKEN_SECRET = ''
let CRYSTALLIZE_TENANT_IDENTIFIER = ''

export function setTenantIdentifier(identifier: string) {
  CRYSTALLIZE_TENANT_IDENTIFIER = identifier
}

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

export interface IcallAPI {
  query: string
  variables?: any
}

export interface IcallAPIResult {
  data: null | Record<string, any>
  errors?: Record<string, any>[]
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

interface QueuedRequest {
  id: string
  props: IcallAPI
  failCount: number
  resolve: (value: IcallAPIResult) => void
  working?: boolean
}

class ApiManager {
  queue: QueuedRequest[] = []
  url: string = ''
  maxWorkers: number = 3

  constructor(url: string) {
    this.url = url
    setInterval(() => this.work(), 25)
  }

  push(props: IcallAPI): Promise<IcallAPIResult> {
    return new Promise((resolve) => {
      this.queue.push({
        id: uuid(),
        resolve,
        props,
        failCount: 0,
      })
    })
  }

  async work() {
    const currentWorkers = this.queue.filter((q) => q.working).length
    if (currentWorkers === this.maxWorkers) {
      return
    }

    const item = this.queue.find((q) => !q.working)
    if (!item) {
      return
    }

    item.working = true

    let json: IcallAPIResult | undefined

    // Always sleep for some time between requests
    await sleep(50)

    let errorString: string = ''

    try {
      const response = await fetch(this.url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'X-Crystallize-Access-Token-Id': CRYSTALLIZE_ACCESS_TOKEN_ID,
          'X-Crystallize-Access-Token-Secret': CRYSTALLIZE_ACCESS_TOKEN_SECRET,
        },
        body: JSON.stringify(item.props),
      })

      json = await response.json()

      // When failing, try again
      if (!response.ok) {
        errorString = JSON.stringify(json, null, 1)
      }
    } catch (e) {
      errorString = JSON.stringify(e, null, 1)
    }

    if (json?.errors) {
      errorString = JSON.stringify(json.errors, null, 1)
    }
    if (errorString || !json) {
      item.failCount++

      if (item.failCount > 5) {
        console.log(JSON.stringify(item.props, null, 1))
        console.log(errorString)

        /**
         * Reduce the amount of workers to lessen the
         * toll on the API
         */
        this.maxWorkers--
        if (this.maxWorkers < 1) {
          this.maxWorkers = 1
        }
      }
      item.working = false
    } else {
      item.resolve(json)

      // Remove item from queue
      this.queue.splice(
        this.queue.findIndex((q) => q.id === item.id),
        1
      )
    }
  }
}

const MyPIMApiManager = new ApiManager('https://pim.crystallize.com/graphql')

export function callPIM(props: IcallAPI) {
  return MyPIMApiManager.push(props)
}

let MyCatalogueApiManager: ApiManager
let MyCatalogueApiManagerTenantIdentifier = ''
export function callCatalogue(props: IcallAPI) {
  if (
    !MyCatalogueApiManager ||
    MyCatalogueApiManagerTenantIdentifier !== CRYSTALLIZE_TENANT_IDENTIFIER
  ) {
    MyCatalogueApiManagerTenantIdentifier = CRYSTALLIZE_TENANT_IDENTIFIER
    MyCatalogueApiManager = new ApiManager(
      `https://api.crystallize.com/${CRYSTALLIZE_TENANT_IDENTIFIER}/catalogue`
    )
  }
  return MyCatalogueApiManager.push(props)
}
