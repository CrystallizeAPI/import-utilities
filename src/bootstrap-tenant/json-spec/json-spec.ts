import { Shape } from '@crystallize/schema/shape'
import {
  JSONGrid,
  JSONItem,
  JSONLanguage,
  JSONPriceVariant,
  JSONStockLocation,
  JSONSubscriptionPlan,
  JSONTopic,
  JSONVatType,
  JSONCustomer,
} from './core'
import { JSONOrder } from './orders'

export interface JsonSpec {
  shapes?: Shape[]
  priceVariants?: JSONPriceVariant[]
  stockLocations?: JSONStockLocation[]
  subscriptionPlans?: JSONSubscriptionPlan[]
  languages?: JSONLanguage[]
  vatTypes?: JSONVatType[]
  topicMaps?: JSONTopic[]
  items?: JSONItem[]
  grids?: JSONGrid[]
  customers?: JSONCustomer[]
  orders?: JSONOrder[]
}
