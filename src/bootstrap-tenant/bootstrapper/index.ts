import gql from 'graphql-tag'
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
  removeUnwantedFieldsFromThing,
  ItemAndParentId,
  EVENT_NAMES_VALUES,
  BootstrapperError,
} from './utils'
import { getExistingShapesForSpec, setShapes } from './shapes'
import { setPriceVariants, getExistingPriceVariants } from './price-variants'
import { setLanguages, getTenantSettings } from './languages'
import { setVatTypes, getExistingVatTypes } from './vat-types'
import { getAllTopicsForSpec, setTopics } from './topics'
import { setItems } from './items'
import {
  getAllCatalogueItems,
  ItemsCreateSpecOptions,
} from './utils/get-all-catalogue-items'
import { getAllGrids } from './utils/get-all-grids'
import { setGrids } from './grids'
import { setStockLocations, getExistingStockLocations } from './stock-locations'
import {
  getExistingSubscriptionPlans,
  setSubscriptionPlans,
} from './subscription-plans'
import { createAPICaller } from './utils/api'
import { setOrders } from './orders'
import { setCustomers } from './customers'
import { createClient, createMassCallClient } from '@crystallize/js-api-client'

export interface ICreateSpec {
  language?: string
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
  customers: AreaStatus
  orders: AreaStatus
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

  PIMAPIManager: ApiManager | null = null
  catalogueAPIManager: ApiManager | null = null
  searchAPIManager: ApiManager | null = null
  ordersAPIManager: ApiManager | null = null
  tenantIdentifier = ''
  env: 'prod' | 'dev' = 'prod'

  context: BootstrapperContext = {
    defaultLanguage: { code: 'en', name: 'English' },
    languages: [],
    config: {
      experimental: {},
    },
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
    itemCataloguePathToIDMap: new Map<string, ItemAndParentId>(),

    /**
     * A map keeping a reference of all of the items in
     * the current spec and their (possible) item id
     */
    itemExternalReferenceToIDMap: new Map<string, ItemAndParentId>(),

    /**
     * A map keeping a reference of all of the items in
     * the current spec and their (possible) item versions
     */
    itemVersions: new Map(),

    tenantId: '',
    tenantIdentifier: '',

    /**
     * A map keeping a reference of all of the topics in the current
     * spec and their id.
     */
    topicPathToIDMap: new Map<string, string>(),

    fileUploader: new FileUploadManager(),
    uploadFileFromUrl: (url: string) =>
      this.context.fileUploader.uploadFromUrl(url),
    callPIM: () => Promise.resolve({ data: {} }),
    callCatalogue: () => Promise.resolve({ data: {} }),
    callSearch: () => Promise.resolve({ data: {} }),
    callOrders: () => Promise.resolve({ data: {} }),
    emit: (name: EVENT_NAMES_VALUES, message: any) => {
      this.emit(name, message)
    },
  }

  config: Config = {
    itemTopics: 'amend',
    itemPublish: 'auto',
    logLevel: 'silent',
    experimental: {},
  }

  status: Status = {
    media: defaultAreaStatus(),
    shapes: defaultAreaStatus(),
    grids: defaultAreaStatus(),
    items: defaultAreaStatus(),
    languages: defaultAreaStatus(),
    customers: defaultAreaStatus(),
    orders: defaultAreaStatus(),
    priceVariants: defaultAreaStatus(),
    vatTypes: defaultAreaStatus(),
    subscriptionPlans: defaultAreaStatus(),
    topicMaps: defaultAreaStatus(),
    stockLocations: defaultAreaStatus(),
  }

  getStatus = () => this.status

