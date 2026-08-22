import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { store } from './store/index'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { GOOGLE_OAUTH_CLIENT_ID } from './config/env'
import ErrorBoundary from './components/shared/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID || "12345-dummy-id.apps.googleusercontent.com"}>

            <Toaster position="top-center" reverseOrder={false} />
            <App />
          </GoogleOAuthProvider>
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)

