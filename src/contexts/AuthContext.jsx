import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is authenticated via Cloudflare Access
    // Cloudflare Access injects JWT in cookies and headers
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check if we're on Cloudflare (production) or local development
      const isProduction = window.location.hostname.includes('pages.dev') ||
                          window.location.hostname.includes('cloudflare')

      if (isProduction) {
        // In production, use Cloudflare Access to check authentication
        // Cloudflare Access protects the /admin route and sets a CF_Authorization cookie
        // The /cdn-cgi/access/get-identity endpoint returns user information
        const response = await fetch('/cdn-cgi/access/get-identity')

        if (response.ok) {
          const identity = await response.json()
          setUser({ email: identity.email, name: identity.name })
          setIsAuthenticated(true)
        } else {
          // If we can't get identity, user is not authenticated
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        // In local development, bypass Cloudflare Access check
        // This allows testing the UI without Cloudflare Access
        console.log('Local development mode - bypassing Cloudflare Access')
        setUser({ email: 'dev@localhost', name: 'Local Developer' })
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // If there's an error, assume not authenticated
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = () => {
    // Redirect to login page, which will trigger Cloudflare Access flow
    window.location.href = '/login'
  }

  const logout = async () => {
    // Clear authentication state
    setIsAuthenticated(false)
    setUser(null)

    // Check if we're on Cloudflare (production) or local development
    if (window.location.hostname.includes('pages.dev') || window.location.hostname.includes('cloudflare')) {
      // In production, we need to revoke the Cloudflare Access token
      // We'll open the logout endpoint in a hidden iframe to clear the session
      // Then redirect to home
      try {
        // Create a hidden iframe to call the logout endpoint
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = '/cdn-cgi/access/logout'
        document.body.appendChild(iframe)

        // Wait a moment for the logout to complete, then redirect to home
        setTimeout(() => {
          document.body.removeChild(iframe)
          window.location.href = '/'
        }, 1000)
      } catch (error) {
        console.error('Logout error:', error)
        // If there's an error, just redirect to home
        window.location.href = '/'
      }
    } else {
      // Local development - just redirect to home
      window.location.href = '/'
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
