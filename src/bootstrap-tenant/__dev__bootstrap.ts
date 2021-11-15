import { config } from 'dotenv'
config()

import { readFileSync } from 'fs'
import { resolve } from 'path'
import Progress from 'cli-progress'

import { bootstrapTenant } from './index'
import { EVENT_NAMES, Status } from './bootstrapper'

function bootstrap() {
  const tenantIdentifier = 'hkn-examples'
  // const jsonSpec = JSON.parse(
  //   readFileSync(
  //     resolve(__dirname, '../../json-spec/this-will-error-out.json'),
  //     'utf-8'
  //   )
  // )

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
      topicMaps: [
        {
          path: '/serier-2',
          name: "serier-2"
        },
        {
          path: '/serier-2/hei',
          name: "Hei"
        }
      ],
      // items: [
      //   {
      //     name: 'Prod topics test',
      //     externalReference: 'prod-topics-test',
      //     shape: 'prod',
      //     vatType: 'No Tax',
      //     topics: [{ path: '/serier-hkn/kroghs-mobler' }],
      //     variants: [
      //       {
      //         sku: 'laskdmlasdals',
      //         name: 'var',
      //         price: 0,
      //         stock: {
      //           default: 8,
      //           'eu-wh': 96,
      //         },
      //       },
      //     ],
      //   },
      // ],
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

  // bootstrapper.on(EVENT_NAMES.STATUS_UPDATE, (a) => {
  //   console.log(JSON.stringify(a, null, 1))
  // })

  bootstrapper.on(EVENT_NAMES.ERROR, ({ error }) => {
    console.log(error)
  })

  bootstrapper.config.itemTopics = 'amend'

  bootstrapper.once(EVENT_NAMES.DONE, function ({ duration }) {
    // ProgressBar.stop()
    console.log(
      `✓ Done bootstrapping ${tenantIdentifier}. Duration: ${duration}`
    )
  })
}

bootstrap()
