import { config } from 'dotenv'
config()

import { readFileSync } from 'fs'
import { resolve } from 'path'

import { bootstrapTenant } from './index'
import { EVENT_NAMES } from './bootstrapper'

function bootstrap() {
  const tenantIdentifier = 'furniture-hkn'
  const spec = readFileSync(
    resolve(__dirname, '../../json-spec/voyage.json'),
    'utf-8'
  )

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
    jsonSpec: JSON.parse(spec),
    CRYSTALLIZE_ACCESS_TOKEN_ID: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    CRYSTALLIZE_ACCESS_TOKEN_SECRET:
      process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
  })

  bootstrapper.on(EVENT_NAMES.SHAPES_UPDATE, function (status) {
    console.log(`[Shapes] ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.SHAPES_DONE, function () {
    console.log(`[Shapes] ✓`)
  })
  bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_UPDATE, function (status) {
    console.log(`[Price variants] ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_DONE, function () {
    console.log(`[Price variants] ✓`)
  })
  bootstrapper.on(EVENT_NAMES.LANGUAGES_UPDATE, function (status) {
    console.log(`[Languages] ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.LANGUAGES_DONE, function () {
    console.log(`[Languages] ✓`)
  })
  bootstrapper.on(EVENT_NAMES.VAT_TYPES_UPDATE, function (status) {
    console.log(`[Vat types] ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.VAT_TYPES_DONE, function () {
    console.log(`[Vat types] ✓`)
  })
  bootstrapper.on(EVENT_NAMES.TOPICS_UPDATE, function (status) {
    console.log(`[Topics] ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.TOPICS_DONE, function () {
    console.log(`[Topics] ✓`)
  })
  bootstrapper.on(EVENT_NAMES.ITEMS_UPDATE, function (status) {
    console.log(`[Items] ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.ITEMS_DONE, function () {
    console.log(`[Items] ✓`)
  })

  bootstrapper.once(EVENT_NAMES.DONE, function (args) {
    console.log(`✓ Done bootstrapping ${tenantIdentifier}`)
  })
}

bootstrap()
