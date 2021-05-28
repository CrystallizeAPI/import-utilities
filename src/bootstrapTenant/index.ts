import { JsonSpec } from './json-spec'
import { Bootstrapper } from './bootstrapper'

interface Props {
  tenantIdentifier: String
  jsonSpec: JsonSpec,
  CRYSTALLIZE_ACCESS_TOKEN_ID?: string;
  CRYSTALLIZE_ACCESS_TOKEN_SECRET?: string;
}

export function bootstrapTenant(props: Props): Bootstrapper {
  console.log('hey');
  const bootstrapper = new Bootstrapper();
  
  bootstrapper.setAccessToken(
    props.CRYSTALLIZE_ACCESS_TOKEN_ID || '',
    props.CRYSTALLIZE_ACCESS_TOKEN_SECRET || ''
  );

  bootstrapper.start(props.jsonSpec);

  return bootstrapper;
}