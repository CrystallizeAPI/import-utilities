---
'@crystallize/import-utilities': minor
---

Added the ability to get all orders on create spec. Example:

```
const spec = await bootstrapper.createSpec({
  shapes: false,
  grids: false,
  items: false,
  languages: false,
  priceVariants: false,
  stockLocations: false,
  vatTypes: false,
  subscriptionPlans: false,
  topicMaps: false,
  orders: true,
  onUpdate: (u) => console.log(JSON.stringify(u, null, 1)),
})
```
