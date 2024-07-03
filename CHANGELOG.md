# @crystallize/import-utilities

## 1.33.0

### Minor Changes

- 0092300: fix the move of an existing item in children

## 1.32.0

### Minor Changes

- 84cc793: convert nullable boolean to false

## 1.30.0

### Minor Changes

- 14b396d: Add the JSONItem document as from in the CREATED and UPDATED event

## 1.29.0

### Minor Changes

- 53996d2: Add an option in the config to disable publish

## 1.28.7

### Patch Changes

- 17fe54b: reject an Error not a string

## 1.28.6

### Patch Changes

- 5393ddb: Add more visibility on uploading error

## 1.28.5

### Patch Changes

- df54201: fix importing variants with images and subscription plans

## 1.28.4

### Patch Changes

- 6da5976: typo where to get the token

## 1.28.3

### Patch Changes

- 18de93a: add token and secret on catalog calls to handle protected api"

## 1.28.2

### Patch Changes

- afafc0d: do not pass empty sessionid to js-api-client

## 1.28.1

### Patch Changes

- 5d97e84: Hotfix of parentId when creating an item

## 1.28.0

### Minor Changes

- 2db6ea6: Update dependencies

## 1.27.0

### Minor Changes

- 6beea90: Add Item Relation for SKUs

## 1.26.0

### Minor Changes

- 5134397: Upgrading packages and minor bugfix

## 1.25.0

### Minor Changes

- 5828857: Updated generated grapqhl schema

### Patch Changes

- 5828857: Updated dependencies to resolve vulnerabilities

## 1.24.4

### Patch Changes

- 65a058c: Fixed package links in readme

## 1.24.3

### Patch Changes

- e530a8c: Added types for useItemRelationsComponent extended
  component-content.input
- 24e5633: Added a fix for sanitization of not adding item relations components
  when found alone, in chunks and choice in items.ts for documents, products,
  and variant items.

## 1.24.2

### Patch Changes

- 81563ab: Fixed an issue where product variant component data would not be
  exported for all languages.

## 1.24.1

### Patch Changes

- dbe4a4c: Fix error when boolean content is null in a chunk

## 1.24.0

### Minor Changes

- 2bc9e95: `includeDescendantsOfUnpublishedFolders` option for items is
  introduced to give you the possibility to include published items that are
  located under an published folders for `bootstrapper.createSpec()`.

  This is only useful if you're targeting the `published` version of items.
  Example:

  ```
  const spec = await bootstrapper.createSpec({
      ...
      items: {
        version: 'published',
        includeDescendantsOfUnpublishedFolders: true,
      }
    })
  ```

  **Beware** Unpublished folders will appear with an invalid shape identifier in
  the export, which makes it unsuitable for import. The real value here is if
  you combine this with another `createSpec` where you target the `current` or
  `draft` version of items, which together gives the correct image of the
  current item tree state.

## 1.23.0

### Minor Changes

- 2eecefa: Certain internals in the items area are now running in parallel for
  the spec creation. This increases the speed of spec creation of items with
  roughly 40%.

  This also introduces an internal load balancing mechanism, which is designed
  to keep the request counts below the threshold of Crystallize APIs

### Patch Changes

- 5e70780: Bump import-export-sdk and schema deps
- 5794af7: Update @crystallize/schema to 0.0.4

## 1.22.1

### Patch Changes

- f46635a: Emit shape creation errors

## 1.22.0

### Minor Changes

- bb8967f: Add option to keep Item's original ID in the spec

## 1.21.0

### Minor Changes

- df92131: Added option to keep original Ids of Items in spec, vita
  spec.config.items.keepOriginalIds

## 1.20.3

### Patch Changes

- a32f14e: Fix/ showing Item's published languages even if def lang not
  published

## 1.20.2

### Patch Changes

- a6c58f3: Fix copying files with special characters

## 1.20.1

### Patch Changes

- 4ea66fb: Reverting speed optimisations introduced in 1.20.0, due to edge case
  race conditions.

## 1.20.0

### Minor Changes

- 1e81305: Exponential backoff in case you are being rate limited by the
  service.
- 6b0abca: Increased bootstrapper speed by parallelising (item/productVariant)
  components create/update mutations.

## 1.19.4

### Patch Changes

- 6053850: Fix an issue where the check for rate limiter error would cause the
  script to exit.

## 1.19.3

### Patch Changes

- 04d9091: Fixed an issue where updates to product variants would fail in cases
  where the variants had components defined in the shape.

## 1.19.2

### Patch Changes

- 13c4ddf: Output an error message in case you've been rate limited by the API.

## 1.19.1

### Patch Changes

- 59b06d3: Import/export stock location values and quick select folder ids

## 1.18.0

### Minor Changes

- 0850ae0: Implemented a `kill` method on the bootrapper class. This can be run
  after a successful import and/or spec creation, clearing intervals made by the
  fileUpload and API manager classes.

## 1.17.0

### Minor Changes

- d8a306a: This only a dependency package updates, bumping `graphql` to v16

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
