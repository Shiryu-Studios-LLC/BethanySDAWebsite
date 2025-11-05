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

  const logout = () => {
    // Clear authentication state
    setIsAuthenticated(false)
    setUser(null)

    // Check if we're on Cloudflare (production) or local development
    if (window.location.hostname.includes('pages.dev') || window.location.hostname.includes('cloudflare')) {
      // In production, open the Cloudflare logout in a new window/tab
      // Then redirect to home immediately
      // This forces the session to be cleared
      const logoutWindow = window.open('/cdn-cgi/access/logout', '_blank')

      // Close the logout window after a moment and redirect to home
      setTimeout(() => {
        if (logoutWindow) {
          logoutWindow.close()
        }
        window.location.href = '/'
      }, 1000)
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
