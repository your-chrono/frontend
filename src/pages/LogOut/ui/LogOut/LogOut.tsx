import { observer } from 'mobx-react-lite'
import { type FC, useEffect } from 'react'
import { useViewModel } from 'src/shared/lib'
import { LogoutViewModel } from 'src/pages/LogOut/model/LogoutViewModel.ts'

export const LogOut: FC = observer(() => {
  const model = useViewModel(LogoutViewModel)

  useEffect(() => {
    void model.logout()
  }, [model])

  return null
})
