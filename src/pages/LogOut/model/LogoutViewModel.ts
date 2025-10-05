import { makeAutoObservable } from 'mobx'
import { AuthService, container, RouterService } from 'src/shared/lib'
import type { IViewModel } from 'src/shared/config'

export class LogoutViewModel implements IViewModel {
  constructor(
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
  ) {
    makeAutoObservable(this)
  }

  public async logout() {
    this.authService.logout()
    await this.routerService.navigate('/')
  }

  dispose(): void {}

  init(): void {}
}

container.register(
  LogoutViewModel,
  () => {
    const authService = container.get(AuthService)
    const routerService = container.get(RouterService)

    return new LogoutViewModel(authService, routerService)
  },
  { scope: 'transient' },
)
