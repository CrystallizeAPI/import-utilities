import { Bootstrapper, JsonSpec } from '@crystallize/import-utilities'

async function createSpecification() {
  const bootstrapper = new Bootstrapper()

  /**
   * Access tokens for the account used
   * https://crystallize.com/learn/developer-guides/access-tokens
   */
  const ACCESS_TOKEN_ID = process.env.CRYSTALLIZE_ACCESS_TOKEN_ID
  const ACCESS_TOKEN_SECRET = process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET

  bootstrapper.setAccessToken(ACCESS_TOKEN_ID, ACCESS_TOKEN_SECRET)

  // The tenant to create a specification from
  bootstrapper.setTenantIdentifier('furniture')

  const tenantSpec: JsonSpec = await bootstrapper.createSpec({
    languages: true,
    vatTypes: true,
    priceVariants: true,
    shapes: true,
    topicMaps: true,
    grids: true,
    items: false,
    onUpdate: (areaUpdate) => {
      console.log(JSON.stringify(areaUpdate, null, 1))
    },
  })

  console.log(JSON.stringify(tenantSpec, null, 1))
  process.exit(0)
}

createSpecification()
