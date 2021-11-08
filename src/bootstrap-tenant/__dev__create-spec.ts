import { config } from 'dotenv'
config()

import { writeFileSync } from 'fs'
import { resolve } from 'path'

import { Bootstrapper } from './index'

async function createSpec() {
  const tenantIdentifier = 'furniture'

  if (
    !process.env.CRYSTALLIZE_ACCESS_TOKEN_ID ||
    !process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  ) {
    throw new Error(
      'CRYSTALLIZE_ACCESS_TOKEN_ID and CRYSTALLIZE_ACCESS_TOKEN_SECRET must be set'
    )
  }

  console.log(`✨ Creating spec for ${tenantIdentifier} ✨`)

  const bootstrapper = new Bootstrapper()

  bootstrapper.setAccessToken(
    process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  )

  bootstrapper.setTenantIdentifier(tenantIdentifier)

  const spec = await bootstrapper.createSpec({
    shapes: false,
    grids: false,
    items: {
      basePath: '/courses',
    },
    languages: false,
    priceVariants: false,
    stockLocations: false,
    vatTypes: false,
    topicMaps: false,
    onUpdate: (u) => console.log(JSON.stringify(u, null, 1)),
  })

  writeFileSync(
    resolve(__dirname, `../../json-spec/${tenantIdentifier}.json`),
    JSON.stringify(spec),
    'utf-8'
  )

  console.log(`✨ Spec created ✨`)
}

createSpec()
