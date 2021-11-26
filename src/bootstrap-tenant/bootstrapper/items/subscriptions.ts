import {
  JSONProductSubscriptionPlanPricing,
  JSONProductVariantSubscriptionPlanMeteredVariable,
} from '../../json-spec'
import {
  SubscriptionPlanMeteredVariable,
  SubscriptionPlanMeteredVariableReferenceInput,
  SubscriptionPlanPriceInput,
} from '../../../generated/graphql'
import { handleJsonPriceToPriceInput } from './pricing'
import { BootstrapperContext } from '..'

export function subscriptionPlanPrincingJsonToInput({
  pricing,
  meteredVaribles,
}: {
  pricing: JSONProductSubscriptionPlanPricing
  meteredVaribles: SubscriptionPlanMeteredVariable[]
}): SubscriptionPlanPriceInput {
  function handleMeteredVariable(
    mv: JSONProductVariantSubscriptionPlanMeteredVariable
  ): SubscriptionPlanMeteredVariableReferenceInput {
    const id = meteredVaribles.find((m) => m.identifier === mv.identifier)?.id
    if (!id) {
      throw new Error('Cannot find id for metered variable ' + mv.identifier)
    }

    return {
      id,
      tierType: mv.tierType,
      tiers: mv.tiers?.map((t) => ({
        threshold: t.threshold,
        priceVariants: handleJsonPriceToPriceInput({
          jsonPrice: t.price,
        }),
      })),
    }
  }

  return {
    priceVariants: handleJsonPriceToPriceInput({
      jsonPrice: pricing.price,
    }),
    meteredVariables: pricing.meteredVariables.map(handleMeteredVariable),
  }
}

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
