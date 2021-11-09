import { JsonSpec } from './json-spec'
import { AreaUpdate, Bootstrapper } from './bootstrapper'

export { JsonSpec } from './json-spec'
export { Bootstrapper, AreaUpdate } from './bootstrapper'
export { EVENT_NAMES } from './bootstrapper/utils'

interface BaseProps {
  tenantIdentifier: string
  CRYSTALLIZE_ACCESS_TOKEN_ID: string
  CRYSTALLIZE_ACCESS_TOKEN_SECRET: string
}

interface BootstrapperProps extends BaseProps {
  jsonSpec: JsonSpec
}

interface CreateSpecProps extends BaseProps {
  onUpdate: (t: AreaUpdate) => any
}

export async function createJSONSpec(
  props: CreateSpecProps
): Promise<JsonSpec> {
  const bootstrapper = new Bootstrapper()

  bootstrapper.setAccessToken(
    props.CRYSTALLIZE_ACCESS_TOKEN_ID,
    props.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  )

  bootstrapper.setTenantIdentifier(props.tenantIdentifier)

  return bootstrapper.createSpec({
    shapes: true,
    grids: true,
    items: true,
    languages: true,
    priceVariants: true,
    vatTypes: true,
    topicMaps: true,
    onUpdate: props.onUpdate,
    stockLocations: true,
  })
}

export function bootstrapTenant(props: BootstrapperProps): Bootstrapper {
  const bootstrapper = new Bootstrapper()

  bootstrapper.setAccessToken(
    props.CRYSTALLIZE_ACCESS_TOKEN_ID,
    props.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  )

  bootstrapper.setSpec(props.jsonSpec)
  bootstrapper.setTenantIdentifier(props.tenantIdentifier)

  // Allow for event listeners to be registered
  setTimeout(() => {
    bootstrapper.start()
  }, 5)

  return bootstrapper
}
