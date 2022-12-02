---
'@crystallize/import-utilities': minor
---

New event listener: `EVENT_NAMES.ITEM_PUBLISHED`. Will be triggered whenever an
item is published with the payload:
```
const payload: type ItemEventPayload = {
  id: string
  language: string
  name: string
}
```

Usage:
```
bootstrapper.on(EVENT_NAMES.ITEM_PUBLISHED, (payload: ItemEventPayload) => {
  console.log('Item was published', payload)
})
```