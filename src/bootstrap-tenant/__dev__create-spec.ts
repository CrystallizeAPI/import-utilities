import { config } from 'dotenv'
config()

import { writeFileSync } from 'fs'
import { BootstrapperError } from './bootstrapper'

import { Bootstrapper, EVENT_NAMES } from './index'

async function createSpec() {
  const tenantIdentifier = 'dounot'

  console.log(`✨ Creating spec for ${tenantIdentifier} ✨`)

  const bootstrapper = new Bootstrapper()
  // bootstrapper.env = 'dev'
  // bootstrapper.env = 'prod'

  bootstrapper.setAccessToken(
    process.env.CRYSTALLIZE_ACCESS_TOKEN_ID!,
    process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET!
  )

  bootstrapper.setTenantIdentifier(tenantIdentifier)
  bootstrapper.config.multilingual = false
  // bootstrapper.config.logLevel = 'verbose'

  bootstrapper.on(EVENT_NAMES.ERROR, (error: BootstrapperError) => {
    if (!error.willRetry) {
      console.log(error)
    }
  })

  const spec = await bootstrapper.createSpec({
    languages: false,
    vatTypes: false,
    priceVariants: false,
    shapes: true,
    topicMaps: false,
    grids: false,
    items: false,
    stockLocations: false,
    subscriptionPlans: false,
    onUpdate: (areaUpdate) => {
      console.log(JSON.stringify(areaUpdate, null, 1))
    },
  })

  writeFileSync(
    `./json-spec/${tenantIdentifier}.json`,
    JSON.stringify(spec, null, 2),
    'utf-8'
  )

  console.log(`✨ Spec created (${tenantIdentifier}.json) ✨`)
}

createSpec()
