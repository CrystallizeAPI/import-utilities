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
  JSONShape,
} from './core'
import { JSONOrder } from './orders'

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
