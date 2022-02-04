interface OrderCustomerAddressInput {
  type: 'delivery' | 'billing' | 'other'
  street?: string
  street2?: string
  streetNumber?: string
  postalCode?: string
  city?: string
  state?: string
  country?: string
  email?: string
  phone?: string
}

export interface OrderCustomerInput {
  identifier?: string
  firstName?: string
  middleName?: string
  lastName?: string
  birthDate?: string
  addresses?: OrderCustomerAddressInput[]
  companyName?: string
  taxNumber?: string
}

interface OrderTaxInput {
  name?: string
  percent?: number
}

interface OrderPriceInput {
  gross?: number
  net?: number
  currency: string
  tax?: OrderTaxInput
}

interface OrderItemInput {
  name: string
  sku?: string
  productId?: string
  productVariantId?: string
  price?: OrderPriceInput
}

export interface CreateOrderInput {
  customer: OrderCustomerInput
  cart: OrderItemInput[]
  payment?: any
  total?: any
  additionalInformation?: string
}
