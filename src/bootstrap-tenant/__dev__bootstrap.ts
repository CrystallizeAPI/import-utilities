import { config } from 'dotenv'
config()

import { readFile } from 'fs/promises'

import { Bootstrapper, BootstrapperError, EVENT_NAMES } from './bootstrapper'
import { JsonSpec } from './json-spec'

async function bootstrap() {
  try {
    const tenantIdentifier = 'dounot-copy'
    const jsonSpec: JsonSpec = JSON.parse(
      await readFile('./json-spec/dounot.json', 'utf-8')
    )

    console.log(`✨ Bootstrapping ${tenantIdentifier} ✨`)

    const bootstrapper = new Bootstrapper()
    // bootstrapper.config.logLevel = 'verbose'
    bootstrapper.env = 'dev'

    // bootstrapper.config.shapeComponents = 'amend'
    bootstrapper.setTenantIdentifier(tenantIdentifier)

    bootstrapper.setAccessToken(
      process.env.DEV_CRYSTALLIZE_ACCESS_TOKEN_ID!,
      process.env.DEV_CRYSTALLIZE_ACCESS_TOKEN_SECRET!
    )

    bootstrapper.setSpec(jsonSpec)

    let itemProgress = -1
    bootstrapper.on(EVENT_NAMES.STATUS_UPDATE, (a) => {
      const i = a.items.progress
      if (i !== itemProgress) {
        itemProgress = i
        console.log(new Date(), itemProgress)
      }
    })

    bootstrapper.on(
      EVENT_NAMES.ERROR,
      ({ error, areaError, willRetry }: BootstrapperError) => {
        if (areaError) {
          console.log(JSON.stringify(areaError, null, 1))
        } else {
          console.log(JSON.stringify(error, null, 1))
        }
        if (!willRetry) {
          process.exit(1)
        }
      }
    )

    bootstrapper.once(EVENT_NAMES.DONE, function ({ duration }) {
      // ProgressBar.stop()
      console.log(
        `✓ Done bootstrapping ${tenantIdentifier}. Duration: ${duration}`
      )
      process.exit(0)
    })

    bootstrapper.start()
  } catch (e) {
    console.log(e)
  }
}

bootstrap()
