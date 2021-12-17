import { EventEmitter } from 'events'
import immer from 'immer'
// @ts-ignore
import Duration from 'duration'

import { JsonSpec } from '../json-spec'

export * from './utils'
import {
  EVENT_NAMES,
  AreaUpdate,
  BootstrapperContext,
  AreaWarning,
  Config,
  ApiManager,
  sleep,
  FileUploadManager,
} from './utils'
import { getExistingShapesForSpec, setShapes } from './shapes'
import { setPriceVariants, getExistingPriceVariants } from './price-variants'
import { setLanguages, getTenantSettings } from './languages'
import { setVatTypes, getExistingVatTypes } from './vat-types'
import { getAllTopicsForSpec, removeTopicId, setTopics } from './topics'
import { setItems } from './items'
import {
  getAllCatalogueItems,
  ItemsCreateSpecOptions,
} from './utils/get-all-catalogue-items'
import { getAllGrids } from './utils/get-all-grids'
import { setGrids } from './grids'
import { clearCache as clearTopicCache } from './utils/get-topic-id'
import { clearCache as clearItemCache } from './utils/get-item-id'
import { setStockLocations, getExistingStockLocations } from './stock-locations'
import {
  getExistingSubscriptionPlans,
  setSubscriptionPlans,
} from './subscription-plans'
import { createAPICaller, IcallAPI, IcallAPIResult } from './utils/api'

export interface ICreateSpec {
  shapes: boolean
  grids: boolean
  items: boolean | ItemsCreateSpecOptions
  languages: boolean
  priceVariants: boolean
  vatTypes: boolean
  subscriptionPlans: boolean
  topicMaps: boolean
  stockLocations: boolean
  onUpdate: (t: AreaUpdate) => any
}

export const createSpecDefaults: ICreateSpec = {
  shapes: true,
  grids: true,
  items: true,
  languages: true,
  priceVariants: true,
  vatTypes: true,
  subscriptionPlans: true,
  topicMaps: true,
  stockLocations: true,
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
  subscriptionPlans: AreaStatus
  topicMaps: AreaStatus
  stockLocations: AreaStatus
}

function defaultAreaStatus(): AreaStatus {
  return {
    progress: 0,
    warnings: [],
  }
}

export class Bootstrapper extends EventEmitter {
  SPEC: JsonSpec | null = null

  #tenantBasics: Promise<boolean> | null = null

  PIMAPIManager: ApiManager | null = null
  catalogueAPIManager: ApiManager | null = null

  context: BootstrapperContext = {
    defaultLanguage: { code: 'en', name: 'English' },
    languages: [],
    config: {},
    /**
     * If it should allow for using cache when resolving
     * externalReference to item id, or topic paths to
     * topic id
     */
    useReferenceCache: false,

    /**
     * A map keeping a reference of all of the items in
     * the current spec and their (possible) item id
     */
    itemJSONCataloguePathToIDMap: new Map(),

    tenantId: '',
    tenantIdentifier: '',

    fileUploader: new FileUploadManager(),
    uploadFileFromUrl: (url: string) =>
      this.context.fileUploader.uploadFromUrl(url),
    callPIM: () => Promise.resolve({ data: {} }),
    callCatalogue: () => Promise.resolve({ data: {} }),
  }

  config: Config = {
    itemTopics: 'amend',
    itemPublish: 'auto',
    logLevel: 'silent',
  }

  status: Status = {
    media: defaultAreaStatus(),
    shapes: defaultAreaStatus(),
    grids: defaultAreaStatus(),
    items: defaultAreaStatus(),
    languages: defaultAreaStatus(),
    priceVariants: defaultAreaStatus(),
    vatTypes: defaultAreaStatus(),
    subscriptionPlans: defaultAreaStatus(),
    topicMaps: defaultAreaStatus(),
    stockLocations: defaultAreaStatus(),
  }

  getStatus = () => this.status

