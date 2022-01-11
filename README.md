# @crystallize/import-utilities

This repository contains a collection of types and functions that can be used
to:

- [Import data to a tenant](https://github.com/CrystallizeAPI/examples/tree/main/products-import)
- [Backup a tenant](https://github.com/CrystallizeAPI/examples/tree/main/backup-tenant)
- [Transfer data from one tenant to another tenant](https://github.com/CrystallizeAPI/examples/tree/main/duplicate-tenant)

[Examples](https://github.com/CrystallizeAPI/examples/tree/main/backup-tenant)

---

```typescript
const myBurgerShop = shapes: [
    {
      name: 'Ingredient',
      identifier: 'ingredient',
      type: 'product',
    },
  ],
  items: [
    {
      name: 'Burger Bun',
      shape: 'ingredient',
      vatType: 'No Tax',
      variants: [
        {
          name: 'Regular burger bun',
          sku: 'burger-bun-regular',
          attributes: {
            size: 'medium',
          },
          isDefault: true,
        },
      ],
    },
    {
      name: 'Burger patty',
      shape: 'ingredient',
      vatType: 'No Tax',
      variants: [
        {
          name: 'Beef burger patty',
          sku: 'burger-patty-beef',
          isDefault: true,
          price: {
            eur: 5,
          },
        },
        {
          name: 'Vegan burger patty',
          sku: 'burger-patty-vegan',
          isDefault: false,
          price: {
            eur: 6,
          },
        },
      ],
    },
    {
      name: 'Cheddar cheese',
      shape: 'ingredient',
      vatType: 'No Tax',
      variants: [
        {
          name: 'Standard cheddar cheese',
          sku: 'cheddar-cheese-standard',
          isDefault: true,
          price: {
            eur: 1,
          },
        },
        {
          name: 'Vegan cheddar cheese',
          sku: 'cheddar-cheese-vegan',
          isDefault: false,
          price: {
            eur: 1.5,
          },
        },
      ],
    },
  ],
}
```

## Creating a tenant specification

The tenant specification describes how the tenant is configured, and can contain
information on:

- [Languages](https://crystallize.com/learn/concepts/pim/multilingual)
- [VAT types](https://crystallize.com/learn/concepts/ecommerce/tax)
- [Price variants](https://crystallize.com/learn/concepts/ecommerce/price-variant)
- [Shapes](https://crystallize.com/learn/concepts/pim/shape)
- [Topics](https://crystallize.com/learn/concepts/pim/topic-map)
- [Grids](https://crystallize.com/learn/concepts/pim/grid-organizer)
- [Products](https://crystallize.com/learn/concepts/pim/product),
  [Documents](https://crystallize.com/learn/concepts/pim/document) and
  [Folders](https://crystallize.com/learn/concepts/pim/folder)

It is described in a `.json` file, like such:

```json
{
  "languages": [],
  "vatTypes": [],
  "priceVariants": [],
  "shapes": [],
  "topicMaps": [],
  "grids": [],
  "items": []
}
```

### Create the specification manually

You can create the tenant specification manually, with the help of the
`JSONSpec` type exported from the package:

```typescript
import { JSONSpec } from '@crystallize/import-utilites'

const mySpec: JSONSpec = {
  languages: [{}],
}
```

See a simple example of this in the
[examples/component-numeric](https://github.com/CrystallizeAPI/examples/blob/main/component-numeric)
folder

### Create the specification automatically

You can create the tenant specification automatically, with the help of the
`Bootstrapper` class exported from the package:

```typescript
import { Bootstrapper } from '@crystallize/import-utilites'

const mySpec: JSONSpec = await bootstrapper.createSpec({
  ...
});
```

See a simple example of this in the
[examples/backup-tenant](https://github.com/CrystallizeAPI/examples/tree/main/backup-tenant)
folder.

See more examples in our extensive
[examples repository](https://github.com/CrystallizeAPI/examples)

### Bootstrap a tenant

You can bootstrap a tenant using a specification with the help of the
`Bootstrapper` class exported from the package:

```typescript
import { Bootstrapper, JSONSpec } from '@crystallize/import-utilites'

bootstrapper.start()
```

See a simple example of this in the
[examples/bootstrap-tenant](https://github.com/CrystallizeAPI/import-utilities/tree/main/examples/bootstrap-tenant)
folder.

See more examples in our extensive
[examples repository](https://github.com/CrystallizeAPI/examples)

## Creating single queries and mutations

For composing single queries and mutations, not using the JSON specification,
there are a collection of types and functions that help with that. Here's a
couple of examples.

### Creating a Tenant

You can easily build the GraphQL mutation for creating a tenant.

```typescript
import {
  buildCreateTenantMutation,
  TenantInput,
} from '@crystallize/import-utilities'

// Define the structure for the tenant
const input: TenantInput = {
  identifier: 'my-cooking-blog',
  name: 'My Cooking Blog',
}

// Build the mutation string
const mutation = buildCreateTenantMutation(input)
```

You now have a mutation string that will create a new tenant. You can then
submit this query to the [Core API][0] using your preferred GraphQL client
(apollo, urql, etc) to actually create your tenant within Crystallize.

### Creating Shapes

If you have an existing tenant you can also just create individual shapes by
generating mutations from shape definitions.

```typescript
import {
  buildCreateShapeMutation,
  ShapeInput,
  shapeTypes,
  componentTypes,
} from '@crystallize/import-utilities'

// Define the structure for the shape
const input: ShapeInput = {
  identifier: 'my-shape',
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

You can easily build mutations to create items by extending the shapes to
provide a schema for different items types. This is kind of a two-step process.

#### 1. Define the structure for the shape (as per the examples above)

```typescript
import {
  buildCreateShapeMutation,
  ShapeInput,
  shapeTypes,
  componentTypes,
} from '@crystallize/import-utilities'

// Define the structure for the shape
const recipeShape: ShapeInput = {
  identifier: 'recipe',
  tenantId: '<your tenant id>',
  name: 'Recipe',
  type: shapeTypes.document,
  components: [
    {
      id: 'ingredients',
      name: 'Ingredients',
      type: componentTypes.propertiesTable,
    },
    {
      id: 'instructions',
      name: 'Intructions',
      type: componentTypes.richText,
    },
  ],
}

// Build the mutation string
const createShapeMutation = buildCreateShapeMutation(recipeShape)
```

You can also create this shape manually via the PIM UI, if you prefer.

#### 3. Importing a single item

```typescript
import {
  buildCreateItemMutation,
  CreateItemInput,
} from '@crystallize/import-utilities'

const itemData: CreateItemInput = {
  name: 'Cookies Recipe',
  shapeIdentifier: 'recipe',
  tenantId: '<your tenant id>',
  components: {
    ingredients: {
      sections: {
        title: 'Ingredients',
        properties: [
          {
            key: 'Flour',
            value: '1 Cup',
          },
          {
            key: 'Chocolate Chips',
            value: '1 Cup',
          },
        ],
      },
    },
    instructions: {
      richText: {
        plainText: 'Start by adding the flour, brown sugar...',
      },
    },
  },
}

const createItemMutation = buildCreateItemMutation(itemData)
```

[0]: https://crystallize.com/learn/developer-guides/api-overview/api-endpoints

## Tenant specification and bootstrap

The specification/bootstrap of tenant is broken down into two separate
operations

1. Create a backup of a tenant, storing it as a `.json` specification
2. Bootstrapping a tenant, using a `.json` specification

### Create a tenant specification

The tenant specification describes how the tenant is configured, and can contain
information on:

- [Languages](https://crystallize.com/learn/concepts/pim/multilingual)
- [VAT types](https://crystallize.com/learn/concepts/ecommerce/tax)
- [Price variants](https://crystallize.com/learn/concepts/ecommerce/price-variant)
- [Stock locations](https://crystallize.com/learn/concepts/ecommerce/stock-location)
- [Shapes](https://crystallize.com/learn/concepts/pim/shape)
- [Topics](https://crystallize.com/learn/concepts/pim/topic-map)
- [Grids](https://crystallize.com/learn/concepts/pim/grid-organizer)
- [Products](https://crystallize.com/learn/concepts/pim/product),
  [Documents](https://crystallize.com/learn/concepts/pim/document) and
  [Folders](https://crystallize.com/learn/concepts/pim/folder)

It is described in a `.json` file, like such:

```json
{
  "languages": [],
  "vatTypes": [],
  "priceVariants": [],
  "shapes": [],
  "topicMaps": [],
  "grids": [],
  "items": []
}
```
