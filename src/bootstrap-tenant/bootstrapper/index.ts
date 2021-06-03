import { EventEmitter } from 'events'

import { JsonSpec } from '../json-spec'

export * from './utils'
import {
  callPIM,
  EVENT_NAMES,
  setAccessTokens,
  setTenantId,
  StepStatus,
} from './utils'
import { setShapes } from './set-shapes'
import { setPriceVariants } from './set-price-variants'
import { setLanguages } from './set-languages'

export class Bootstrapper extends EventEmitter {
  CRYSTALLIZE_ACCESS_TOKEN_ID: string = ''
  CRYSTALLIZE_ACCESS_TOKEN_SECRET: string = ''
  SPEC: JsonSpec | null = null
  tenantId: string = ''
  tenantIdentifier: string = ''

  setAccessToken = setAccessTokens
  setSpec(spec: JsonSpec) {
    this.SPEC = spec
  }
  setTenantIdentifier(tenantIdentifier: string) {
    this.tenantIdentifier = tenantIdentifier
  }
  async getTenantId() {
    const r = await callPIM({
      query: `
        {
          me {
            tenants {
              tenant {
                id
                identifier
              }
            }
          }
        }
      `,
    })

    this.tenantId = r?.data?.me?.tenants?.find(
      (t: { tenant: { identifier: string } }) =>
        t.tenant.identifier === this.tenantIdentifier
    )?.tenant.id
    if (!this.tenantId) {
      throw new Error(`No access to tenant "${this.tenantIdentifier}"`)
    }
    setTenantId(this.tenantId)
  }
  async start() {
    await this.getTenantId()
    await this.setShapes()
    await this.setPriceVariants()
    await this.setLanguages()

    this.emit(EVENT_NAMES.DONE)
  }
  async setShapes() {
    await setShapes({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.SHAPES_UPDATE, status.message)
      },
    })
    this.emit(EVENT_NAMES.SHAPES_DONE)
  }
  async setPriceVariants() {
    await setPriceVariants({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.PRICE_VARIANTS_UPDATE, status.message)
      },
    })
    this.emit(EVENT_NAMES.PRICE_VARIANTS_DONE)
  }
  async setLanguages() {
    await setLanguages({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.LANGUAGES_UPDATE, status.message)
      },
    })
    this.emit(EVENT_NAMES.LANGUAGES_DONE)
  }
}
