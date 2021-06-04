import test from 'ava'

import { TopicUpdateInput } from '../types/topics/topic'
import { buildUpdateTopicMutation } from './build-update-topic-mutation'

test('update mutation for topic', (t) => {
  const topic: TopicUpdateInput = {
    id: 'some-id',
    language: 'en',
    input: {
      name: 'new topic name',
      parentId: '1234'
    },
  }

  const got = buildUpdateTopicMutation(topic).replace(/ /g, '')

  const want: string = `
    mutation {
      topic {
        update (
          id: "some-id",
          language: "en",
          input: {
            name: "new topic name",
            parentId: "1234"
          }
        ) {
          id
          name
        }
      }
    }
  `
    .replace(/\n/g, '')
    .replace(/ /g, '')

  t.is(got, want, 'mutation string should match')
})
