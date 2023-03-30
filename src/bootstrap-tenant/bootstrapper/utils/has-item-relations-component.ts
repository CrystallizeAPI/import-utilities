import { ComponentContentInput } from '../../../types'

export const hasItemRelationsComponent = (
  componentContent: ComponentContentInput
): boolean => {
  if (
    // @ts-ignore
    componentContent?.componentChoice?.itemRelations ||
    // @ts-ignore
    componentContent?.itemRelations ||
    // @ts-ignore
    componentContent?.contentChunk?.chunks?.some((object: any) =>
      object?.some((childObject: any) => childObject.itemRelations)
    )
  ) {
    return true
  } else {
    return false
  }
}
