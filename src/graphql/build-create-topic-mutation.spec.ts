import test from 'ava'

import { TopicInput } from '../types'

import { buildCreateTopicMutation } from './build-create-topic-mutation'

test('create mutation for topic', (t) => {
  const input: TopicInput = {
    name: 'Cities',
    parentId: '',
    tenantId: '1234',
    children: [
      {
        name: 'Norway',
        children: [
          {
            name: 'Skien',
          },
          {
            name: 'Porsgrunn',
          },
        ],
      },
      {
        name: 'Portugal',
        children: [
          {
            name: 'Faro',
          },
          {
            name: 'Olhão',
          },
        ],
      },
    ],
  }

  const got = buildCreateTopicMutation(input, 'en').replace(/ /g, '')

  const want: string = `
    mutation {
      topic {
        create(
          input: {
            name: "Cities",
            parentId: "",
            tenantId: "1234",
            children: [
              {
                name: "Norway",
                children: [{ name: "Skien" }, { name: "Porsgrunn" }]
              },
              { name: "Portugal", children: [{ name: "Faro" }, { name: "Olhão" }] }
            ]
          },
          language: "en"
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
