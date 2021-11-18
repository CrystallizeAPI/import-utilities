import { JsonSpec } from '../json-spec'
import { callPIM, getTenantId, AreaUpdate } from './utils'
import {
  CreateSubscriptionPlanInput,
  SubscriptionPlan,
} from '../../generated/graphql'

export async function getExistingSubscriptionPlans(): Promise<
  SubscriptionPlan[]
> {
  const tenantId = getTenantId()
  const r = await callPIM({
    query: `
      query GET_TENANT_SUBSCRIPTION_PLANS($tenantId: ID!) {
        subscriptionPlan {
          getMany(tenantId: $tenantId) {
            identifier
            name
            meteredVariables {
              id
              identifier
              name
              unit
            }
            periods {
              id
              name
              initial {
                period
                unit
              }
              recurring {
                period
                unit
              }
            }
          }
        }
      }
    `,
    variables: {
      tenantId,
    },
  })

  return r.data?.subscriptionPlan?.getMany || []
}

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: AreaUpdate): any
}

export async function setSubscriptionPlans({
  spec,
  onUpdate,
}: Props): Promise<SubscriptionPlan[]> {
  // Get all the subscription plans from the tenant
  const existingSubscriptionPlans = await getExistingSubscriptionPlans()

  if (!spec?.subscriptionPlans) {
    onUpdate({
      progress: 1,
    })
    return existingSubscriptionPlans
  }

  const missingSubscriptionPlans = spec.subscriptionPlans.filter(
    (l) => !existingSubscriptionPlans.some((s) => s.identifier === l.identifier)
  )

  if (missingSubscriptionPlans.length > 0) {
    onUpdate({
      message: `Adding ${missingSubscriptionPlans.length} subscription plan(s)...`,
    })

    const tenantId = getTenantId()

    let finished = 0

    await Promise.all(
      missingSubscriptionPlans.map(async (subscriptionPlan) => {
        const input: CreateSubscriptionPlanInput = {
          tenantId,
          name: subscriptionPlan.name,
          identifier: subscriptionPlan.identifier,
          periods: subscriptionPlan.periods,
          meteredVariables: subscriptionPlan.meteredVariables,
        }
        const result = await callPIM({
          query: `
            mutation CREATE_SUBSCRIPTION_PLAN ($input: CreateSubscriptionPlanInput!) {
              subscriptionPlan {
                create(
                  input: $input
                ) {
                  identifier
                }
              }
            }          
          `,
          variables: {
            input,
          },
        })
        finished++

        onUpdate({
          progress: finished / missingSubscriptionPlans.length,
          message: `${subscriptionPlan.name}: ${
            result?.errors ? 'error' : 'added'
          }`,
        })
      })
    )
  }

  onUpdate({
    progress: 1,
  })

  return await getExistingSubscriptionPlans()
}
