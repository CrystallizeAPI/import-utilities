import {
  JSONGrid,
  JSONItem,
  JSONLanguage,
  JSONPriceVariant,
  JSONShape,
  JSONStockLocation,
  JSONSubscriptionPlan,
  JSONTopic,
  JSONVatType,
} from './core'
import { JSONOrder, JSONCustomer } from './orders'

export interface JsonSpec {
  shapes?: JSONShape[]
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
