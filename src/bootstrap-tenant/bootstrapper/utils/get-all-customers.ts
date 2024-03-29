import { BootstrapperContext } from '.'
import { JSONCustomer } from '../../json-spec'

const query = `
query GET_CUSTOMERS_PAGE ($after: String, $tenantId: ID!) {
  customer {
    getMany(first: 50, after: $after, tenantId: $tenantId) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          identifier
          email
          firstName
          lastName
          companyName
          externalReferences {
            key
            value
          }
          meta {
            key
            value
          }
          taxNumber
          addresses {
            id
            country
            type
            city
            email
            phone
            postalCode
            middleName
            state
            street
            street2
            streetNumber
          }
        }
      }
    }
  }
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

export async function getExistingCustomers({
  context,
}: {
  context: BootstrapperContext
}): Promise<JSONCustomer[]> {
  let after = ''
  let hasNextPage = true
  const customers: JSONCustomer[] = []

  while (hasNextPage) {
    const res = await getPage(context, after)

    const getMany = res.data?.customer?.getMany
    const pageInfo = getMany?.pageInfo

    if (!getMany || !pageInfo) {
      hasNextPage = false
    } else {
      getMany?.edges?.length > 0 &&
        customers.push(...getMany.edges.map((e: any) => e.node))
      after = pageInfo.endCursor
      hasNextPage = pageInfo.hasNextPage
    }
  }

  return customers
}
