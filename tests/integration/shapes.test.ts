import 'dotenv/config'
import test from 'ava'
import { v4 } from 'uuid'
import {
  deleteTenantMutation,
  tenant,
} from '@crystallize/import-export-sdk/tenant'
import { Tenant } from '@crystallize/schema/tenant'
import { Bootstrapper, EVENT_NAMES, JSONShape } from '../../src/index'
import {
  ClientInterface,
  createClient,
  createMassCallClient,
} from '@crystallize/js-api-client'
import { fail } from 'assert'
import { getManyShapesQuery } from '@crystallize/import-export-sdk/shape'
import { Shape } from '@crystallize/schema/shape'

const { CRYSTALLIZE_ACCESS_TOKEN_ID, CRYSTALLIZE_ACCESS_TOKEN_SECRET } =
  process.env

if (!CRYSTALLIZE_ACCESS_TOKEN_ID || !CRYSTALLIZE_ACCESS_TOKEN_SECRET) {
  throw new Error('access token not set')
}

interface TestCase {
  name: string
  shapes: JSONShape[]
}

interface TestContext {
  tenant: Tenant
  client: ClientInterface
}

const testCases: TestCase[] = [
  {
    name: 'Creates basic shapes',
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
  },
  {
    name: 'Creates a shape with basic components',
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
            id: 'number',
            name: 'Number',
            type: 'numeric',
            config: {
              decimalPlaces: 5,
              units: ['g', 'kg'],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Creates a shape with components with enums in config',
    shapes: [
      {
        identifier: 'test-folder',
        name: 'Test Folder',
        type: 'folder',
        components: [
          {
            id: 'files',
            name: 'files',
            type: 'files',
            config: {
              min: 1,
              max: 5,
              maxFileSize: {
                size: 20,
                unit: 'MiB',
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Creates shapes with relations to one another',
    shapes: [
      {
        identifier: 'test-folder',
        name: 'Test Folder',
        type: 'folder',
        components: [
          {
            id: 'relation',
            name: 'relation',
            type: 'itemRelations',
            config: {
              acceptedShapeIdentifiers: ['test-product'],
            },
          },
        ],
      },
      {
        identifier: 'test-product',
        name: 'Test Product',
        type: 'product',
        components: [
          {
            id: 'relation',
            name: 'relation',
            type: 'itemRelations',
            config: {
              acceptedShapeIdentifiers: ['test-folder'],
            },
          },
        ],
      },
    ],
  },
]

test.beforeEach(async (t) => {
  const identifier = `import-utilities-test-${v4()}`

  const client = createClient({
    tenantIdentifier: identifier,
    accessTokenId: CRYSTALLIZE_ACCESS_TOKEN_ID,
    accessTokenSecret: CRYSTALLIZE_ACCESS_TOKEN_SECRET,
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
    bootstrapper.setTenantIdentifier(ctx.tenant.identifier)
    bootstrapper.setAccessToken(
      CRYSTALLIZE_ACCESS_TOKEN_ID,
      CRYSTALLIZE_ACCESS_TOKEN_SECRET
    )

    bootstrapper.setSpec({
      shapes: tc.shapes,
    })

    bootstrapper.on(EVENT_NAMES.ERROR, (err) => fail(err))
    await bootstrapper.start()

    const { query, variables } = getManyShapesQuery(
      { tenantId: ctx.tenant.id },
      { includeComponents: true }
    )
    const res = await ctx.client
      .pimApi(query, variables)
      .then((res) => res?.shape?.getMany)

    if (!res) {
      return fail('failed to fetch shapes for tenant')
    }

    const shapes = res as Shape[]
    t.is(shapes.length, tc.shapes.length)

    tc.shapes.forEach((input) => {
      const shape = shapes.find(
        ({ identifier }) => input.identifier === identifier
      )
      if (!shape) {
        return fail(`shape with identifier ${input.identifier} was not created`)
      }

      t.is(shape.identifier, input.identifier)
      t.is(shape.name, input.name)

      // TODO: Better component testing
      t.is(shape.components?.length, input.components?.length)
      t.is(shape.variantComponents?.length, input.variantComponents?.length)
    })
  })
})
