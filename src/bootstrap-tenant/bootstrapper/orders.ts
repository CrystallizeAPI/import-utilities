import { AreaUpdate, BootstrapperContext, IcallAPIResult } from '.'
import { buildCreateOrderQuery } from '../../graphql/build-create-order-mutation'
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
  return context.callPIM(
    buildCreateOrderQuery({
      customer: {
        companyName: customer.companyName,
        addresses: customer.addresses?.map((address) => ({
          type: address.type,
          firstName: address.firstName,
          middleName: address.middleName,
          lastName: address.lastName,
          email: address.email,
          phone: address.phone,
          street: address.street,
          street2: address.street2,
          streetNumber: address.streetNumber,
          city: address.city,
          country: address.country,
          state: address.state,
          postalCode: address.postalCode,
        })),
      },
      cart: cart.map(({ name, price, productId, productVariantId, sku }) => ({
        name,
        productId,
        productVariantId,
        sku,
        price: price && {
          currency: price.currency,
          gross: price.gross,
          net: price.net,
          // tax: { }
        },
      })),
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
    return
  }

  await Promise.all(
    spec.orders.map(async (order) => {
      try {
        const res = await createOrder(context, order)
        if (res.errors) {
          console.error(res.errors)
          onUpdate({
            warning: {
              code: 'OTHER',
              message: 'Cannot create order',
            },
          })
        }
      } catch (err) {
        console.error(err)
        onUpdate({
          warning: {
            code: 'OTHER',
            message: 'Cannot create order',
          },
        })
      }
    })
  )
}
