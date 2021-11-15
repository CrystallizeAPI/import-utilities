type ComponentUpdate = any

export class ComponentUpdatesBatchHandler {
  components: ComponentUpdate[] = []
  BATCH_LIMIT: number

  constructor(batchLimit: number = 9999999) {
    this.BATCH_LIMIT = batchLimit
  }

  addComponentUpdate = (component: ComponentUpdate) => {
    this.components.push(component)
  }

  getBatches = () => {
    const batches: ComponentUpdate[][] = [[]]

    let nextBatch = batches[batches.length - 1]
    for (const component of this.components) {
      nextBatch.push(component)

      if (JSON.stringify(nextBatch).length > this.BATCH_LIMIT) {
        nextBatch = []
        batches.push(nextBatch)
      }
    }

    return batches.filter((b) => b.length > 0)
  }
}
