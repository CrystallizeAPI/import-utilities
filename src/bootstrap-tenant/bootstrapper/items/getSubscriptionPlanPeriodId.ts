import { BootstrapperContext } from '../utils'

export function getSubscriptionPlanPeriodId({
  planIdentifier,
  periodName,
  context,
}: {
  planIdentifier: string
  periodName: string
  context: BootstrapperContext
}): null | string {
  const plan = context.subscriptionPlans?.find(
    (p) => p.identifier === planIdentifier
  )
  if (plan) {
    return plan.periods?.find((p) => p.name === periodName)?.id || null
  }

  return null
}
