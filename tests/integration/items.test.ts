import 'dotenv/config'
import test from 'ava'
import { v4 } from 'uuid'
import { deleteTenantMutation, tenant } from '@crystallize/import-export-sdk'
import { Tenant } from '@crystallize/schema'
import {
  Bootstrapper,
  EVENT_NAMES,
  JSONComponentContent,
  JSONComponents,
  JSONItem,
  JSONProduct,
} from '../../src/index'
import {
  ClientInterface,
  createClient,
  createMassCallClient,
} from '@crystallize/js-api-client'
import { fail } from 'assert'
import { Shape } from '@crystallize/schema'
import { validateObject } from './_utils'
import { BootstrapperError } from '../../src/bootstrap-tenant/bootstrapper'

const { DEV_CRYSTALLIZE_ACCESS_TOKEN_ID, DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET } =
  process.env

if (!DEV_CRYSTALLIZE_ACCESS_TOKEN_ID || !DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET) {
  throw new Error('access token not set')
}

interface TestCase {
  name: string
  shapes: Shape[]
  items: JSONItem[]
}

interface TestContext {
  tenant: Tenant
  client: ClientInterface
}

const testCases: TestCase[] = [
  {
    name: 'Creates basic items',
    shapes: [
      {
        identifier: 'test-folder',
        name: 'Test Folder',
        type: 'folder',
      },
      {
        identifier: 'test-product',
        name: 'Test Product',
        type: 'product',
      },
    ],
    items: [
      {
        name: 'Basic Folder',
        shape: 'test-folder',
      },
      {
        name: 'Basic product',
        shape: 'test-product',
        vatType: 'No Tax',
        variants: [
          {
            name: 'Basic Variant',
            sku: 'basic-variant',
          },
        ],
      },
    ],
  },
  {
    name: 'Creates basic components on items',
    shapes: [
      {
        identifier: 'test-folder',
        name: 'Test Folder',
        type: 'folder',
        components: [
          {
            id: 'text',
            name: 'Text',
            type: 'singleLine',
          },
          {
            id: 'chunk',
            name: 'Chunk',
            type: 'contentChunk',
            config: {
              repeatable: true,
              components: [
                {
                  id: 'numeric',
                  name: 'Numeric',
                  type: 'numeric',
                },
              ],
            },
          },
        ],
      },
    ],
    items: [
      {
        name: 'Test Folder',
        shape: 'test-folder',
        components: {
          text: 'Hello world',
          chunk: [
            {
              numeric: {
                number: 123,
              },
            },
            {
              numeric: {
                number: 456,
              },
            },
          ],
        },
      },
    ],
  },
  // {
  //   name: 'Creates items with item relations',
  //   shapes: [
  //     {
  //       identifier: 'test-folder',
  //       name: 'Test Folder',
  //       type: 'folder',
  //       components: [
  //         {
  //           id: 'itemRelations',
  //           name: 'Relation',
  //           type: 'itemRelations',
  //         },
  //       ],
  //     },
  //   ],
  //   items: [
  //     {
  //       name: 'Test Folder 2',
  //       shape: 'test-folder',
  //       cataloguePath: '/test-folder-2',
  //     },
  //     {
  //       name: 'Test Folder',
  //       shape: 'test-folder',
  //       components: {
  //         itemRelations: [
  //           {
  //             cataloguePath: '/test-folder-2',
  //           },
  //         ],
  //       },
  //     },
  //   ],
  // },
  // {
  //   name: 'Creates variants with item relations',
  //   shapes: [
  //     {
  //       identifier: 'test-folder',
  //       name: 'Test Folder',
  //       type: 'folder',
  //     },
  //     {
  //       identifier: 'test-product',
  //       name: 'Test product',
  //       type: 'product',
  //       variantComponents: [
  //         {
  //           id: 'itemRelations',
  //           name: 'Relation',
  //           type: 'itemRelations',
  //         },
  //       ],
  //     },
  //   ],
  //   items: [
  //     {
  //       name: 'Test Folder',
  //       shape: 'test-folder',
  //       cataloguePath: '/test-folder',
  //     },
  //     {
  //       name: 'Test Folder 2',
  //       shape: 'test-folder',
  //       cataloguePath: '/test-folder-2',
  //     },
  //     {
  //       name: 'Test Product',
  //       shape: 'test-product',
  //       vatType: 'No Tax',
  //       variants: [
  //         {
  //           name: 'Variant 1',
  //           sku: 'variant-1',
  //           components: {
  //             itemRelations: [
  //               {
  //                 cataloguePath: '/test-folder',
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           name: 'Variant 2',
  //           sku: 'variant-2',
  //           components: {
  //             itemRelations: [
  //               {
  //                 cataloguePath: '/test-folder-2',
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: 'Creates variants with item relations in structural components',
  //   shapes: [
  //     {
  //       identifier: 'test-folder',
  //       name: 'Test Folder',
  //       type: 'folder',
  //     },
  //     {
  //       identifier: 'test-product',
  //       name: 'Test product',
  //       type: 'product',
  //       variantComponents: [
  //         {
  //           id: 'chunk',
  //           name: 'Chunk',
  //           type: 'contentChunk',
  //           config: {
  //             components: [
  //               {
  //                 id: 'chunkRelation',
  //                 name: 'Relation in chunk',
  //                 type: 'itemRelations',
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           id: 'choice',
  //           name: 'Choice',
  //           type: 'componentChoice',
  //           config: {
  //             choices: [
  //               {
  //                 id: 'choiceRelation',
  //                 name: 'Relation in choice',
  //                 type: 'itemRelations',
  //               },
  //               {
  //                 id: 'text',
  //                 name: 'Text',
  //                 type: 'singleLine',
  //               },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   items: [
  //     {
  //       name: 'Test Folder',
  //       shape: 'test-folder',
  //       cataloguePath: '/test-folder',
  //     },
  //     {
  //       name: 'Test Folder 2',
  //       shape: 'test-folder',
  //       cataloguePath: '/test-folder-2',
  //     },
  //     {
  //       name: 'Test Product',
  //       shape: 'test-product',
  //       vatType: 'No Tax',
  //       variants: [
  //         {
  //           name: 'Variant 1',
  //           sku: 'variant-1',
  //           components: {
  //             chunk: [
  //               {
  //                 chunkRelation: [
  //                   {
  //                     cataloguePath: '/test-folder',
  //                   },
  //                 ],
  //               },
  //             ],
  //             choice: {
  //               choiceRelation: [
  //                 {
  //                   cataloguePath: '/test-folder-2',
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
]

