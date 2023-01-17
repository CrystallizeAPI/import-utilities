# @crystallize/import-utilities

## 1.16.0

### Minor Changes

- c1c7b25: Allow products to be updated without specifying `vatType` or
  `variants`. You can now update an existing product with this spec:
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

## 1.15.0

### Minor Changes

- d0429eb: Support fileName for media input. This allows you to define what the
  final fileName for an image should be, instead of just using the source image
  url. Example json spec:

  ```
  {
    "items": [
      ...
        "images": [
          {
            "src": "https://example.com/some-file.jpg",
            "fileName": "my-own-name-here.jpg"
          }
        ]
      ...
    ]
  }
  ```

## 1.14.3

### Patch Changes

- 9f0f393: Skipping eager asset upload in favor of data.

## 1.14.2

### Patch Changes

- c8ee74d: Fixed an issue with `bootstrapper.createSpec` with `basePath` being
  set as it only returned the _first_ matching item. It now returns _all_ items
  that has a `cataloguePath` that starts with the `basePath`.

## 1.14.1

### Patch Changes

- 79e2e5f: Handle 404 response codes from download of assets separately. This
  will no longer be retried 3 times.

## 1.14.0

### Minor Changes

- 134bec8: Added the ability to get all customers on create spec. Example:

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
    orders: false,
    customers: true,
    onUpdate: (u) => console.log(JSON.stringify(u, null, 1)),
  })
  ```

## 1.13.0

### Minor Changes

- 42c07fd: Added the ability to get all orders on create spec. Example:

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

## 1.12.0

### Minor Changes

- 58a0768: The `AreaStatus.error` interface is updated with an optional `item`
  field, which will be populated on the following events:

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

  Furthermore, the `EVENT.NAMES.ERROR` event is extended with the optional
  `areaUpdate`, which _sometimes_ will be populated with extended information
  from the area, if it exists.

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

## 1.11.1

### Patch Changes

- 86f31f5: Fixed a runtime error where the bootstrapper broke down if an item
  was `null`.

## 1.11.0

### Minor Changes

- 63949a4: New event listener: `EVENT_NAMES.ITEM_PUBLISHED`. Will be triggered
  whenever an item is published with the payload:

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

## 1.10.1

### Patch Changes

- c184a3f: Fixed an issue where setting product variant images to null caused
  the API to throw.

## 1.10.0

### Minor Changes

- 3c5845c: Handle item components with id "src". This was previously mistaken
  for a media item, and an upload was attempted, resulting in the bootstrapper
  to silently fail.

## 1.9.6

### Patch Changes

- b479843: Disable config.shapeComponents for now since it will clear component
  data for in the catalogue api for existing components, forcing a new publish
  of items. Falling back to the default option of "amend".

## 1.9.5

### Patch Changes

- 482e97a: Include imageUrl in order cart items

## 1.9.4

### Patch Changes

- 12c536b: Fixed validation for null orders in bootstrapper

## 1.9.3

### Patch Changes

- dea88bb: Fixed issue where the product variant components were sent even
  though the shape definition did not specify product variant components

## 1.9.2

### Patch Changes

- 3712700: Ensuring dist folder in published output

## 1.9.1

### Patch Changes

- 1737b4c: Include the dist folder back into the published package.

## 1.9.0

### Minor Changes

- 900f62d: Set the default value for shapeComponents. It is nice to set this
  explicitly so that you can inspect what the default value is from the code.

### Patch Changes

- 900f62d: Set the package status to not-private.

## 1.8.0

### Minor Changes

- 29b92af: Added new bootstrapper config option shapeComponents. It opens up for
  replacing all shape components with what you provide in the spec. Default
  value is "amdend", which will amend your components to what is already present
  for the shape.
