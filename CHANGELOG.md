# @crystallize/import-utilities

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
