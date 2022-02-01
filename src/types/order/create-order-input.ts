interface AddressInput {
  type: 'delivery' | 'billing' | 'other'
  street?: string
  street2?: string
  streetNumber?: string
  postalCode?: string
  city?: string
  state?: string
  country?: string
}

export interface CustomerInput {
  identifier?: string
  firstName?: string
  middleName?: string
  lastName?: string
  birthDate?: string
  addresses?: AddressInput[]
  companyName?: string
  taxNumber?: string
  email?: string
  phone?: string
}

interface TaxInput {
  name?: string
  percent?: number
}

interface PriceInput {
  gross?: number
  net?: number
  currency: string
  tax?: TaxInput
}

interface OrderItemInput {
  name: string
  sku?: string
  productId?: string
  productVariantId?: string
  price?: PriceInput
}

export interface CreateOrderInput {
  customer: CustomerInput
  cart: OrderItemInput[]
  payment?: any
  total?: any
  additionalInformation?: string
}
