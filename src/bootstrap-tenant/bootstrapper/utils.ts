import fetch from 'node-fetch'

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
}

export interface StepStatus {
  done: boolean
  message?: string
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

export async function callPIM({
  query,
  variables,
}: IcallPIM): Promise<IcallPIMResult> {
  const response = await fetch('https://pim-dev.crystallize.digital/graphql', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'X-Crystallize-Access-Token-Id': CRYSTALLIZE_ACCESS_TOKEN_ID,
      'X-Crystallize-Access-Token-Secret': CRYSTALLIZE_ACCESS_TOKEN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json: IcallPIMResult = await response.json()

  await sleep(250)

  return json
}
