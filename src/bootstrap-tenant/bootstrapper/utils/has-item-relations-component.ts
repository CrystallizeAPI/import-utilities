import { ComponentContentInput } from '../../../types'

export const hasItemRelationsComponent = (
  componentContent: ComponentContentInput
): boolean => {
  if (
    componentContent?.componentChoice?.itemRelations ||
    componentContent?.itemRelations ||
    componentContent?.contentChunk?.chunks?.some((object: any) =>
      object?.some((childObject: any) => childObject.itemRelations)
    )
  ) {
    return true
  } else {
    return false
  }
}
