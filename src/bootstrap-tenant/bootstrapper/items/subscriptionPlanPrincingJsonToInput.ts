import {
  SubscriptionPlanMeteredVariable,
  SubscriptionPlanMeteredVariableReferenceInput,
  SubscriptionPlanPriceInput,
} from '../../../generated/graphql'
import {
  JSONProductSubscriptionPlanPricing,
  JSONProductVariantSubscriptionPlanMeteredVariable,
} from '../../json-spec'
import { handleJsonPriceToPriceInput } from './handleJsonPriceToPriceInput'

export function subscriptionPlanPrincingJsonToInput(
  pricing: JSONProductSubscriptionPlanPricing,
  meteredVaribles: SubscriptionPlanMeteredVariable[]
): SubscriptionPlanPriceInput {
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
    meteredVariables:
      pricing?.meteredVariables?.length > 0
        ? pricing.meteredVariables.map(handleMeteredVariable)
        : undefined,
  }
}
