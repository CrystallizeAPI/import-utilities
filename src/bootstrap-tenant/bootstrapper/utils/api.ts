import { DocumentNode } from 'graphql'
import { request } from 'graphql-request'
import { v4 as uuid } from 'uuid'
import { LogLevel } from './types'

export interface IcallAPI {
  query: DocumentNode | string
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

type RequestStatus = 'ok' | 'error'

export class ApiManager {
  queue: QueuedRequest[] = []
  url: string = ''
  maxWorkers: number = 1
  errorNotifier: errorNotifierFn
  logLevel: LogLevel = 'silent'
  CRYSTALLIZE_ACCESS_TOKEN_ID = ''
  CRYSTALLIZE_ACCESS_TOKEN_SECRET = ''
  CRYSTALLIZE_STATIC_AUTH_TOKEN = ''

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

  push = (props: IcallAPI) => {
    return new Promise<IcallAPIResult>((resolve) => {
      this.queue.push({
        id: uuid(),
        resolve,
        props,
        failCount: 0,
      })
    })
  }

  /**
   * Adjust the maximum amount of workers up and down depending on
   * the amount of errors coming from the API
   */
  lastRequestsStatuses: RequestStatus[] = []
  recordRequestStatus = (status: RequestStatus) => {
    this.lastRequestsStatuses.unshift(status)

    const maxRequests = 20

    const errors = this.lastRequestsStatuses.filter((r) => r === 'error')
      ?.length
    if (errors > 5) {
      this.maxWorkers--
      this.lastRequestsStatuses.length = 0
    } else if (errors === 0 && this.lastRequestsStatuses.length > maxRequests) {
      this.maxWorkers++
      this.lastRequestsStatuses.length = 0
    }

    const maxWorkers = 5
    if (this.maxWorkers < 1) {
      this.maxWorkers = 1
    } else if (this.maxWorkers > maxWorkers) {
      this.maxWorkers = maxWorkers
    }

    if (this.lastRequestsStatuses.length > maxRequests) {
      this.lastRequestsStatuses.length = maxRequests
    }
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
      const response = await request(
        this.url,
        item.props.query,
        item.props.variables,
        {
          'X-Crystallize-Access-Token-Id': this.CRYSTALLIZE_ACCESS_TOKEN_ID,
          'X-Crystallize-Access-Token-Secret': this
            .CRYSTALLIZE_ACCESS_TOKEN_SECRET,
          'X-Crystallize-Static-Auth-Token': this.CRYSTALLIZE_STATIC_AUTH_TOKEN,
        }
      )

      resolveWith({
        data: response,
      })
    } catch (e) {
      console.error(e)
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

      this.recordRequestStatus('error')

      await sleep(item.failCount * 5000)

      if (item.failCount > 5) {
        if (this.logLevel === 'verbose') {
          console.log(errorString)
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
      this.recordRequestStatus('ok')
      resolveWith(json)
    }
  }
}

export function createAPICaller({
  uri,
  errorNotifier,
  logLevel,
}: {
  uri: string
  errorNotifier: errorNotifierFn
  logLevel?: LogLevel
}) {
  const manager = new ApiManager(uri)
  manager.errorNotifier = errorNotifier
  if (logLevel) {
    manager.logLevel = logLevel
  }

  return manager
}
