import { config } from 'dotenv'
config()

import { readFile } from 'fs/promises'
import { resolve } from 'path'
// import Progress from 'cli-progress'

import { Bootstrapper, EVENT_NAMES, Status } from './bootstrapper'
import { JSONImages, JSONParagraphCollection, JSONProduct } from './json-spec'

async function bootstrap() {
  try {
    const tenantIdentifier = 'hkn-examples'
    // const jsonSpec = JSON.parse(
    //   await readFile(
    //     resolve(__dirname, '../../json-spec/photofinder.json'),
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

    const bootstrapper = new Bootstrapper()

    bootstrapper.setTenantIdentifier(tenantIdentifier)

    bootstrapper.setAccessToken(
      process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
      process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
    )

    bootstrapper.setSpec({
      languages: [
        {
          name: 'English',
          code: 'en',
          isDefault: true,
        },
        {
          name: 'French',
          code: 'fr',
          isDefault: false,
        },
      ],
      shapes: [
        {
          name: 'Example multilingual',
          identifier: 'multilingual',
          type: 'product',
          components: [
            {
              name: 'single-line',
              id: 'single-line',
              type: 'singleLine',
            },
            {
              name: 'rich-text',
              id: 'rich-text',
              type: 'richText',
            },
            {
              name: 'images',
              id: 'images',
              type: 'images',
            },
            {
              name: 'paragraph-collection',
              id: 'paragraph-collection',
              type: 'paragraphCollection',
            },
          ],
        },
      ],
      vatTypes: [
        {
          name: 'No Tax',
          percent: 0,
        },
      ],
      items: [
        {
          name: {
            en: 'Multilingual',
            fr: 'Multilingue',
          },
          shape: 'multilingual',
          externalReference: 'multilingual', // Overwrite existing item
          vatType: 'No Tax',
          variants: [
            {
              sku: 'multilingual-product',
              name: {
                en: 'Multilingual',
                fr: 'Multilingue',
              },
              isDefault: true,
            },
          ],
          components: {
            'single-line': {
              en: 'I am a single line',
              fr: 'Je suis une seule ligne',
            },
            'rich-text': {
              en: {
                html: '<p>Look at this <strong>rich</strong> text</p>',
              },
              fr: {
                html: '<p>Regardez ce texte <strong>riche</strong></p>',
              },
            },
            images: [
              {
                src:
                  'https://media.crystallize.com/crystallize_marketing/21/10/29/3/@500/headless_commerce_for_product_storytellers_crystallize.png',
                altText: {
                  en: 'Headless ecommerce in space',
                  fr: "E-commerce sans tête dans l'espace",
                },
                caption: {
                  en: {
                    plainText: 'Illustration by Gina Kirlew',
                  },
                  fr: {
                    plainText: 'Illustration par Gina Kirlew',
                  },
                },
              },
            ] as JSONImages,
            'paragraph-collection': [
              {
                title: {
                  en: 'The first paragraph title',
                  fr: 'Le titre du premier paragraphe',
                },
                body: {
                  en: {
                    html: '<p>The first paragraph body</p>',
                  },
                  fr: {
                    html: '<p>Le corps du premier paragraphe</p>',
                  },
                },
                images: [
                  {
                    src:
                      'https://media.crystallize.com/crystallize_marketing/21/10/29/6/@500/semantic_pim_api.jpeg',
                    altText: {
                      en: 'Delivering pizza on a scooter',
                      fr: 'Livrer des pizzas en scooter',
                    },
                    caption: {
                      en: {
                        plainText: 'Illustration by Gina Kirlew',
                      },
                      fr: {
                        plainText: 'Illustration par Gina Kirlew',
                      },
                    },
                  },
                ],
              },
            ] as JSONParagraphCollection[],
          },
          _options: {
            publish: true,
          },
        } as JSONProduct,
      ],
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

    let itemProgress = -1
    bootstrapper.on(EVENT_NAMES.STATUS_UPDATE, (a) => {
      const i = a.items.progress
      if (i !== itemProgress) {
        itemProgress = i
        console.log(new Date(), itemProgress)
      }
    })

    bootstrapper.on(EVENT_NAMES.ERROR, ({ error }) => {
      console.log(error)
    })

    // bootstrapper.config.itemTopics = 'amend'
    bootstrapper.config.logLevel = 'verbose'
    bootstrapper.config.multilingual = true

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
