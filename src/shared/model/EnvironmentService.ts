import { container } from 'src/shared/lib'

type Envs =
  | 'REACT_APP_GRAPHQL_CLIENT_URL'
  | 'REACT_APP_GRAPHQL_SERVER_PROTOCOL'
  | 'REACT_APP_GRAPHQL_SERVER_HOST'
  | 'REACT_APP_GRAPHQL_SERVER_PORT'
  | 'PACKAGE_VERSION'
  | 'GIT_COMMIT_HASH'
  | 'GIT_BRANCH_NAME'
  | 'REACT_APP_GRAPHQL_VALIDATION_BYPASS_ENABLED'

export class EnvironmentService {
  public get(key: Envs): string | undefined {
    const windowValue = window.__env__?.[key]
    const processValue = import.meta.env[key]

    return windowValue ?? processValue
  }
}

container.register(EnvironmentService, () => new EnvironmentService(), { scope: 'singleton' })
