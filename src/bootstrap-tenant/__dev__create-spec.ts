import { config } from 'dotenv'
config()

import { writeFileSync } from 'fs'
import { BootstrapperError } from './bootstrapper'

import { Bootstrapper, EVENT_NAMES } from './index'

async function createSpec() {
  const tenantIdentifier = 'frntr'

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
    languages: false,
    vatTypes: false,
    priceVariants: false,
    shapes: false,
    topicMaps: false,
    grids: false,
    items: {
      version: 'published',
      includeDescendantsOfUnpublishedFolders: true,
    },
    stockLocations: false,
    subscriptionPlans: false,
    onUpdate: (areaUpdate) => {
      console.log(JSON.stringify(areaUpdate, null, 1))
    },
  })
  const timeEnd = new Date()

  writeFileSync(
    `./json-spec/${tenantIdentifier}-published.json`,
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
