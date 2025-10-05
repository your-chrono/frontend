import { RouterService } from 'src/shared/lib/RouterService'
import { BootstrapService } from 'src/app/providers'
import { container } from 'src/shared/lib/DIContainer'

export const registerServiceDependencies = () => {
  container.register(
    RouterService,
    () => {
      const bootstrapService = container.get(BootstrapService)

      return new RouterService(bootstrapService)
    },
    { scope: 'singleton' },
  )
}