test.beforeEach(async (t) => {
  const identifier = `import-utilities-test-${v4()}`

  const client = createClient({
    tenantIdentifier: identifier,
    accessTokenId: DEV_CRYSTALLIZE_ACCESS_TOKEN_ID,
    accessTokenSecret: DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET,
    origin: '-dev.crystallize.digital',
  })

  const res = await tenant({
    identifier,
    name: `Import Utilities Test (${identifier})`,
    shapes: [],
  }).execute(createMassCallClient(client, {}))

  if (!res) {
    fail('failed to create tenant')
  }

  console.log(`Created tenant ${res.identifier} (${res.id})`)

  t.context = {
    tenant: res,
    client,
  }
})

test.afterEach.always(async (t) => {
  const ctx = t.context as TestContext
  const { query, variables } = deleteTenantMutation({ id: ctx.tenant.id })
  await ctx.client.pimApi(query, variables)
  console.log(`Deleted tenant ${ctx.tenant.identifier} (${ctx.tenant.id})`)
})

testCases.forEach((tc) => {
  test(tc.name, async (t) => {
    const ctx = t.context as TestContext

    const bootstrapper = new Bootstrapper()
    bootstrapper.env = 'dev'
    bootstrapper.setTenantIdentifier(ctx.tenant.identifier)
    bootstrapper.setAccessToken(
      DEV_CRYSTALLIZE_ACCESS_TOKEN_ID,
      DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET
    )
    bootstrapper.setSpec({
      shapes: tc.shapes,
      items: tc.items,
    })

    bootstrapper.on(EVENT_NAMES.ERROR, (err: BootstrapperError) => {
      if (!err.willRetry) {
        console.error(err)
      }
    })
    await bootstrapper.start()

    const spec = await bootstrapper.createSpec()

    tc.items.forEach((input) => {
      // @ts-ignore
      const actual = spec.items?.find((item) => item.name['en'] === input.name)
      if (!actual) {
        fail(`Item ${input.name} was not created`)
      }

      const validateComponents = (
        actual?: JSONComponents | null,
        input?: JSONComponents | null
      ) => {
        if (!input) {
          return
        }

        // deliberate assignment of null
        if (input === null && actual === null) {
          return
        }

        if (!actual) {
          return fail('No components were created')
        }

        Object.keys(input).map((key: string) => {
          // hacky short term workaround for multilingual testing
          // @ts-ignore
          if (typeof actual[key] === 'object' && actual[key]?.['en']) {
            // @ts-ignore
            return t.is(actual[key]?.['en'], input[key])
          }

          if (
            Array.isArray(input[key]) &&
            // @ts-ignore
            (input[key] as any[])?.length &&
            // @ts-ignore
            typeof input[key]?.[0] !== 'object'
          ) {
            return t.is(actual[key], input[key])
          }

          if (typeof input[key] === 'object') {
            return validateObject(t, actual[key] as any, input[key] as any)
          }
          t.is(actual[key], input[key])
        })
      }

      if (input.components) {
        validateComponents(actual.components, input.components)
      }

      const actualProduct = actual as JSONProduct
      if (actualProduct.variants?.length) {
        const inputProduct = input as JSONProduct
        t.is(actualProduct.vatType, inputProduct.vatType)

        inputProduct.variants.forEach((inputVariant) => {
          const actualVariant = actualProduct.variants.find(
            (v) => v.sku === inputVariant.sku
          )
          if (!actualVariant) {
            fail(`Variant ${inputVariant.sku} was not created`)
          }

          if (inputVariant.components) {
            validateComponents(
              actualVariant.components,
              inputVariant.components
            )
          }

          // @ts-ignore
          t.is(actualVariant.name['en'], inputVariant.name)
        })
      }

      t.is(actual.shape, input.shape)
    })
  })
})
