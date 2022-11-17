# @crystallize/import-utilities

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
