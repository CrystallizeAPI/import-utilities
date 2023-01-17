---
'@crystallize/import-utilities': minor
---

Allow products to be updated without specifying `vatType` or `variants`. You can now update an existing product with this spec:
```
const jsonSpec: JsonSpec = {
  items: [
    {
      name: 'Product updated from import-utilities 💥',
      shape: 'default-product',
      externalReference: 'my-existing-product',
    },
  ],
}
```
