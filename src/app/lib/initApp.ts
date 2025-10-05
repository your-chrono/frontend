import { ROOT_ROUTES } from 'src/app/config/rootRoutes.tsx'
import { RouterService } from 'src/shared/lib/RouterService'
import { container } from 'src/shared/lib/DIContainer'
import { registerServiceDependencies } from 'src/app/di/service-di.ts'

export const initApp = () => {
  registerServiceDependencies()

  const routerService = container.get(RouterService)
  routerService.addRootRoutes(ROOT_ROUTES)
}
