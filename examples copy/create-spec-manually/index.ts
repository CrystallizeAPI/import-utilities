import { JsonSpec } from '@crystallize/import-utilities'

const tenantSpec: JsonSpec = {
  languages: [
    {
      code: 'se',
      name: 'Swedish',
      isDefault: true,
    },
  ],
  vatTypes: [
    {
      name: 'Books',
      percent: 14,
    },
  ],
}

console.log(JSON.stringify(tenantSpec, null, 1))
