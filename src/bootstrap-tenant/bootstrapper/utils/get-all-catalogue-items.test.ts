import test from 'ava'
import { buildPathShouldBeIncludedValidator } from './get-all-catalogue-items'

test('pathValidator should work with single level paths', (t) => {
  const validator = buildPathShouldBeIncludedValidator('/shop')

  t.is(true, validator('/shop'))
  t.is(true, validator('/shop/product'))
  t.is(true, validator('/shop2/product'))

  t.is(false, validator('/'))
  t.is(false, validator('/prods'))
})

test('pathValidator should work with nested paths', (t) => {
  const validator = buildPathShouldBeIncludedValidator('/products/shoes')

  t.is(true, validator('/products/shoes'))

  t.is(false, validator('/products'))
  t.is(false, validator('/shoes'))
  t.is(false, validator('/'))
})
