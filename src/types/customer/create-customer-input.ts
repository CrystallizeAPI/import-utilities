interface CustomerAddressInput {
  type: 'delivery' | 'billing' | 'other'
  street?: string
  street2?: string
  streetNumber?: string
  postalCode?: string
  city?: string
  state?: string
  country?: string
}

export interface CreateCustomerInput {
  tenantId: string
  identifier?: string
  firstName?: string
  middleName?: string
  lastName?: string
  birthDate?: string
  addresses?: CustomerAddressInput[]
  companyName?: string
  taxNumber?: string
  email?: string
  phone?: string
}
