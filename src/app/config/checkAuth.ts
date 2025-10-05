import { redirect } from 'react-router-dom'
import { LOG_IN_ROUTE } from 'src/shared/config'
import { AuthService, container } from 'src/shared/lib'

export const checkAuth = async () => {
  const authService = container.get(AuthService)

  if (!authService.user) {
    return redirect(`/${LOG_IN_ROUTE}`)
  }

  return true
}
