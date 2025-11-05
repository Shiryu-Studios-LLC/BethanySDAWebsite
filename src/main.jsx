import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import '@tabler/core/dist/css/tabler.min.css'
import './index.css'
import App from './App.jsx'

// Set dark theme on load
document.documentElement.setAttribute('data-bs-theme', 'dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
