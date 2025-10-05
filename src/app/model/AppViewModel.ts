import { makeAutoObservable } from 'mobx'
import { RouterService } from 'src/shared/lib/RouterService'
import { BootstrapService } from 'src/app/providers'
import { container } from 'src/shared/lib/DIContainer'

export class AppViewModel {
  constructor(
    private readonly bootstrapService: BootstrapService,
    private readonly routerService: RouterService,
  ) {
    makeAutoObservable(this)
  }

  public get isLoaded() {
    return this.bootstrapService.isLoaded
  }

  public get router() {
    return this.routerService.router
  }

  public async init() {}

  public dispose() {}
}

container.register(
  AppViewModel,
  () => {
    const bootstrapService = container.get(BootstrapService)
    const routerService = container.get(RouterService)

    return new AppViewModel(bootstrapService, routerService)
  },
  { scope: 'transient' },
)