  setAccessToken = (ACCESS_TOKEN_ID: string, ACCESS_TOKEN_SECRET: string) => {
    this.PIMAPIManager = createAPICaller({
      uri: `https://${
        process.env.CRYSTALLIZE_ENV === 'dev'
          ? 'pim-dev.crystallize.digital'
          : 'pim.crystallize.com'
      }/graphql`,
      errorNotifier: ({ error }) => {
        this.emit(EVENT_NAMES.ERROR, { error })
      },
      logLevel: this.config.logLevel,
    })

    this.PIMAPIManager.CRYSTALLIZE_ACCESS_TOKEN_ID = ACCESS_TOKEN_ID
    this.PIMAPIManager.CRYSTALLIZE_ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET

    this.context.callPIM = this.PIMAPIManager.push
  }

  setSpec(spec: JsonSpec) {
    this.SPEC = spec
  }

  setTenantIdentifier = async (tenantIdentifier: string) => {
    this.context.tenantIdentifier = tenantIdentifier
    return this.getTenantBasics()
  }

  constructor() {
    super()
    clearTopicCache()
    clearItemCache()
  }

  getTenantBasics = async () => {
    if (this.#tenantBasics) {
      return this.#tenantBasics
    }

    this.#tenantBasics = new Promise(async (resolve, reject) => {
      /**
       * Allow for access tokens to be set synchronosly after the
       * the setTenantIdentifier is set
       */
      await sleep(5)

      const r = await this.context.callPIM({
        query: `
          {
            tenant {
              get(identifier: "${this.context.tenantIdentifier}") {
                id
                identifier
                staticAuthToken
              }
            }
          }
        `,
      })

      const tenant = r?.data?.tenant?.get

      if (!tenant) {
        const error = `⛔️ You do not have access to tenant "${this.context.tenantIdentifier}" ⛔️`
        this.emit(EVENT_NAMES.ERROR, { error })
        reject(`

${error}
`)
      } else {
        this.context.tenantId = tenant.id
        this.context.fileUploader.context = this.context

        this.catalogueAPIManager = createAPICaller({
          uri: `https://${
            process.env.CRYSTALLIZE_ENV === 'dev'
              ? 'api-dev.crystallize.digital'
              : 'api.crystallize.com'
          }/${this.context.tenantIdentifier}/catalogue`,
          errorNotifier: ({ error }) => {
            this.emit(EVENT_NAMES.ERROR, { error })
          },
          logLevel: this.config.logLevel,
        })
        this.catalogueAPIManager.CRYSTALLIZE_STATIC_AUTH_TOKEN =
          tenant.staticAuthToken
        this.context.callCatalogue = this.catalogueAPIManager.push

        resolve(true)
      }
    })
  }

  async createSpec(props: ICreateSpec = createSpecDefaults): Promise<JsonSpec> {
    function removeIds(o: any) {
      if (o && typeof o === 'object') {
        delete o.id
        Object.values(o).forEach(removeIds)
      }
      if (Array.isArray(o)) {
        o.forEach(removeIds)
      }
      return o
    }

    const spec: JsonSpec = {}

    try {
      await this.getTenantBasics()

      const tenantLanguageSettings = await getTenantSettings(this.context)

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
        spec.vatTypes = await getExistingVatTypes(this.context)
        spec.vatTypes.forEach((v) => {
          delete v.id
          // @ts-ignore
          delete v.tenantId
        })
      }

      // Subscription plans
      if (props.subscriptionPlans) {
        const subscriptionPlans = await getExistingSubscriptionPlans(
          this.context
        )

        // @ts-ignore
        spec.subscriptionPlans = subscriptionPlans.map((s) => ({
          identifier: s.identifier,
          name: s.name || '',
          meteredVariables:
            s.meteredVariables?.map((m) => ({
              identifier: m.identifier,
              name: m.name || '',
              unit: m.unit,
            })) || [],
          periods:
            s.periods?.map((p) => ({
              name: p.name || '',
              initial: removeIds(p.initial),
              recurring: removeIds(p.recurring),
            })) || [],
        }))
      }

      // Price variants
      const priceVariants = await getExistingPriceVariants(this.context)
      if (props.priceVariants) {
        spec.priceVariants = priceVariants
      }

      // Topic maps (in just 1 language right now)
      const allTopicsWithIds = await getAllTopicsForSpec(
        defaultLanguage,
        this.context
      )
      if (props.topicMaps) {
        spec.topicMaps = allTopicsWithIds.map(removeTopicId)
      }

      // Shapes
      if (props.shapes) {
        spec.shapes = await getExistingShapesForSpec(
          this.context,
          props.onUpdate
        )
      }

      // Grids
      if (props.grids) {
        spec.grids = await getAllGrids(defaultLanguage, this.context)
      }

      // Items
      if (props.items) {
        const options: ItemsCreateSpecOptions = { basePath: '/' }

        if (typeof props.items !== 'boolean') {
          const optionsOverride = props.items
          Object.assign(options, optionsOverride)
        }

        spec.items = await getAllCatalogueItems(
          defaultLanguage,
          this.context,
          options
        )
        spec.items.forEach((i: any) => {
          function handleLevel(a: any) {
            if (a && typeof a === 'object') {
              if ('subscriptionPlans' in a && 'sku' in a) {
                removeIds(a.subscriptionPlans)
              } else {
                Object.values(a).forEach(handleLevel)
              }
            } else if (Array.isArray(a)) {
              a.forEach(handleLevel)
            }
          }

          handleLevel(i)
        })
      }

      // Stock locations
      if (props.stockLocations) {
        spec.stockLocations = await getExistingStockLocations(this.context)
      }
    } catch (e) {
      this.emit(EVENT_NAMES.ERROR, {
        error: JSON.stringify(e, null, 1),
      })
    }

    return spec
  }

  async start() {
    try {
      await this.getTenantBasics()

      // Store the config in the context for easy access
      this.context.config = this.config

      const start = new Date()

      await this.setLanguages()
      await this.setPriceVariants()
      await this.setStockLocations()
      await this.setSubscriptionPlans()
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
      this.emit(EVENT_NAMES.ERROR, {
        error: JSON.stringify(e, null, 1),
      })
    }
  }
  private areaUpdate(
    statusArea:
      | 'languages'
      | 'shapes'
      | 'priceVariants'
      | 'subscriptionPlans'
      | 'vatTypes'
      | 'topicMaps'
      | 'grids'
      | 'items'
      | 'media'
      | 'stockLocations',
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
    } else if (areaUpdate.warning) {
      this.emit(EVENT_NAMES.ERROR, {
        error: JSON.stringify(areaUpdate.warning, null, 1),
      })
    }
  }

  async setLanguages() {
    const languages = await setLanguages({
      spec: this.SPEC,
      context: this.context,
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

    /**
     * Only do the default languge as of now. Waiting for a
     * good multilingual use case
     */
    this.context.languages = [defaultLanguage]

    this.emit(EVENT_NAMES.LANGUAGES_DONE)
  }

  async setShapes() {
    this.context.shapes = await setShapes({
      spec: this.SPEC,
      context: this.context,
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
      context: this.context,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.PRICE_VARIANTS_UPDATE, areaUpdate)
        this.areaUpdate('priceVariants', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.PRICE_VARIANTS_DONE)
  }
  async setSubscriptionPlans() {
    this.context.subscriptionPlans = await setSubscriptionPlans({
      spec: this.SPEC,
      context: this.context,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.SUBSCRIPTION_PLANS_UPDATE, areaUpdate)
        this.areaUpdate('subscriptionPlans', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.SUBSCRIPTION_PLANS_DONE)
  }
  async setVatTypes() {
    this.context.vatTypes = await setVatTypes({
      spec: this.SPEC,
      context: this.context,
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

  async setStockLocations() {
    this.context.stockLocations = await setStockLocations({
      spec: this.SPEC,
      context: this.context,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.STOCK_LOCATIONS_UPDATE, areaUpdate)
        this.areaUpdate('stockLocations', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.STOCK_LOCATIONS_DONE)
  }
}
