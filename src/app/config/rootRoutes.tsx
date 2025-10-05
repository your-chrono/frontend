import type { RouteObject } from 'react-router-dom'
import { HOME_ROUTE, LOG_IN_ROUTE, LOG_OUT_ROUTE, YA_TOKEN } from 'src/shared/config'
import { composeLoaders } from 'src/app/config/composeLoaders.ts'
import { checkAuth } from 'src/app/config/checkAuth.ts'
import { redirectToMainPage } from 'src/app/config/redirectToMainPage.ts'
import { LogOut } from 'src/pages/LogOut'
import { Home } from 'src/pages/Home'
import { LogIn } from 'src/pages/LogIn'
import { YaToken } from 'src/pages/YAToken'

export const ROOT_ROUTES: RouteObject[] = [
  {
    path: '*',
    loader: composeLoaders(checkAuth, redirectToMainPage),
  },
  {
    path: LOG_IN_ROUTE,
    element: <LogIn />,
  },
  {
    path: LOG_OUT_ROUTE,
    element: <LogOut />,
  },
  {
    path: YA_TOKEN,
    element: <YaToken />,
  },
  {
    path: HOME_ROUTE,
    loader: checkAuth,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]
