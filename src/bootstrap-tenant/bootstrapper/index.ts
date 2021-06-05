import { EventEmitter } from 'events'

import { JsonSpec, PriceVariant, VatType } from '../json-spec'

export * from './utils'
import {
  callPIM,
  EVENT_NAMES,
  setAccessTokens,
  setTenantId,
  StepStatus,
  TenantContext,
} from './utils'
import { setShapes } from './set-shapes'
import { setPriceVariants } from './set-price-variants'
import { setLanguages } from './set-languages'
import { setVatTypes } from './set-vat-types'
import { setTopics } from './set-topics'

export class Bootstrapper extends EventEmitter {
  CRYSTALLIZE_ACCESS_TOKEN_ID: string = ''
  CRYSTALLIZE_ACCESS_TOKEN_SECRET: string = ''
  SPEC: JsonSpec | null = null
  tenantId: string = ''
  tenantIdentifier: string = ''

  context: TenantContext = {
    defaultLanguage: { code: 'en', name: 'English' },
    languages: [],
  }

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
    await this.setLanguages()
    await this.setShapes()
    await this.setPriceVariants()
    await this.setVatTypes()
    await this.setTopics()

    this.emit(EVENT_NAMES.DONE)
  }
  async setShapes() {
    this.context.shapes = await setShapes({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.SHAPES_UPDATE, status)
      },
    })
    this.emit(EVENT_NAMES.SHAPES_DONE)
  }
  async setPriceVariants() {
    this.context.priceVariants = await setPriceVariants({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.PRICE_VARIANTS_UPDATE, status)
      },
    })
    this.emit(EVENT_NAMES.PRICE_VARIANTS_DONE)
  }
  async setLanguages() {
    const languages = await setLanguages({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.LANGUAGES_UPDATE, status)
      },
    })
    if (!languages) {
      throw new Error('Cannot get languages for the tenant')
    }
    this.context.languages = languages

    const defaultLanguage = this.context.languages?.find((l) => l.isDefault)
    if (!defaultLanguage) {
      throw new Error('Cannot determine default language for the tenant')
    }

    this.context.defaultLanguage = defaultLanguage
    this.emit(EVENT_NAMES.LANGUAGES_DONE)
  }
  async setVatTypes() {
    this.context.vatTypes = await setVatTypes({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.VAT_TYPES_UPDATE, status)
      },
    })
    this.emit(EVENT_NAMES.VAT_TYPES_DONE)
  }
  async setTopics() {
    await setTopics({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.TOPICS_UPDATE, status)
      },
      context: this.context,
    })
    this.emit(EVENT_NAMES.TOPICS_DONE)
  }
}
