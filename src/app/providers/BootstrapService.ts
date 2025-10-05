import { makeAutoObservable } from 'mobx'
import { AuthService, container } from 'src/shared/lib'

export class BootstrapService {
  constructor(private readonly authService: AuthService) {
    makeAutoObservable(this)

    this.init()
  }

  public get isLoaded() {
    return this.authService.isLoaded
  }

  private init() {
    void this.authService.init()
  }
}

container.register(
  BootstrapService,
  () => {
    const authService = container.get(AuthService)

    return new BootstrapService(authService)
  },
  { scope: 'singleton' },
)
