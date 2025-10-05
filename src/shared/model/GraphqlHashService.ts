import hashes from 'src/__generated__/hashes.json'
import { container } from 'src/shared/lib'

export class GraphqlHashService {
  private readonly queryToHash: Record<string, string> = {}

  constructor(private readonly hashToQuery: Record<string, string>) {
    Object.entries(this.hashToQuery).forEach(([hash, query]) => {
      this.queryToHash[query] = hash
    })
  }

  public getHash(query: string): string | undefined {
    return this.queryToHash[query]
  }
}

container.register(
  GraphqlHashService,
  () => {
    return new GraphqlHashService(hashes.queries)
  },
  { scope: 'singleton' },
)
