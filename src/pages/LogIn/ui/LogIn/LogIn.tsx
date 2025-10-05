import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService, container } from 'src/shared/lib'
import { HOME_ROUTE } from 'src/shared/config'

export const LogIn = () => {
  const didInitRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (didInitRef.current) return // защита от повторного вызова эффекта
    didInitRef.current = true

    const ensureSdk = () =>
      new Promise<void>((resolve, reject) => {
        if (window.YaAuthSuggest) return resolve()

        // не дублируем тег <script>, если он уже есть
        const existing = document.getElementById('ya-sdk-suggest')
        if (existing) {
          ;(existing as HTMLScriptElement).addEventListener('load', () => resolve())
          ;(existing as HTMLScriptElement).addEventListener('error', () => reject(new Error('SDK load error')))
          return
        }

        const s = document.createElement('script')
        s.id = 'ya-sdk-suggest'
        s.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js'
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('SDK load error'))
        document.head.appendChild(s)
      })

    ensureSdk()
      .then(() => {
        const parent = document.getElementById('yandex-id-btn')
        if (parent) parent.innerHTML = '' // на всякий случай очищаем контейнер

        const clientId = import.meta.env.REACT_APP_YANDEX_CLIENT_ID || 'f289a291c0dc4f088e2107665b931592'
        return window.YaAuthSuggest!.init(
          {
            client_id: clientId,
            response_type: 'token',
            redirect_uri: `${window.location.origin}/ya-token`,
          },
          window.location.origin, // именно ORIGIN
          {
            view: 'button',
            parentId: 'yandex-id-btn',
            buttonView: 'main',
            buttonTheme: 'light',
            buttonSize: 'm',
            buttonBorderRadius: 8,
          },
        )
      })
      .then(({ handler }) => handler())
      .then((data) => {
        if (data && data.access_token) {
          const authService = container.get(AuthService)
          authService
            .loginWithYandexToken(data.access_token)
            .then(() => {
              navigate(`/${HOME_ROUTE}`)
            })
            .catch((error) => {
              console.error('Login failed:', error)
            })
        }
      })
      .catch((err) => console.error('Auth error:', err))
  }, [navigate])

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div id="yandex-id-btn" />
    </div>
  )
}
