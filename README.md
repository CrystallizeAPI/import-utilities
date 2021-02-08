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
      identifier: 'recipe',
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

```ts
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
const mutation = buildCreateShapeMutation(recipeShape)
```

You can also create this shape manually via the PIM UI, if you prefer.

#### 2. Define the structure for the content

```ts
interface RecipeContent extends DocumentInput {
  components: {
    ingredients: PropertiesTableComponentContentInput
    instructions: RichTextComponentContentInput
  }
}
```

#### 3. Importing the data

Let's say we have some example JSON data that we want to import. This data could
be in any format, you just need to map it to the `RecipeContent` type we've
defined above.

```ts
// Example data. You could have this in any format, you just need to map the
// data as shown below.
const data = [
  {
    name: 'Cookies Recipe',
    ingredients: [
      {
        name: 'Flour',
        amount: '1 Cup',
      },
      {
        name: 'Chocolate Chips',
        amount: '1 Cup',
      },
    ],
    instructions: 'Start by adding the flour, brown sugar...',
  },
  {
    name: 'Banana Cake',
    ingredients: [
      {
        name: 'Flour',
        amount: '1 Cup',
      },
      {
        name: 'Bananas',
        amount: '2',
      },
    ],
    instructions: 'Start by mashing the bananas...',
  },
]

// Map the items to the RecipeContent schema.
const items: RecipeContent[] = data.map(
  ({ name, ingredients, instructions }): RecipeContent => {
    return {
      name,
      components: {
        ingredients: {
          sections: {
            title: 'Ingredients',
            properties: ingredients.map(
              ({ name, amount }): KeyValuePairInput => ({
                key: name,
                value: amount,
              })
            ),
          },
        },
        instructions: {
          richText: {
            html: [instructions],
          },
        },
      },
    }
  }
)

// Create an array of mutations that you can execute on the PIM API using your
// GraphQL client.
const mutations = items.map((item: RecipeContent): string =>
  buildCreateItemMutation(item)
)
```

[0]: https://crystallize.com/learn/developer-guides/api-overview/api-endpoints
