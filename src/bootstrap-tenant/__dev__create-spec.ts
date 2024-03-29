import { config } from 'dotenv'
config()

import { writeFileSync } from 'fs'
import { BootstrapperError } from './bootstrapper'

import { Bootstrapper, EVENT_NAMES } from './index'

async function createSpec() {
  const tenantIdentifier = 'dounot'

  console.log(`✨ Creating spec for ${tenantIdentifier} ✨`)

  const bootstrapper = new Bootstrapper()
  bootstrapper.env = 'dev'
  // bootstrapper.env = 'prod'

  bootstrapper.setAccessToken(
    process.env.DEV_CRYSTALLIZE_ACCESS_TOKEN_ID!,
    process.env.DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET!
  )

  bootstrapper.setTenantIdentifier(tenantIdentifier)
  bootstrapper.config.multilingual = true
  // bootstrapper.config.logLevel = 'verbose'

  bootstrapper.on(EVENT_NAMES.ERROR, (error: BootstrapperError) => {
    if (error.willRetry) {
      console.log(error)
    }
  })

  const timeStart = new Date()
  const spec = await bootstrapper.createSpec({
    languages: true,
    vatTypes: true,
    priceVariants: true,
    shapes: true,
    topicMaps: true,
    grids: true,
    items: {
      version: 'published',
      includeDescendantsOfUnpublishedFolders: false,
    },
    stockLocations: true,
    subscriptionPlans: true,
    customers: false,
    orders: false,
    onUpdate: (areaUpdate) => {
      console.log(JSON.stringify(areaUpdate, null, 1))
    },
  })
  const timeEnd = new Date()

  writeFileSync(
    `./json-spec/${tenantIdentifier}.json`,
    JSON.stringify(spec, null, 2),
    'utf-8'
  )

  console.log(
    `✨ Spec created (${tenantIdentifier}.json). Duration: ${
      (timeEnd.getTime() - timeStart.getTime()) / 1000
    }s ✨`
  )
}

createSpec()
