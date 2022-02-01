export interface JSONAddress {
  type: 'delivery' | 'billing' | 'other'
  street?: string
  street2?: string
  streetNumber?: string
  postalCode?: string
  city?: string
  state?: string
  country?: string
}

export interface JSONCustomer {
  identifier?: string
  firstName?: string
  middleName?: string
  lastName?: string
  birthDate?: string
  addresses?: JSONAddress[]
  companyName?: string
  taxNumber?: string
  email?: string
  phone?: string
}

export interface JSONPrice {
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
  price?: JSONPrice
  subTotal?: JSONPrice
  meta?: Record<string, unknown>
  // subscription: JSONOrderItemSubscription
  // subscriptionContractId?: string
}

export interface JSONOrder {
  customer: JSONCustomer
  cart: JSONOrderItem[]
  // payment?: JSONPayment
  total?: JSONPrice
}