  setAccessToken = (ACCESS_TOKEN_ID: string, ACCESS_TOKEN_SECRET: string) => {
    // PIM
    this.PIMAPIManager = createAPICaller({
      uri: `https://${
        this.env === 'dev'
          ? 'pim-dev.crystallize.digital'
          : 'pim.crystallize.com'
      }/graphql`,
      errorNotifier: (error: BootstrapperError) => {
        this.emit(EVENT_NAMES.ERROR, error)
      },
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
    this.tenantIdentifier = tenantIdentifier

    // Clear existing maps if the tenant is changed
    this.context.itemCataloguePathToIDMap = new Map<string, ItemAndParentId>()
    this.context.itemExternalReferenceToIDMap = new Map<
      string,
      ItemAndParentId
    >()
    this.context.topicPathToIDMap = new Map<string, string>()
  }

  getTenantBasics = async () => {
    /**
     * Allow for access tokens to be set synchronosly after the
     * the setTenantIdentifier is set
     */
    await sleep(5)

    if (this.PIMAPIManager && this.config.multilingual) {
      /**
       * Due to a potential race condition when operating on
       * multiple languages on the same time, we need to limit
       * the amount of workers to 1 for now
       */
      this.PIMAPIManager.maxWorkers = 1
    }

    const r = await this.context.callPIM({
      query: gql`
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
      const error: BootstrapperError = {
        error: `⛔️ You do not have access to tenant "${this.context.tenantIdentifier}" ⛔️`,
        willRetry: false,
      }
      this.emit(EVENT_NAMES.ERROR, error)
      return false
    } else {
      this.context.tenantId = tenant.id
      this.context.fileUploader.context = this.context

      const baseUrl = `https://${
        this.env === 'dev'
          ? 'api-dev.crystallize.digital'
          : 'api.crystallize.com'
      }/${this.context.tenantIdentifier}`

      const client = createClient({
        tenantIdentifier: this.context.tenantIdentifier,
        tenantId: this.context.tenantId,
        accessTokenId: this.PIMAPIManager?.CRYSTALLIZE_ACCESS_TOKEN_ID,
        accessTokenSecret: this.PIMAPIManager?.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
        origin:
          this.env === 'dev' ? '-dev.crystallize.digital' : '.crystallize.com',
      })

      this.context.client = createMassCallClient(client, {})

      // Catalogue
      this.catalogueAPIManager = createAPICaller({
        uri: `${baseUrl}/catalogue`,
        errorNotifier: (error: BootstrapperError) => {
          this.emit(EVENT_NAMES.ERROR, error)
        },
        logLevel: this.config.logLevel,
      })
      this.catalogueAPIManager.CRYSTALLIZE_STATIC_AUTH_TOKEN =
        tenant.staticAuthToken
      this.context.callCatalogue = this.catalogueAPIManager.push

      // Search
      this.searchAPIManager = createAPICaller({
        uri: `${baseUrl}/search`,
        errorNotifier: (error: BootstrapperError) => {
          this.emit(EVENT_NAMES.ERROR, error)
        },
        logLevel: this.config.logLevel,
      })
      this.searchAPIManager.CRYSTALLIZE_STATIC_AUTH_TOKEN =
        tenant.staticAuthToken
      this.context.callSearch = this.searchAPIManager.push

      // Orders
      this.ordersAPIManager = createAPICaller({
        uri: `https://${
          this.env === 'dev'
            ? 'api-dev.crystallize.digital'
            : 'api.crystallize.com'
        }/${this.tenantIdentifier}/orders`,
        errorNotifier: (error: BootstrapperError) => {
          this.emit(EVENT_NAMES.ERROR, error)
        },
      })
      this.ordersAPIManager.CRYSTALLIZE_ACCESS_TOKEN_ID =
        this.PIMAPIManager?.CRYSTALLIZE_ACCESS_TOKEN_ID!
      this.ordersAPIManager.CRYSTALLIZE_ACCESS_TOKEN_SECRET =
        this.PIMAPIManager?.CRYSTALLIZE_ACCESS_TOKEN_SECRET!
      this.context.callOrders = this.ordersAPIManager.push

      // Set log level late so that we'll catch late changes to the config
      if (this.PIMAPIManager && this.config.logLevel) {
        this.PIMAPIManager.logLevel = this.config.logLevel
      }

      return true
    }
  }

  async ensureTenantExists() {
    /**
     * Allow for access tokens to be set synchronosly after the
     * the setTenantIdentifier is set
     */
    await sleep(5)

    if (!this.tenantIdentifier) {
      throw new Error(
        'tenantIdentifier is not set. Use bootstrapper.setTenantIdentifier(<identifier>)'
      )
    }

    const identifier = this.tenantIdentifier
    const resultGetTenant = await this.PIMAPIManager?.push({
      query: `
      query ($identifier: String!) {
        tenant {
          get(identifier: $identifier) {
            identifier
          }
        }
      }`,
      variables: {
        identifier,
      },
      // No need to report for this query, as it will error out if the tenant does not exist
      suppressErrors: true,
    })

    const match = resultGetTenant?.data?.tenant?.get || null
    if (match) {
      return true
    }

    // Attempt to create the tenant
    const resultCreate = await this.PIMAPIManager?.push({
      query: `
        mutation ($identifier: String!) {
          tenant {
            create (
              input: {
                identifier: $identifier
                name: $identifier
              }
            ) {
              identifier
            }
          }
        }`,
      variables: {
        identifier,
      },
    })

    // This tenant identifier exists, but you do not have access
    if (resultCreate?.errors) {
      return false
    }

    return true
  }

  async createSpec(props: ICreateSpec = createSpecDefaults): Promise<JsonSpec> {
    const spec: JsonSpec = {}

    try {
      await this.getTenantBasics()

      // Store the config in the context for easy access
      this.context.config = this.config

      const tenantLanguageSettings = await getTenantSettings(this.context)

      // Languages
      const availableLanguages = tenantLanguageSettings.availableLanguages
        .map((l) => ({
          code: l.code,
          name: l.name,
          isDefault: l.code === tenantLanguageSettings.defaultLanguage,
        }))
        .sort((a) => (a.isDefault ? -1 : 0))

      if (!availableLanguages.some((l) => l.isDefault)) {
        availableLanguages[0].isDefault = true
      }
      const defaultLanguage =
        availableLanguages.find((s) => s.isDefault)?.code || 'en'

      if (props.languages) {
        spec.languages = availableLanguages
      }

      if (this.config.multilingual) {
        this.context.languages = availableLanguages
      }

      const languageToUse = props.language || defaultLanguage

      // VAT types
      if (props.vatTypes) {
        spec.vatTypes = await getExistingVatTypes(this.context)

        removeUnwantedFieldsFromThing(spec.vatTypes, ['id', 'tenantId'])
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
              initial: removeUnwantedFieldsFromThing(p.initial, ['id']),
              recurring: removeUnwantedFieldsFromThing(p.recurring, ['id']),
            })) || [],
        }))
      }

      // Price variants
      const priceVariants = await getExistingPriceVariants(this.context)
      if (props.priceVariants) {
        spec.priceVariants = priceVariants
      }

      // Topic maps (in just 1 language right now)
      if (props.topicMaps) {
        spec.topicMaps = await getAllTopicsForSpec(languageToUse, this.context)
        removeUnwantedFieldsFromThing(spec.topicMaps, ['id'])
      }

      // Shapes
      if (props.shapes) {
        spec.shapes = await getExistingShapesForSpec(this.context)
      }

      // Grids
      if (props.grids) {
        spec.grids = await getAllGrids(languageToUse, this.context)
      }

      // Items
      if (props.items) {
        const options: ItemsCreateSpecOptions = { basePath: '/' }

        if (typeof props.items !== 'boolean') {
          const optionsOverride = props.items
          Object.assign(options, optionsOverride)
        }

        spec.items = await getAllCatalogueItems(
          languageToUse,
          this.context,
          options
        )
        spec.items.forEach((i: any) => {
          function handleLevel(a: any) {
            if (a && typeof a === 'object') {
              if ('subscriptionPlans' in a && 'sku' in a) {
                removeUnwantedFieldsFromThing(a.subscriptionPlans, ['id'])
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
    } catch (error) {
      const err: BootstrapperError = {
        error: JSON.stringify(error),
        willRetry: false,
      }
      this.emit(EVENT_NAMES.ERROR, err)
    }

    return spec
  }

  async start() {
    try {
      await this.ensureTenantExists()

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
      await this.setCustomers()
      await this.setOrders()

      // Set (update) grids again to update include the items
      await this.setGrids(true)

      const end = new Date()
      this.emit(EVENT_NAMES.DONE, {
        start,
        end,
        duration: new Duration(start, end).toString(1),
        spec: this.SPEC,
      })
    } catch (error) {
      const err: BootstrapperError = {
        error: JSON.stringify(error),
        willRetry: false,
      }
      this.emit(EVENT_NAMES.ERROR, err)
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
      | 'stockLocations'
      | 'customers'
      | 'orders',
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
      const err: BootstrapperError = {
        error: JSON.stringify(areaUpdate.warning, null, 1),
        willRetry: false,
        type: 'warning',
      }

      this.emit(EVENT_NAMES.ERROR, err)
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

    if (!this.config.multilingual) {
      this.context.languages = [defaultLanguage]
    }

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

  async setCustomers() {
    await setCustomers({
      spec: this.SPEC,
      context: this.context,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.CUSTOMERS_UPDATE, areaUpdate)
        this.areaUpdate('customers', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.CUSTOMERS_DONE)
  }

  async setOrders() {
    await setOrders({
      spec: this.SPEC,
      context: this.context,
      onUpdate: (areaUpdate: AreaUpdate) => {
        this.emit(EVENT_NAMES.ORDERS_UPDATE, areaUpdate)
        this.areaUpdate('orders', areaUpdate)
      },
    })
    this.emit(EVENT_NAMES.ORDERS_DONE)
  }
}
