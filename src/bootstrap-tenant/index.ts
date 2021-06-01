import { JsonSpec } from './json-spec'
import { Bootstrapper } from './bootstrapper'

interface Props {
  tenantIdentifier: string
  jsonSpec: JsonSpec
  CRYSTALLIZE_ACCESS_TOKEN_ID?: string
  CRYSTALLIZE_ACCESS_TOKEN_SECRET?: string
}

export function bootstrapTenant(props: Props): Bootstrapper {
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
