---
'@crystallize/import-utilities': minor
---

The `AreaStatus.error` interface is updated with an optional `item` field, which will be populated on the following events:
- CANNOT_HANDLE_ITEM,
- CANNOT_HANDLE_ITEM_RELATION
- CANNOT_HANDLE_PRODUCT

```
interface AreaError {
  message: string
  code:
    | 'UPLOAD_FAILED'
    | 'SHAPE_ID_MISSING'
    | 'CANNOT_HANDLE_ITEM'
    | 'CANNOT_HANDLE_PRODUCT'
    | 'CANNOT_HANDLE_ITEM_RELATION'
    | 'OTHER'
  item?: JSONItem
}
```

Furthermore, the `EVENT.NAMES.ERROR` event is extended with the optional `areaUpdate`, which _sometimes_ will be populated with extended information from the area, if it exists.

Usage:
```
bootstrapper.on(
  EVENT_NAMES.ERROR,
  ({ error, areaError, willRetry }: BootstrapperError) => {
    if (areaError) {
      console.log(JSON.stringify(areaError, null, 1))
    } else {
      console.log(JSON.stringify(error, null, 1))
    }
    if (!willRetry) {
      process.exit(1)
    }
  }
)
```