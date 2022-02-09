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

export interface JSONOrderPrice {
  currency: string
  gross?: number
  net?: number
  // discounts
  // tax
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
  // subscription: JSONOrderItemSubscription
  // subscriptionContractId?: string
}

export interface JSONOrder {
  customer: JSONOrderCustomer
  cart: JSONOrderItem[]
  // payment?: JSONPayment
  total?: JSONOrderPrice
}
