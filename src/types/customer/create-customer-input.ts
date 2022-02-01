import { CustomerInput } from '../order'

export interface CreateCustomerInput extends CustomerInput {
  tenantId: string
}
