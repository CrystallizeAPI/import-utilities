import { EventEmitter } from 'events'

import { JsonSpec, JSONPriceVariant, JSONVatType } from '../json-spec'

export * from './utils'
import {
  callPIM,
  EVENT_NAMES,
  setAccessTokens,
  setTenantId,
  setTenantIdentifier,
  StepStatus,
  TenantContext,
} from './utils'
import { getExistingShapesForSpec, setShapes } from './shapes'
import { setPriceVariants, getExistingPriceVariants } from './price-variants'
import { setLanguages, getTenantSettings } from './languages'
import { setVatTypes, getExistingVatTypes } from './vat-types'
import { getAllTopicsForSpec, setTopics } from './topics'
import { setItems } from './items'
import { getAllCatalogueItems } from './utils/get-all-catalogue-items'

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
    setTenantIdentifier(this.tenantIdentifier)
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
  async createSpec(): Promise<JsonSpec> {
    await this.getTenantId()

    const spec: JsonSpec = {}

    const tenantLanguageSettings = await getTenantSettings()

    // Languages
    spec.languages = tenantLanguageSettings.availableLanguages.map((l) => ({
      code: l.code,
      name: l.name,
      isDefault: l.code === tenantLanguageSettings.defaultLanguage,
    }))
    if (!spec.languages.some((l) => l.isDefault)) {
      spec.languages[0].isDefault = true
    }
    const defaultLanguage =
      spec.languages.find((s) => s.isDefault)?.code || 'en'

    // VAT types
    spec.vatTypes = await getExistingVatTypes()

    // Price variants
    spec.priceVariants = await getExistingPriceVariants()

    // Topic maps (in just 1 language right now)
    spec.topicMaps = await getAllTopicsForSpec(defaultLanguage)

    // Shapes
    spec.shapes = await getExistingShapesForSpec()

    // Items
    spec.items = await getAllCatalogueItems(defaultLanguage, spec.topicMaps)

    return spec
  }
  async start() {
    try {
      await this.getTenantId()
      await this.setLanguages()
      await this.setShapes()
      await this.setPriceVariants()
      await this.setVatTypes()
      await this.setTopics()
      await this.setItems()
      this.emit(EVENT_NAMES.DONE)
    } catch (e) {
      console.log(e)
    }
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
  async setItems() {
    await setItems({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.ITEMS_UPDATE, status)
      },
      context: this.context,
    })
    this.emit(EVENT_NAMES.ITEMS_DONE)
  }
}
