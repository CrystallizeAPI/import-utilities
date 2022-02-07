import { AreaUpdate, BootstrapperContext, IcallAPIResult } from '.'
import { buildCreateCustomerMutation } from '../../graphql/build-create-customer-mutation'
import { JSONCustomer, JsonSpec } from '../json-spec'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

const createCustomer = async (
  context: BootstrapperContext,
  customer: JSONCustomer
): Promise<IcallAPIResult> => {
  return context.callPIM(
    buildCreateCustomerMutation({
      tenantId: context.tenantId,
      identifier: customer.identifier,
      firstName: customer.firstName,
      middleName: customer.middleName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      companyName: customer.companyName,
      addresses: customer.addresses?.map((address) => ({
        type: address.type,
        street: address.street,
        street2: address.street2,
        streetNumber: address.streetNumber,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postalCode,
      })),
    })
  )
}

export const setCustomers = async ({
  spec,
  onUpdate,
  context,
}: Props): Promise<void> => {
  if (!spec?.customers) {
    onUpdate({
      progress: 1,
    })
    return
  }
  let finished = 0
  const customers = spec.customers

  await Promise.all(
    spec.customers.map(async (customer) => {
      const res = await createCustomer(context, customer)
      onUpdate({
        progress: finished / customers.length,
        message: `customer ${customer.identifier}: ${
          res?.errors ? 'error' : 'added'
        }`,
      })
    })
  )
}
