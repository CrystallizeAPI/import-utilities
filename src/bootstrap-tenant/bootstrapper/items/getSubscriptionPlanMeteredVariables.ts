import { SubscriptionPlanMeteredVariable } from '../../../generated/graphql'
import { BootstrapperContext } from '../utils'

export function getSubscriptionPlanMeteredVariables({
  planIdentifier,
  context,
}: {
  planIdentifier: string
  context: BootstrapperContext
}): SubscriptionPlanMeteredVariable[] {
  const plan = context.subscriptionPlans?.find(
    (p) => p.identifier === planIdentifier
  )
  return plan?.meteredVariables || []
}
