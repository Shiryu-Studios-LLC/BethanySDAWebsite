import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@tabler/core/dist/css/tabler.min.css'
import './index.css'
import App from './App.jsx'

// Set dark theme on load
document.documentElement.setAttribute('data-bs-theme', 'dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
