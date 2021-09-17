import { config } from 'dotenv'
config()

// import { readFileSync } from 'fs'
import Progress from 'cli-progress'

import { bootstrapTenant } from './index'
import { EVENT_NAMES, Status } from './bootstrapper'

function bootstrap() {
  const tenantIdentifier = 'hkn-examples'
  // const spec = JSON.parse(readFileSync(
  //   resolve(__dirname, '../../json-spec/simple-item-relation.json'),
  //   'utf-8'
  // ))

  if (
    !process.env.CRYSTALLIZE_ACCESS_TOKEN_ID ||
    !process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  ) {
    throw new Error(
      'CRYSTALLIZE_ACCESS_TOKEN_ID and CRYSTALLIZE_ACCESS_TOKEN_SECRET must be set'
    )
  }

  console.log(`✨ Bootstrapping ${tenantIdentifier} ✨`)

  const bootstrapper = bootstrapTenant({
    tenantIdentifier,
    jsonSpec: {
      languages: [
        {
          code: 'en',
          isDefault: true,
          name: 'English',
        },
      ],
      items: [
        {
          name: 'sadadad',
          vatType: 'No Tax',
          externalReference: 'my-only-product',
          shape: 'default-product',
          topics: [
            {
              path: '/geo/eu',
            },
            {
              path: '/geo',
            },
          ],
          variants: [
            {
              sku: 'sadadad-1625761575646',
              name: 'alksdj',
              price: {
                default: 99,
              },
              stock: 1,
              isDefault: true,
            },
          ],
          components: {
            single: new Date().toLocaleString(),
          },
        },
      ],
    },
    CRYSTALLIZE_ACCESS_TOKEN_ID: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    CRYSTALLIZE_ACCESS_TOKEN_SECRET:
      process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
  })

  // const ProgressBar = new Progress.MultiBar({
  //   clearOnComplete: false,
  //   hideCursor: false,
  //   autopadding: true,
  //   format: '{bar} | {percentage}% | {area} | ETA: {eta}s',
  // })

  // function createProgress(area: string) {
  //   return ProgressBar.create(1, 0, {
  //     area,
  //   })
  // }

  // const ProgressLanguages = createProgress('Languages')
  // const ProgressPriceVariants = createProgress('Price variants')
  // const ProgressVatTypes = createProgress('Vat types')
  // const ProgressShapes = createProgress('Shapes')
  // const ProgressTopics = createProgress('Topics')
  // const ProgressGrids = createProgress('Grids')
  // const ProgressItems = createProgress('Items')
  // const ProgressMedia = createProgress('Media uploads')

  // bootstrapper.on(EVENT_NAMES.STATUS_UPDATE, function (status: Status) {
  //   ProgressMedia.update(status.media.progress)
  //   ProgressLanguages.update(status.languages.progress)
  //   ProgressPriceVariants.update(status.priceVariants.progress)
  //   ProgressVatTypes.update(status.vatTypes.progress)
  //   ProgressShapes.update(status.shapes.progress)
  //   ProgressTopics.update(status.topicMaps.progress)
  //   ProgressGrids.update(status.grids.progress)
  //   ProgressItems.update(status.items.progress)
  // })

  // bootstrapper.on(EVENT_NAMES.SHAPES_DONE, ProgressShapes.stop)
  // bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_DONE, ProgressPriceVariants.stop)
  // bootstrapper.on(EVENT_NAMES.LANGUAGES_DONE, ProgressLanguages.stop)
  // bootstrapper.on(EVENT_NAMES.VAT_TYPES_DONE, ProgressVatTypes.stop)
  // bootstrapper.on(EVENT_NAMES.TOPICS_DONE, ProgressTopics.stop)
  // bootstrapper.on(EVENT_NAMES.ITEMS_DONE, ProgressItems.stop)
  // bootstrapper.on(EVENT_NAMES.GRIDS_DONE, ProgressGrids.stop)

  bootstrapper.once(EVENT_NAMES.DONE, function ({ duration }) {
    // ProgressBar.stop()
    console.log(
      `✓ Done bootstrapping ${tenantIdentifier}. Duration: ${duration}`
    )
  })
}

bootstrap()
