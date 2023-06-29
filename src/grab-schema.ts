import type { CodegenConfig } from '@graphql-codegen/cli'

const tokenId = process.env.CRYSTALLIZE_ACCESS_TOKEN_ID
const tokenSecret = process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
const apiUrl = process.env.PUBLIC_API_URL

if (!tokenId || !tokenSecret || !apiUrl) {
  throw new Error('Missing env variable(s) when generating api legacy schemas')
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [`${apiUrl}/graphql`]: {
        headers: {
          'X-Crystallize-Access-Token-Id': tokenId,
          'X-Crystallize-Access-Token-Secret': tokenSecret,
        },
      },
    },
  ],
  generates: {
    './schemas/api-legacy.schema.json': {
      schema: './src/client-schema.graphql',
      plugins: ['introspection'],
      config: {
        minify: true,
      },
    },
  },
}

export default config
