import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import packageJson from './package.json'

const ENV_DIR = '.env'
const ENV_PREFIX = 'REACT_APP_'

const DEFAULT_PORT = 5173

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, ENV_DIR, ENV_PREFIX)
  process.env = { ...process.env, ...env }

  return defineConfig({
    plugins: [
      react(),
      svgr({
        include: '**/*.svg',
      }),
      checker({
        // e.g. use TypeScript check
        typescript: true,
      }),
    ],

    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
      },
    },
    server: {
      port: Number(process.env.REACT_APP_PORT) || DEFAULT_PORT,
      proxy: {
        [process.env.REACT_APP_GRAPHQL_CLIENT_URL as string]: {
          target: `${process.env.REACT_APP_GRAPHQL_SERVER_PROTOCOL}://${process.env.REACT_APP_GRAPHQL_SERVER_HOST}:${process.env.REACT_APP_GRAPHQL_SERVER_PORT}${process.env.REACT_APP_GRAPHQL_SERVER_LOCATION}`,
          ignorePath: true,
          changeOrigin: true,
        },
      },
    },
    envDir: ENV_DIR,
    envPrefix: ENV_PREFIX,
    define: {
      'import.meta.env.PACKAGE_VERSION': `${JSON.stringify(packageJson.version)}`,
      'import.meta.env.GIT_COMMIT_HASH': `"${process.env.COMMIT_HASH ?? 'unknown'}"`,
      'import.meta.env.GIT_BRANCH_NAME': `"${process.env.BRANCH_NAME ?? 'unknown'}"`,
    },
  })
}
