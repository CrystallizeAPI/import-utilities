import { ComponentUpdatesBatchHandler } from './update-components'

import test from 'ava'

test('ComponentUpdatesBatchHandler with tiny limit', (t) => {
  const handler = new ComponentUpdatesBatchHandler(1)

  handler.addComponentUpdate({ first: 'some' })
  handler.addComponentUpdate({ second: 'some' })

  const got = handler.getBatches()

  t.is(got.length, 2, 'Should match 2 batches for very low limit')
})

test('ComponentUpdatesBatchHandler with default limit', (t) => {
  const handler = new ComponentUpdatesBatchHandler()

  handler.addComponentUpdate({ first: 'some' })
  handler.addComponentUpdate({ second: 'some' })

  const got = handler.getBatches()

  t.is(
    got.length,
    1,
    'Should match 1 batch for default limit and few components'
  )
})

test('ComponentUpdatesBatchHandler with default limit and large component', (t) => {
  const handler = new ComponentUpdatesBatchHandler()

  const largeArray: number[] = []
  largeArray.length = 9999999
  largeArray.fill(Math.random() * 100)

  handler.addComponentUpdate({ largeComponent: largeArray.join(':') })
  handler.addComponentUpdate({ smallComponent: 'some' })

  const got = handler.getBatches()

  t.is(
    got.length,
    2,
    'Should match 2 batches for a super large component, and then a small'
  )
})
