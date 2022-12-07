import { config } from 'dotenv'
config()

import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { BootstrapperError } from './bootstrapper'

import { Bootstrapper, EVENT_NAMES } from './index'


async function createSpec() {
  const tenantIdentifier = 'love-is-in-the-air'

  console.log(`✨ Creating spec for ${tenantIdentifier} ✨`)

  const bootstrapper = new Bootstrapper()
  bootstrapper.env = "dev"
  // bootstrapper.env = 'prod'

  bootstrapper.setAccessToken(
    process.env.DEV_CRYSTALLIZE_ACCESS_TOKEN_ID!,
    process.env.DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET!
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
    shapes: false,
    grids: false,
    items: false,
    languages: false,
    priceVariants: false,
    stockLocations: false,
    vatTypes: false,
    subscriptionPlans: false,
    topicMaps: false,
    orders: false,
    customers: true,
    onUpdate: (u) => console.log(JSON.stringify(u, null, 1)),
  })

  writeFileSync(`./${tenantIdentifier}.json`, JSON.stringify(spec,null, 2), 'utf-8')

  console.log(`✨ Spec created (${tenantIdentifier}.json) ✨`)
}

createSpec()
