// src/pages/YaToken/YaToken.tsx
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    YaSendSuggestToken?: (origin: string, extra?: Record<string, unknown>) => void
  }
}

export const YaToken = () => {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')

  useEffect(() => {
    const s = document.createElement('script')
    s.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js'
    s.async = true
    s.onload = () => {
      try {
        const origin = window.location.origin
        window.YaSendSuggestToken?.(origin, { from: 'ya-token' })
        setStatus('done')
      } catch {
        setStatus('error')
      }
    }
    s.onerror = () => setStatus('error')
    document.head.appendChild(s)
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      {status === 'loading' && <p>Обработка входа…</p>}
      {status === 'done' && <p>Готово, можно закрыть окно.</p>}
      {status === 'error' && <p>Не удалось передать токен. Проверьте origin и redirect_uri.</p>}
    </div>
  )
}
