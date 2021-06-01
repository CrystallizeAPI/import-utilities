import { JsonSpec, Shape } from '../json-spec'

import { sleep, StepStatus } from './utils'

export interface Props {
  spec: JsonSpec | null
  onUpdate(t: StepStatus): any
}

// function updateShape(shape: Shape) {

// }

export async function updateShapes({
  spec,
  onUpdate,
}: Props): Promise<StepStatus> {
  // console.log('UPDATE SHAPES')
  // console.log(spec?.shapes)
  if (!spec?.shapes) {
    return {
      done: true,
    }
  }

  onUpdate({
    done: false,
    message: 'Shapes: starting...',
  })

  await sleep(500)

  return {
    done: true,
  }
}
