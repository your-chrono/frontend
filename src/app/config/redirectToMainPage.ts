import { redirect } from 'react-router-dom'
import { HOME_ROUTE } from 'src/shared/config'

export const redirectToMainPage = async () => {
  return redirect(`/${HOME_ROUTE}`)
}
