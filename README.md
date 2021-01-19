# @crystallize/import-utilities

This repository contains a collection of types and functions that can be used to
build queries and mutations to make it easier to import custom datastructures
into Crystallize.

## Usage Examples

### Creating a Tenant

You can easily build the GraphQL mutation for creating a tenant with a custom
data structure.

```ts
import {
  buildCreateTenantMutation,
  TenantInput,
  shapeTypes,
  componentTypes,
} from '@crystallize/import-utilities'

// Define the structure for the tenant
const input: TenantInput = {
  identifier: 'my-cooking-blog',
  name: 'My Cooking Blog',
  shapes: [
    {
      name: 'Recipe',
      type: shapeTypes.document,
      components: [
        {
          id: 'ingredients',
          name: 'Ingredients',
          description: 'List of Ingredients',
          type: componentTypes.propertiesTable,
        },
        {
          id: 'instructions',
          name: 'Instructions',
          descriptions: 'Written guide for the recipe',
          type: componentTypes.richText,
        },
      ],
    },
  ],
}

// Build the mutation string
const mutation = buildCreateTenantMutation(input)
```

You now have a mutation string that will create a new tenant with your own
custom shapes and components. You can then submit this query to the [Core
API][0] using your preferred GraphQL client (apollo, urql, etc) to actually
create your tenant within Crystallize.

### Creating Shapes

If you have an existing tenant you can also just create individual shapes by
generating mutations from shape definitions.

```ts
import {
  buildCreateShapeMutation,
  ShapeInput,
  shapeTypes,
  componentTypes,
} from '@crystallize/import-utilities'

// Define the structure for the shape
const input: ShapeInput = {
  tenantId: '<your tenant id>',
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

You now have a mutation string that will create a new product shape with your
own custom component structure. You can then submit this query to the [Core
API][0] using your preferred GraphQL client (apollo, urql, etc) to create the
shapes for your tenant.

### Creating Items

TODO

[0]: https://crystallize.com/learn/developer-guides/api-overview/api-endpoints
