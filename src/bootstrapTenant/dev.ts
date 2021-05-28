import { config } from "dotenv"
config();

import { readFileSync } from 'fs';
import { resolve} from 'path';

import { bootstrapTenant } from './index';

function bootstrap() {
  const spec = readFileSync(resolve(__dirname, '../../json-spec/furniture-spec.json'), 'utf-8');
  const tenantIdentifier = 'furniture-hkn';

  const bootstrapper = bootstrapTenant({
    tenantIdentifier: 'hkn-furniture',
    jsonSpec: JSON.parse(spec),
    CRYSTALLIZE_ACCESS_TOKEN_ID: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    CRYSTALLIZE_ACCESS_TOKEN_SECRET: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  });

  console.log(`✨ Bootstrapping ${tenantIdentifier}... ✨`);
  bootstrapper.once('done', function (args) {
    console.log(`✨ Done bootstrapping ${tenantIdentifier} ✨`);
  });

  // bootstrapper.
}

bootstrap();