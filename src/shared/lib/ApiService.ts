// @ts-expect-error can't find type
import { GraphQLClient, GraphQLClientResponse } from 'graphql-request'
import { getSdk, type Sdk } from 'src/__generated__/graphql-request.ts'
import { toaster } from 'src/shared/ui/components/Toast/create-toaster.ts'
import { BYPASS_HEADER, EnvironmentService, GraphqlHashService, HASH_HEADER } from 'src/shared/model'
import { container } from 'src/shared/lib/DIContainer.ts'

const COUNT_CHARS = 32

export class ApiService {
  public readonly client: Sdk

  private readonly graphQLClient: GraphQLClient
  private token: string | null = null

  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly hashService: GraphqlHashService,
  ) {
    const url = this.environmentService.get('REACT_APP_GRAPHQL_CLIENT_URL')

    if (!url) {
      throw new Error(`Invalid REACT_APP_GRAPHQL_CLIENT_URL`)
    }
    this.graphQLClient = new GraphQLClient('http://localhost:4222/graphql', {
      responseMiddleware: (response: GraphQLClientResponse<unknown> | Error) => {
        if (response.response?.errors[0].message) {
          toaster.create({
            title: response.response?.errors[0].message,
          })
        }

        return response
      },
      requestMiddleware: (request) => {
        const query = JSON.parse(request.body as string).query as string
        const hash = this.hashService.getHash(query)

        const headers = request.headers as Record<string, string>

        if (hash) {
          headers[HASH_HEADER] = hash
        } else {
          console.warn('not found hash for', query.substring(0, COUNT_CHARS))
        }

        return request
      },
    })
    this.client = getSdk(this.graphQLClient)
  }

  public setToken(token: string | null) {
    this.token = token
    this.updateHeaders()
  }

  public updateHeaders() {
    const headers: Record<string, string> = {}

    if (this.graphqlValidationBypassEnabled) {
      headers[BYPASS_HEADER] = 'true'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    this.graphQLClient.setHeaders(headers)
  }

  private get graphqlValidationBypassEnabled() {
    return this.environmentService.get('REACT_APP_GRAPHQL_VALIDATION_BYPASS_ENABLED') === 'true'
  }
}

container.register(
  ApiService,
  () => {
    const environmentService = container.get(EnvironmentService)
    const hashService = container.get(GraphqlHashService)

    return new ApiService(environmentService, hashService)
  },
  { scope: 'singleton' },
)

export const client = container.get(ApiService).client
