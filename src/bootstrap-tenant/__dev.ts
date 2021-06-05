import { config } from 'dotenv'
config()

import { readFileSync } from 'fs'
import { resolve } from 'path'

import { bootstrapTenant } from './index'
import { EVENT_NAMES } from './bootstrapper'

function bootstrap() {
  const tenantIdentifier = 'furniture-hkn'
  const spec = readFileSync(
    resolve(__dirname, '../../json-spec/furniture-with-more.json'),
    'utf-8'
  )

  console.log(`✨ Bootstrapping ${tenantIdentifier}... ✨`)
  const bootstrapper = bootstrapTenant({
    tenantIdentifier: 'furniture-hkn',
    jsonSpec: JSON.parse(spec),
    CRYSTALLIZE_ACCESS_TOKEN_ID: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    CRYSTALLIZE_ACCESS_TOKEN_SECRET:
      process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
  })

  bootstrapper.on(EVENT_NAMES.SHAPES_UPDATE, function (status) {
    console.log(`.. Setting shapes... ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.SHAPES_DONE, function () {
    console.log(`.. Setting shapes... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_UPDATE, function (status) {
    console.log(`.. Setting price variants... ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_DONE, function () {
    console.log(`.. Setting price variants... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.LANGUAGES_UPDATE, function (status) {
    console.log(`.. Setting languages... ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.LANGUAGES_DONE, function () {
    console.log(`.. Setting languages... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.VAT_TYPES_UPDATE, function (status) {
    console.log(`.. Setting vat types... ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.VAT_TYPES_DONE, function () {
    console.log(`.. Setting vat types... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.TOPICS_UPDATE, function (status) {
    console.log(`.. Setting topics... ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.TOPICS_DONE, function () {
    console.log(`.. Setting topics... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.ITEMS_UPDATE, function (status) {
    console.log(`.. Setting items... ${status.message}`)
  })
  bootstrapper.on(EVENT_NAMES.ITEMS_DONE, function () {
    console.log(`.. Setting items... ✓`)
  })

  bootstrapper.once(EVENT_NAMES.DONE, function (args) {
    console.log(`✓ Done bootstrapping ${tenantIdentifier}`)
  })
}

bootstrap()
