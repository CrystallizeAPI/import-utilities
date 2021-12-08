import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'
import { LogLevel } from './types'

let CRYSTALLIZE_ACCESS_TOKEN_ID = ''
let CRYSTALLIZE_ACCESS_TOKEN_SECRET = ''
let CRYSTALLIZE_STATIC_AUTH_TOKEN = ''
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

export function setStaticToken(token: string) {
  CRYSTALLIZE_STATIC_AUTH_TOKEN = token
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

type errorNotifierFn = (args: { error: string }) => void

class ApiManager {
  queue: QueuedRequest[] = []
  url: string = ''
  maxWorkers: number = 5
  errorNotifier: errorNotifierFn
  logLevel: LogLevel = 'silent'

  constructor(url: string) {
    this.url = url
    this.errorNotifier = () => null

    setInterval(() => this.work(), 5)
  }

  setErrorNotifier(fn: errorNotifierFn) {
    this.errorNotifier = fn
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level
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
    await sleep(10)

    let errorString: string = ''

    const resolveWith = (response: IcallAPIResult) => {
      if (item) {
        item.resolve(response)

        // Remove item from queue
        this.queue.splice(
          this.queue.findIndex((q) => q.id === item.id),
          1
        )
      }
    }

    try {
      if (this.logLevel === 'verbose') {
        console.log(JSON.stringify(item.props, null, 1))
      }
      const response = await fetch(this.url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'X-Crystallize-Access-Token-Id': CRYSTALLIZE_ACCESS_TOKEN_ID,
          'X-Crystallize-Access-Token-Secret': CRYSTALLIZE_ACCESS_TOKEN_SECRET,
          'X-Crystallize-Static-Auth-Token': CRYSTALLIZE_STATIC_AUTH_TOKEN,
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

    // There are errors in the payload
    if (json?.errors) {
      errorString = JSON.stringify(
        {
          ...item.props,
          apiReponse: json.errors,
        },
        null,
        1
      )

      this.errorNotifier({
        error: errorString,
      })

      resolveWith({
        data: null,
        errors: [{ error: errorString }],
      })
    } else if (errorString) {
      item.failCount++

      await sleep(item.failCount * 1000)

      if (item.failCount > 5) {
        if (this.logLevel === 'verbose') {
          console.log(errorString)
        }

        /**
         * Reduce the amount of workers to lessen the
         * toll on the API
         */
        this.maxWorkers--
        if (this.maxWorkers < 1) {
          this.maxWorkers = 1
        }
      }

      // Stop if there are too many errors
      if (item.failCount > 10) {
        this.errorNotifier({ error: errorString })
        resolveWith({
          data: null,
          errors: [{ error: errorString }],
        })
      }
      item.working = false
    } else if (json) {
      resolveWith(json)
    }
  }
}

const urls = {
  catalogue:
    process.env.CRYSTALLIZE_ENV === 'dev'
      ? 'api-dev.crystallize.digital'
      : 'api.crystallize.com',
  pim:
    process.env.CRYSTALLIZE_ENV === 'dev'
      ? 'pim-dev.crystallize.digital'
      : 'pim.crystallize.com',
}

const MyPIMApiManager = new ApiManager(`https://${urls.pim}/graphql`)

export function callPIM(props: IcallAPI) {
  return MyPIMApiManager.push(props)
}

export function setErrorNotifier(fn: errorNotifierFn) {
  MyPIMApiManager.setErrorNotifier(fn)
}
export function setLogLevel(level?: LogLevel) {
  if (level) {
    MyPIMApiManager.setLogLevel(level)
  }
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
      `https://${urls.catalogue}/${CRYSTALLIZE_TENANT_IDENTIFIER}/catalogue`
    )
  }

  if (MyCatalogueApiManager.errorNotifier !== MyPIMApiManager.errorNotifier) {
    MyCatalogueApiManager.errorNotifier = MyPIMApiManager.errorNotifier
  }
  if (MyCatalogueApiManager.logLevel !== MyPIMApiManager.logLevel) {
    MyCatalogueApiManager.setLogLevel(MyPIMApiManager.logLevel)
  }

  return MyCatalogueApiManager.push(props)
}
