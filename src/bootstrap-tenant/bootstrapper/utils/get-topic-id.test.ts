import test from 'ava'
import { BootstrapperContext } from '.'
import { IcallAPIResult } from './api'
import { getTopicId, IGetTopicIdProps, TopicAndTenantId } from './get-topic-id'

interface testCase {
  name: string
  props: IGetTopicIdProps
  expected: TopicAndTenantId
}

const testCases: testCase[] = [
  {
    name: 'gets topic id by path from context if it exists',
    props: {
      context: {
        topicPathToIDMap: new Map<string, string>().set(
          '/foo/bar/baz',
          'some-topic-id'
        ),
      } as BootstrapperContext,
      language: 'en',
      topic: {
        path: '/foo/bar/baz',
      },
      useCache: true,
    },
    expected: {
      topicId: 'some-topic-id',
      tenantId: 'some-tenant',
    },
  },
  {
    name: 'gets topic id by path from the api if it exists',
    props: {
      context: {
        tenantId: 'some-tenant',
        topicPathToIDMap: new Map(),
        callPIM: async (_) =>
          ({
            data: {
              topic: {
                get: {
                  id: 'some-topic-id',
                },
              },
            },
          } as IcallAPIResult),
      } as BootstrapperContext,
      language: 'en',
      topic: {
        path: '/foo/bar/baz',
      },
      useCache: true,
    },
    expected: {
      topicId: 'some-topic-id',
      tenantId: 'some-tenant',
    },
  },
]

testCases.forEach((tc) =>
  test.serial(tc.name, async (t) => {
    const actual = await getTopicId(tc.props)
    t.deepEqual(actual, tc.expected.topicId, 'id matches expected value')
  })
)
