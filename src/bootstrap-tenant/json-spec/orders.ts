export interface JSONOrderAddress {
  type: 'delivery' | 'billing' | 'other'
  street?: string
  street2?: string
  streetNumber?: string
  postalCode?: string
  city?: string
  state?: string
  country?: string
  phone?: string
  email?: string
}

export interface JSONOrderCustomer {
  identifier?: string
  firstName?: string
  middleName?: string
  lastName?: string
  birthDate?: string
  addresses?: JSONOrderAddress[]
  companyName?: string
  taxNumber?: string
}

export interface JSONOrderTax {
  name?: string
  percent?: number
}

export interface JSONOrderDiscount {
  percent: number
}

export interface JSONOrderPrice {
  currency: string
  gross?: number
  net?: number
  discounts?: JSONOrderDiscount[]
  tax?: JSONOrderTax
}

export interface JSONOrderItemMeteredVariableInput {
  id: string
  usage: number
  price: number
}

export interface JSONOrderItemSubscription {
  name?: string
  period: number
  unit: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  start?: string
  end?: string
  meteredVariables?: JSONOrderItemMeteredVariableInput[]
}

export interface JSONOrderItem {
  name: string
  sku?: string
  productId?: string
  productVariantId?: string
  imageUrl?: string
  quantity: number
  price?: JSONOrderPrice
  subTotal?: JSONOrderPrice
  meta?: Record<string, unknown>
  subscription?: JSONOrderItemSubscription
  subscriptionContractId?: string
}

export interface JSONOrder {
  customer: JSONOrderCustomer
  cart: JSONOrderItem[]
  // payment?: JSONPayment
  total?: JSONOrderPrice
}
