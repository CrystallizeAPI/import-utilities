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
    console.log(`.. Updating shapes... "${status.message}"`)
  })
  bootstrapper.on(EVENT_NAMES.SHAPES_DONE, function () {
    console.log(`.. Updating shapes... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_UPDATE, function (status) {
    console.log(`.. Updating price variants... "${status.message}"`)
  })
  bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_DONE, function () {
    console.log(`.. Updating price variants... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.LANGUAGES_UPDATE, function (status) {
    console.log(`.. Updating languages... "${status.message}"`)
  })
  bootstrapper.on(EVENT_NAMES.LANGUAGES_DONE, function () {
    console.log(`.. Updating languages... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.VAT_TYPES_UPDATE, function (status) {
    console.log(`.. Updating vat types... "${status.message}"`)
  })
  bootstrapper.on(EVENT_NAMES.VAT_TYPES_DONE, function () {
    console.log(`.. Updating vat types... ✓`)
  })
  bootstrapper.on(EVENT_NAMES.TOPICS_UPDATE, function (status) {
    console.log(`.. Updating topics... "${status.message}"`)
  })
  bootstrapper.on(EVENT_NAMES.TOPICS_DONE, function () {
    console.log(`.. Updating topics... ✓`)
  })

  bootstrapper.once(EVENT_NAMES.DONE, function (args) {
    console.log(`✓ Done bootstrapping ${tenantIdentifier}`)
  })
}

bootstrap()
