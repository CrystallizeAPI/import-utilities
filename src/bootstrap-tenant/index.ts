import { JsonSpec } from './json-spec'
import { EVENT_NAMES as E, Bootstrapper } from './bootstrapper'
interface BaseProps {
  tenantIdentifier: string
  CRYSTALLIZE_ACCESS_TOKEN_ID: string
  CRYSTALLIZE_ACCESS_TOKEN_SECRET: string
}

interface BootstrapperProps extends BaseProps {
  jsonSpec: JsonSpec
}

export const EVENT_NAMES = E

export async function createJSONSpec(props: BaseProps): Promise<JsonSpec> {
  const bootstrapper = new Bootstrapper()

  bootstrapper.setAccessToken(
    props.CRYSTALLIZE_ACCESS_TOKEN_ID,
    props.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  )

  bootstrapper.setTenantIdentifier(props.tenantIdentifier)

  return bootstrapper.createSpec()
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
