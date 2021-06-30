import { EventEmitter } from 'events'
// @ts-ignore
import Duration from 'duration'

import { JsonSpec } from '../json-spec'

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
import { getAllTopicsForSpec, removeTopicId, setTopics } from './topics'
import { setItems } from './items'
import { getAllCatalogueItems } from './utils/get-all-catalogue-items'
import { getAllGrids } from './utils/get-all-grids'
import { setGrids } from './grids'

export interface ICreateSpec {
  shapes: boolean
  grids: boolean
  items: boolean
  languages: boolean
  priceVariants: boolean
  vatTypes: boolean
  topicMaps: boolean
}

export const createSpecDefaults = {
  shapes: true,
  grids: true,
  items: true,
  languages: true,
  priceVariants: true,
  vatTypes: true,
  topicMaps: true,
}

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
  async createSpec(props: ICreateSpec = createSpecDefaults): Promise<JsonSpec> {
    await this.getTenantId()

    const spec: JsonSpec = {}

    const tenantLanguageSettings = await getTenantSettings()

    // Languages
    const availableLanguages = tenantLanguageSettings.availableLanguages.map(
      (l) => ({
        code: l.code,
        name: l.name,
        isDefault: l.code === tenantLanguageSettings.defaultLanguage,
      })
    )
    if (!availableLanguages.some((l) => l.isDefault)) {
      availableLanguages[0].isDefault = true
    }
    const defaultLanguage =
      availableLanguages.find((s) => s.isDefault)?.code || 'en'

    if (props.languages) {
      spec.languages = availableLanguages
    }

    // VAT types
    if (props.vatTypes) {
      spec.vatTypes = await getExistingVatTypes()
      spec.vatTypes.forEach((v) => {
        delete v.id
        // @ts-ignore
        delete v.tenantId
      })
    }

    // Price variants
    if (props.priceVariants) {
      spec.priceVariants = await getExistingPriceVariants()
    }

    // Topic maps (in just 1 language right now)
    const allTopicsWithIds = await getAllTopicsForSpec(defaultLanguage)
    if (props.topicMaps) {
      spec.topicMaps = allTopicsWithIds.map(removeTopicId)
    }

    // Shapes
    if (props.shapes) {
      spec.shapes = await getExistingShapesForSpec()
    }

    // Grids
    if (props.grids) {
      spec.grids = await getAllGrids(defaultLanguage)
    }

    // Items
    if (props.items) {
      spec.items = await getAllCatalogueItems(defaultLanguage, allTopicsWithIds)
    }

    return spec
  }
  async start() {
    try {
      const start = new Date()

      await this.getTenantId()
      await this.setLanguages()
      // await this.setShapes()
      // await this.setPriceVariants()
      // await this.setVatTypes()
      // await this.setTopics()
      // await this.setItems()
      await this.setGrids()
      this.emit(EVENT_NAMES.DONE, {
        duration: new Duration(start, new Date()).toString(1),
      })
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
  async setGrids() {
    await setGrids({
      spec: this.SPEC,
      onUpdate: (status: StepStatus) => {
        this.emit(EVENT_NAMES.GRIDS_UPDATE, status)
      },
      context: this.context,
    })
    this.emit(EVENT_NAMES.GRIDS_DONE)
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
