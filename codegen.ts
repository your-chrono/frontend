import { type CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(__dirname, '.env/.env.development.local') })

const args = process.argv.slice(2)
const isDownload = args.includes('--download')

const disablePlugin = {
  add: {
    content: ['// @ts-ignore'],
  },
}

const scalars = {
  DateTime: 'number | string',
  JSON: 'any',
  JSONObject: 'any',
}

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.REACT_APP_GRAPHQL_SERVER_PROTOCOL}://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}${process.env.REACT_APP_GRAPHQL_SERVER_LOCATION}`,
  documents: ['src/**/*.graphql'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    [`./src/__generated__/schema.graphql`]: {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
    ...(!isDownload
      ? {
          [`./src/__generated__/graphql-request.ts`]: {
            plugins: [disablePlugin, 'typescript', 'typescript-operations', 'typescript-graphql-request'],
            config: {
              rawRequest: false,
              skipTypename: true,
              scalars,
            },
          },
          [`./src/__generated__/hashes.json`]: {
            plugins: ['./scripts/graphql-hash-json-plugin.cjs'],
          },
        }
      : {}),
  },
}

export default config
