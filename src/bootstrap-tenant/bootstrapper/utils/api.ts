import { DocumentNode } from 'graphql'
import { request } from 'graphql-request'
import { v4 as uuid } from 'uuid'
import { BootstrapperError } from '.'
import { KillableWorker } from './killable-worker'
import { LogLevel } from './types'

export interface IcallAPI {
  query: DocumentNode | string
  variables?: any
  suppressErrors?: boolean
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
  partOfRateLimitedGroup?: boolean
}

type errorNotifierFn = (args: BootstrapperError) => void

type RequestStatus = {
  date: Date
  status: 'ok' | 'error'
}

export class ApiManager extends KillableWorker {
  queue: QueuedRequest[] = []
  url = ''
  currentWorkers = 1
  errorNotifier: errorNotifierFn
  logLevel: LogLevel = 'silent'
  CRYSTALLIZE_ACCESS_TOKEN_ID = ''
  CRYSTALLIZE_ACCESS_TOKEN_SECRET = ''
  CRYSTALLIZE_STATIC_AUTH_TOKEN = ''
  CRYSTALLIZE_SESSION_ID = ''

  #MAX_WORKERS = 12

  constructor(url: string) {
    super()
    this.url = url
    this.errorNotifier = () => null

    this._workIntervalId = setInterval(() => this.work(), 1)
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

  private backoffOnRateLimit() {
    // Mark all in-flight requests as being part of a rate limited group
    this.queue
      .filter((q) => q.working)
      .forEach((q) => {
        q.partOfRateLimitedGroup = true
      })

    // Back off, slice current workers in half
    this.currentWorkers = Math.floor(this.currentWorkers / 2)
    if (this.currentWorkers < 1) {
      this.currentWorkers = 1
    }
  }

  private rateLimitLookbackWindowInMinutes = 5
  private rateLimitAvgReqPrSeconds = 15

  /**
   * Determine if there is a chance for this client alone
   * to go over the rate limit. Since the API rate limiter
   * is IP based, there might be other clients affecting the
   * rate limit, so this measure here is not enough on its own.
   */
  private clientOverRateLimit() {
    if (this.lastRequestsStatuses.length === 0) {
      return false
    }

    const now = new Date()

    // Get the oldest request status (will always be the last one in the array)
    const oldestRequestRecord =
      this.lastRequestsStatuses[this.lastRequestsStatuses.length - 1]

    const secondsInWindow =
      (now.getTime() - oldestRequestRecord.date.getTime()) / 1000
    const reqsInWindow =
      this.lastRequestsStatuses.length +
      this.queue.filter((i) => i.working).length
    const avgReqsPrSecond = reqsInWindow / secondsInWindow

    // Let's stay well beyond the api rate limit
    const localRateLimitReducer = 1

    const overRateLimit =
      secondsInWindow > 20 &&
      avgReqsPrSecond >= this.rateLimitAvgReqPrSeconds - localRateLimitReducer

    return overRateLimit
  }

  /**
   * Keep a record of the last requests, so that we can adjust
   * the number of requests to the API. Factors that can change
   * the number of current workers are:
   * - Network congestion between this client and the API
   * - Crystallize API rate limiting
   * - Local client errors
   * - Crystallize API errors
   */
  private lastRequestsStatuses: RequestStatus[] = []
  private recordRequestStatus = (status: RequestStatus['status']) => {
    const now = new Date()
    this.lastRequestsStatuses.unshift({ date: now, status })

    const errors = this.lastRequestsStatuses.filter(
      (r) => r.status === 'error'
    )?.length
    if (errors > 5) {
      this.currentWorkers--
    } else if (errors === 0) {
      this.currentWorkers++
    }

    if (this.currentWorkers < 1) {
      this.currentWorkers = 1
    } else if (this.currentWorkers > this.#MAX_WORKERS) {
      this.currentWorkers = this.#MAX_WORKERS
    }

    // Keep the request statuses for rate limit lookback window
    const rateLimitLookbackWindowStart = new Date(now.getTime())
    rateLimitLookbackWindowStart.setMinutes(
      now.getMinutes() - this.rateLimitLookbackWindowInMinutes
    )

    this.lastRequestsStatuses = this.lastRequestsStatuses.filter(
      (s) => s.date > rateLimitLookbackWindowStart
    )
  }

  useSingleWorker() {
    this.#MAX_WORKERS = 1
    this.currentWorkers = 1
  }

  async work() {
    if (this.isKilled || this.isPaused || this.queue.length === 0) {
      return
    }
    if (this.clientOverRateLimit()) {
      return
    }

    const currentWorkers = this.queue.filter((q) => q.working).length
    if (currentWorkers === this.currentWorkers) {
      return
    }
    // Get the first none-working item in the queue
    const item = this.queue.find((q) => !q.working)
    if (!item) {
      return
    }

    item.working = true

    let queryError = ''
    let otherError = ''
    let serverError = ''

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

    let response: any
    try {
      if (this.logLevel === 'verbose') {
        const { query, ...rest } = item.props

        let printout = item.props
        if (typeof query !== 'string' && query.loc && query.loc.source.body) {
          printout = {
            query: query.loc.source.body,
            ...rest,
          }
        }

        console.log(JSON.stringify(printout, null, 1))
      }
      response = await request(
        this.url,
        item.props.query,
        item.props.variables,
        this.CRYSTALLIZE_SESSION_ID
          ? {
              Cookie: `connect.sid=${this.CRYSTALLIZE_SESSION_ID}`,
            }
          : {
              'X-Crystallize-Access-Token-Id': this.CRYSTALLIZE_ACCESS_TOKEN_ID,
              'X-Crystallize-Access-Token-Secret':
                this.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
              'X-Crystallize-Static-Auth-Token':
                this.CRYSTALLIZE_STATIC_AUTH_TOKEN,
            }
      )

      if (this.logLevel === 'verbose') {
        console.log(JSON.stringify(response, null, 1))
      }
    } catch (e: any) {
      if (this.logLevel === 'verbose') {
        console.log(e)
      }

      // Rate limited
      if (e.response?.status === 429) {
        /**
         * Invoke the backoff mechanism, unless the request is already
         * part of a rate limted group, in which case the backoff has
         * already been set in motion.
         */
        if (!item.partOfRateLimitedGroup) {
          this.backoffOnRateLimit()

          if (!item.props.suppressErrors) {
            this.errorNotifier({
              willRetry: true,
              error: `Oh dear, you've been temporarily rate limited. Resuming operations in a short while.`,
            })
          }

          // Pause for 30 seconds, then clear the partOfRateLimitedGroup flag
          this.pauseFor(30000, () => {
            this.queue.forEach((item) => {
              item.partOfRateLimitedGroup = false
            })
          })
        }

        this.recordRequestStatus('error')

        item.working = false
        return
      }

      // Network/system errors
      if (e?.type === 'system') {
        otherError = e.message || JSON.stringify(e, null, 1)

        if (!item.props.suppressErrors) {
          this.errorNotifier({
            willRetry: true,
            error: otherError,
          })
        }
      } else {
        /**
         * The API might stumble and throw an internal error "reason: socket hang up".
         * Deal with this as "serverError" even though the request comes back with a
         * status 200
         */
        if (
          e.message.includes('reason: socket hang up') ||
          e.message.includes('ECONNRESET') ||
          e.message.includes('502 Bad Gateway')
        ) {
          serverError = e.message
        } else {
          queryError = e.message
        }
      }
    }

    if (otherError || serverError) {
      /**
       * When server errors or other errors occur, we want to not discard the item
       * that is being worked on, but rather wait until the API is back up
       */
      this.recordRequestStatus('error')

      const err = otherError || serverError

      item.failCount++

      await sleep(item.failCount * 1000)

      // Start reporting this as an error after a while
      if (item.failCount > 10 && !item.props.suppressErrors) {
        this.errorNotifier({
          error: err,
          willRetry: true,
        })
      }

      item.working = false
    } else {
      this.recordRequestStatus('ok')

      // Report errors in usage of the API
      if (queryError) {
        if (!item.props.suppressErrors) {
          this.errorNotifier({
            error: queryError,
            willRetry: false,
          })
        }
        resolveWith({ data: null, errors: [{ error: queryError }] })
      } else {
        resolveWith({ data: response })
      }
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
