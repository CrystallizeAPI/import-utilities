import { BootstrapperContext } from '.'
import { JSONOrder } from '../../json-spec'

const query = `
query GET_ORDER_PAGE($after: String, $tenantId: ID!) {
  order {
    getMany(first: 50, after: $after, tenantId: $tenantId) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          createdAt
          customer {
            identifier
            addresses {
              ...Adr
            }
          }
          additionalInformation
          meta {
            ...KV
          }
          total {
            ...PR
          }
          payment {
            ... on CashPayment {
              provider
              cash
            }
            ... on CustomPayment {
              provider
              properties {
                property
                value
              }
            }
            ... on KlarnaPayment {
              provider
              id
              merchantReference1
              merchantReference2
              metadata
              orderId
              recurringToken
              status
            }
          }
          cart {
            imageUrl
            meta {
              ...KV
            }
            name
            price {
              ...PR
            }
            quantity
            sku
            subTotal {
              ...PR
            }
            subscription {
              end
              meteredVariables {
                id
                price
                id
              }
              period
              start
              unit
            }
            subscriptionContractId
          }
        }
      }
    }
  }
}

fragment PR on Price {
  currency
  discounts {
    percent
  }
  gross
  net
  tax {
    name
    percent
  }
}

fragment KV on KeyValuePair {
  key
  value
}

fragment Adr on Address {
  type
  city
  country
  email
  firstName
  id
  lastName
  middleName
  phone
  postalCode
  state
  street2
  streetNumber
}
`

async function getPage(context: BootstrapperContext, after: string) {
  return context.callPIM({
    query,
    variables: {
      tenantId: context.tenantId,
      after,
    },
  })
}

export async function getExistingOrders({
  context,
}: {
  context: BootstrapperContext
}): Promise<JSONOrder[]> {
  let after = ''
  let hasNextPage = true
  const orders: JSONOrder[] = []

  while (hasNextPage) {
    const res = await getPage(context, after)
    const getMany = res.data?.order?.getMany
    const pageInfo = getMany?.pageInfo

    if (!getMany || !pageInfo) {
      hasNextPage = false
    } else {
      orders.push(...getMany.edges.map((e: any) => e.node))
      after = pageInfo.endCursor
      hasNextPage = pageInfo.hasNextPage
    }
  }

  return orders
}
