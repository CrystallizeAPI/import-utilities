# @crystallize/import-utilities

This repository contains a collection of types and functions that can be used to
build queries and mutations to make it easier to import custom datastructures
into Crystallize.

## Usage Examples

### Creating a Tenant

TODO

### Creating Shapes

```ts
import {
  ShapeInput,
  shapeTypes,
  componentTypes,
} from '@crystallize/import-utilities'

// Define the structure for the shape
const input: ShapeInput = {
  name: 'My Custom Product Shape',
  type: shapeTypes.product,
  components: [
    {
      id: 'images',
      name: 'Images',
      type: componentTypes.images,
    },
    {
      id: 'description',
      name: 'Description',
      type: componentTypes.richText,
    },
  ],
}

// Build the mutation string
const mutation = buildCreateShapeMutation(input)
```

You now have a mutation string that will create a new product shape with our own
custom component structure. You can then submit this query to the [Core API][0]
using your preferred GraphQL client (apollo, urql, etc) to create the shapes for
your tenant.

### Creating Items

TODO

[0]: https://crystallize.com/learn/developer-guides/api-overview/api-endpoints
