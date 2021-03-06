import { EventEmitter } from 'events'
import immer from 'immer'
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
  AreaUpdate,
  TenantContext,
  AreaWarning,
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
  onUpdate: (t: AreaUpdate) => any
}

export const createSpecDefaults = {
  shapes: true,
  grids: true,
  items: true,
  languages: true,
  priceVariants: true,
  vatTypes: true,
  topicMaps: true,
  onUpdate: () => null,
}

interface AreaStatus {
  progress: number
  warnings: AreaWarning[]
}

export interface Status {
  media: AreaStatus
  shapes: AreaStatus
  grids: AreaStatus
  items: AreaStatus
  languages: AreaStatus
  priceVariants: AreaStatus
  vatTypes: AreaStatus
  topicMaps: AreaStatus
}

function defaultAreaStatus(): AreaStatus {
  return {
    progress: 0,
    warnings: [],
  }
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

  status: Status = {
    media: defaultAreaStatus(),
    shapes: defaultAreaStatus(),
    grids: defaultAreaStatus(),
    items: defaultAreaStatus(),
    languages: defaultAreaStatus(),
    priceVariants: defaultAreaStatus(),
    vatTypes: defaultAreaStatus(),
    topicMaps: defaultAreaStatus(),
  }

  getStatus = () => this.status

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
      spec.shapes = await getExistingShapesForSpec(props.onUpdate)
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
      await this.setPriceVariants()
      await this.setVatTypes()
      await this.setShapes()
      await this.setTopics()
      await this.setGrids()
      await this.setItems()

      // Set (update) grids again to update include the items
      await this.setGrids(true)

      const end = new Date()
      this.emit(EVENT_NAMES.DONE, {
        start,
        end,
        duration: new Duration(start, end).toString(1),
      })
    } catch (e) {
      console.log(e)
    }
  }
  private areaUpdate(
    statusArea:
      | 'languages'
      | 'shapes'
      | 'priceVariants'
      | 'vatTypes'
      | 'topicMaps'
      | 'grids'
      | 'items'
      | 'media',
    areaUpdate: AreaUpdate
  ) {
    if ('progress' in areaUpdate) {
      this.status = immer(this.status, (status) => {
        if (areaUpdate.progress) {
          status[statusArea].progress = areaUpdate.progress
        }
        if (areaUpdate.warning) {
          status[statusArea].warnings.push(areaUpdate.warning)
        }
      })
      this.emit(
        EVENT_NAMES.STATUS_UPDATE,
        immer(this.status, () => {})
      )
    }
  }

  async setLanguages() {
    const languages = await setLanguages({
      spec: this.SPEC,
      onUpdate: (stepStatus: AreaUpdate) => {
        this.emit(EVENT_NAMES.LANGUAGES_UPDATE, stepStatus)
        this.areaUpdate('languages', stepStatus)
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
  async setShapes() {
    this.context.shapes = await setShapes({
      spec: this.SPEC,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.SHAPES_UPDATE, areaUpdate)
        this.areaUpdate('shapes', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.SHAPES_DONE)
  }
  async setPriceVariants() {
    this.context.priceVariants = await setPriceVariants({
      spec: this.SPEC,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.PRICE_VARIANTS_UPDATE, areaUpdate)
        this.areaUpdate('priceVariants', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.PRICE_VARIANTS_DONE)
  }

  async setVatTypes() {
    this.context.vatTypes = await setVatTypes({
      spec: this.SPEC,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.VAT_TYPES_UPDATE, areaUpdate)
        this.areaUpdate('vatTypes', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.VAT_TYPES_DONE)
  }
  async setTopics() {
    await setTopics({
      spec: this.SPEC,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.TOPICS_UPDATE, areaUpdate)
        this.areaUpdate('topicMaps', areaUpdate)
      },
      context: this.context,
    })
    this.emit(EVENT_NAMES.TOPICS_DONE)
  }
  async setGrids(allowUpdate?: boolean) {
    await setGrids({
      spec: this.SPEC,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.GRIDS_UPDATE, areaUpdate)
        this.areaUpdate('grids', areaUpdate)
      },
      context: this.context,
      allowUpdate,
    })
    this.emit(EVENT_NAMES.GRIDS_DONE)
  }
  async setItems() {
    await setItems({
      spec: this.SPEC,
      onUpdate: (areaUpdate: AreaUpdate) => {
        if (areaUpdate.message === 'media-upload-progress') {
          this.areaUpdate('media', areaUpdate)
        } else {
          this.emit(EVENT_NAMES.ITEMS_UPDATE, areaUpdate)
          this.areaUpdate('items', areaUpdate)
        }
      },
      context: this.context,
    })
    this.emit(EVENT_NAMES.ITEMS_DONE)
  }
}
