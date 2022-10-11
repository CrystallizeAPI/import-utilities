import test from 'ava'
import { buildPathShouldBeIncludedValidator } from './get-all-catalogue-items'

test('pathValidator should work with single level paths', (t) => {
  const validator = buildPathShouldBeIncludedValidator('/shop')

  t.is(true, validator('/shop').descendants)
  t.is(true, validator('/shop').thisItem)
  t.is(true, validator('/shop/product').thisItem)
  t.is(true, validator('/shop2/product').thisItem)
  t.is(true, validator('/').descendants)

  t.is(false, validator('/prods').descendants)
})

test('pathValidator should work with nested paths', (t) => {
  const validator = buildPathShouldBeIncludedValidator('/products/shoes')

  t.is(true, validator('/products/shoes').thisItem)
  t.is(true, validator('/products/shoes').descendants)
  t.is(true, validator('/products').descendants)

  t.is(false, validator('/shoes').descendants)
  t.is(false, validator('/').thisItem)
})
