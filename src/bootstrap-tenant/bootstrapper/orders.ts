import { AreaUpdate, BootstrapperContext, IcallAPIResult } from '.'
import { buildCreateOrderMutation } from '../../graphql/build-create-order-mutation'
import { JSONOrder, JsonSpec } from '../json-spec'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
  context: BootstrapperContext
}

const createOrder = async (
  context: BootstrapperContext,
  { customer, cart, total }: JSONOrder
): Promise<IcallAPIResult> => {
  return context.callOrders(
    buildCreateOrderMutation({
      customer: {
        identifier: customer.identifier,
        firstName: customer.firstName,
        lastName: customer.lastName,
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
      },
      cart: cart.map(
        ({ name, price, productId, productVariantId, sku, quantity }) => ({
          name,
          productId,
          productVariantId,
          sku,
          quantity,
          price: price && {
            currency: price.currency,
            gross: price.gross,
            net: price.net,
            // tax: { }
          },
        })
      ),
      total,
    })
  )
}

export const setOrders = async ({
  spec,
  onUpdate,
  context,
}: Props): Promise<void> => {
  if (!spec?.orders) {
    onUpdate({
      progress: 1,
    })
    return
  }
  let finished = 0
  const orders = spec.orders

  await Promise.all(
    spec.orders.map(async (order) => {
      const res = await createOrder(context, order)
      onUpdate({
        progress: finished / orders.length,
        message: `order: ${res?.errors ? 'error' : 'added'}`,
      })
    })
  )
}
