import fetch from 'node-fetch'

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
  props: IcallAPI
  resolve: (value: IcallAPIResult) => void
}

// Only allow one request at a time to PIM
class ApiManager {
  queue: QueuedRequest[] = []
  status: 'idle' | 'working' = 'idle'
  url: string = ''

  constructor(url: string) {
    this.url = url
    setInterval(() => this.work(), 25)
  }

  push(props: IcallAPI): Promise<IcallAPIResult> {
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

    let json: IcallAPIResult

    // Always sleep for some time between requests
    await sleep(50)

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

      // When failing, try again
      if (!response.ok) {
        this.status = 'idle'
        return
      }

      json = await response.json()
    } catch (e) {
      console.log(e)
      console.log(JSON.stringify(item.props, null, 1))
      return
    }

    if (json.errors) {
      console.log(JSON.stringify(item.props, null, 1))
      console.log(JSON.stringify(json.errors, null, 1))
    }

    item.resolve(json)

    // Remove item from queue
    this.queue.splice(0, 1)

    this.status = 'idle'
  }
}

const MyPIMApiManager = new ApiManager('https://pim.crystallize.com/graphql')

export function callPIM(props: IcallAPI) {
  return MyPIMApiManager.push(props)
}

let MyCatalogueApiManager: ApiManager
export function callCatalogue(props: IcallAPI) {
  if (!MyCatalogueApiManager) {
    MyCatalogueApiManager = new ApiManager(
      `https://api.crystallize.com/${CRYSTALLIZE_TENANT_IDENTIFIER}/catalogue`
    )
  }
  return MyCatalogueApiManager.push(props)
}
