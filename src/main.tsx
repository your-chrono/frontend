import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from 'src/app/App.tsx'
import { initApp } from 'src/app/lib/initApp.ts'

declare global {
  interface Window {
    __env__: Record<string, string | number> | undefined

    YaAuthSuggest: {
      init: (
        oauthParams: { client_id: string; response_type: 'token'; redirect_uri?: string },
        tokenPageOrigin: string,
        suggestParams?: unknown,
      ) => Promise<{ status: 'ok'; handler: () => Promise<unknown> }>
    }
    YaSendSuggestToken?: (origin: string, extra?: Record<string, unknown>) => void
  }
}

initApp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
