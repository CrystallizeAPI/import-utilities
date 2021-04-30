import test from 'ava'

import { TopicInput } from '../types'

import { buildDeleteTopicMutation } from './build-delete-topic-mutation'

test('delete mutation for topic', (t) => {
  const got = buildDeleteTopicMutation('1234').replace(/ /g, '')

  const want: string = `
    mutation {
      topic {
        delete(
          id: "1234"
        )
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
