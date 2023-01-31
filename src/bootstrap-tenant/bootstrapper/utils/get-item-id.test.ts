import test from 'ava'
import { BootstrapperContext } from '.'
import { IcallAPIResult } from './api'
import { getItemId, IGetItemIdProps, ItemAndParentId } from './get-item-id'

interface testCase {
  name: string
  props: IGetItemIdProps
  expected: ItemAndParentId
}

const testCases: testCase[] = [
  {
    name: 'gets item id by catalogue path from context if it exists',
    props: {
      context: {
        itemCataloguePathToIDMap: new Map<string, ItemAndParentId>().set(
          '/foo/bar/baz',
          { itemId: 'some-id-1', parentId: 'some-parent-id-1' }
        ),
      } as BootstrapperContext,
      language: 'en',
      cataloguePath: '/foo/bar/baz',
    },
    expected: {
      itemId: 'some-id-1',
      parentId: 'some-parent-id-1',
    },
  },
  {
    name: 'gets item id by catalogue path from the api if it exists',
    props: {
      context: {
        callCatalogue: async (_) =>
          ({
            data: {
              published: {
                id: 'some-id',
                parent: {
                  id: 'some-parent-id',
                },
              },
            },
          } as IcallAPIResult),
        itemCataloguePathToIDMap: new Map<string, ItemAndParentId>(),
      } as BootstrapperContext,
      language: 'en',
      cataloguePath: '/foo/bar/baz',
    },
    expected: {
      itemId: 'some-id',
      parentId: 'some-parent-id',
    },
  },
  {
    name: 'gets item id by external reference from context if it exists',
    props: {
      context: {
        itemExternalReferenceToIDMap: new Map<string, ItemAndParentId>().set(
          'some-item',
          { itemId: 'some-id', parentId: 'some-parent-id' }
        ),
      } as BootstrapperContext,
      language: 'en',
      externalReference: 'some-item',
    },
    expected: {
      itemId: 'some-id',
      parentId: 'some-parent-id',
    },
  },
  {
    name: 'gets item id by external reference from the api if it exists',
    props: {
      context: {
        callPIM: async (_) =>
          ({
            data: {
              item: {
                getMany: [
                  {
                    id: 'some-id',
                    tree: {
                      parentId: 'some-parent-id',
                    },
                  },
                ],
              },
            },
          } as IcallAPIResult),
        itemExternalReferenceToIDMap: new Map<string, ItemAndParentId>(),
      } as BootstrapperContext,
      language: 'en',
      externalReference: 'some-item',
    },
    expected: {
      itemId: 'some-id',
      parentId: 'some-parent-id',
    },
  },
]

testCases.forEach((tc) =>
  test.serial(tc.name, async (t) => {
    const actual = await getItemId(tc.props)
    t.deepEqual(
      actual,
      tc.expected,
      'id and parent respose matches expected value'
    )
  })
)
