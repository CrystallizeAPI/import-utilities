import { config } from 'dotenv'
config()

import { readFile } from 'fs/promises'
import { resolve } from 'path'
// import Progress from 'cli-progress'

import { Bootstrapper, BootstrapperError, EVENT_NAMES } from './bootstrapper'
import { JsonSpec } from './json-spec'

async function bootstrap() {
  try {
    const tenantIdentifier = 'hkn-test-shape-clear'
    const jsonSpec: JsonSpec = {
      shapes: [
        {
          identifier: 'test-folder',
          name: 'Test Folder',
          type: 'folder',
          components: [
            {
              id: 'alsdj',
              type: 'singleLine',
              name: 'h',
            },
          ],
        },
      ],
    }

    console.log(`✨ Bootstrapping ${tenantIdentifier} ✨`)

    const bootstrapper = new Bootstrapper()
    // bootstrapper.env = 'dev'

    // bootstrapper.config.shapeComponents = 'amend'
    bootstrapper.setTenantIdentifier(tenantIdentifier)

    bootstrapper.setAccessToken(
      process.env.CRYSTALLIZE_ACCESS_TOKEN_ID!,
      process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET!
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
      ({ error, willRetry }: BootstrapperError) => {
        console.log({ willRetry }, error)
        if (!willRetry) {
          // process.exit(1)
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
