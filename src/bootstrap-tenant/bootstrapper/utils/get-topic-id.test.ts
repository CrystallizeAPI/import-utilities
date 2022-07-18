import test from 'ava'
import { BootstrapperContext } from '.'
import { IcallAPIResult } from './api'
import { getItemId, IGetItemIdProps, ItemAndParentId } from './get-item-id'
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
        tenantId: 'some-tenant',
        topicPathToIDMap: new Map<string, TopicAndTenantId>().set(
          '/foo/bar/baz',
          { topicId: 'some-topic-id', tenantId: 'some-tenant' }
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
  {
    name: 'ignores cache and gets topic id by path from the api if cached tenant id does not match',
    props: {
      context: {
        tenantId: 'some-other-tenant',
        topicPathToIDMap: new Map<string, TopicAndTenantId>().set(
          '/foo/bar/baz',
          { topicId: 'wrong-topic-id', tenantId: 'some-tenant' }
        ),
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
        itemCataloguePathToIDMap: new Map<string, ItemAndParentId>(),
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
