import { ChakraProvider } from '@chakra-ui/react'
import { type FC } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster, CenteredSpinner } from 'src/shared/ui'
import { observer } from 'mobx-react-lite'
import { useViewModel } from 'src/shared/lib'
import { AppViewModel } from 'src/app/model/AppViewModel.ts'
import { system } from 'src/app/theme/theme.ts'

export const App: FC = observer(() => {
  const model = useViewModel(AppViewModel)
  if (!model.isLoaded || !model.router) {
    return (
      <ChakraProvider value={system}>
        <CenteredSpinner />
      </ChakraProvider>
    )
  }
  return (
    <ChakraProvider value={system}>
      <Toaster />
      <RouterProvider router={model.router} />
    </ChakraProvider>
  )
})
