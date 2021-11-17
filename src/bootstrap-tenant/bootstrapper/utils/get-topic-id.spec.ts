import test from 'ava'
import { IcallAPI, IcallAPIResult } from '.'
import { getTopicId, getTopicIds } from './get-topic-id'

function apiFn(props: IcallAPI): Promise<IcallAPIResult> {
  return Promise.resolve({
    data: {
      search: {
        topics: {
          edges: [
            { node: { id: '123', path: '/123' } },
            { node: { id: '1234', path: '/1234' } },
            { node: { id: '123-my-topic', path: '/my-topic' } },
            { node: { id: '123-my-other-topic', path: '/my-other-topic' } },
          ],
        },
      },
    },
  })
}

test('get single topic id', async (t) => {
  const got = await getTopicId({
    topic: { path: '/my-topic' },
    language: 'en',
    useCache: false,
    apiFn,
  })
  t.is(got, '123-my-topic', 'the topic id should match ')
})

test('get multiple topic ids', async (t) => {
  const got = await getTopicIds({
    topics: [{ path: '/my-topic' }, { path: '/my-other-topic' }],
    language: 'en',
    useCache: false,
    apiFn,
  })
  t.deepEqual(
    got,
    ['123-my-topic', '123-my-other-topic'],
    'the topic ids should match '
  )
})

test('get multiple topic ids and one 404', async (t) => {
  const got = await getTopicIds({
    topics: [{ path: '/my-topic' }, { path: '/topic-that-does-not-exist' }],
    language: 'en',
    useCache: false,
    apiFn,
  })

  t.deepEqual(got, ['123-my-topic'], 'the topic ids should match ')
})
