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
      // Check for Cloudflare Access authentication
      // When Cloudflare Access is enabled, it will inject the CF-Access-Authenticated-User-Email header
      // and set cookies that we can verify

      // For now, before Cloudflare Access is configured, check localStorage
      // This is a temporary solution - once Cloudflare Access is set up, it will handle everything
      const authToken = localStorage.getItem('cf_auth_token')
      const userEmail = localStorage.getItem('cf_user_email')

      if (authToken && userEmail) {
        setUser({ email: userEmail })
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
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
    // Clear authentication
    setIsAuthenticated(false)
    setUser(null)

    // Clear localStorage (temporary until Cloudflare Access is configured)
    localStorage.removeItem('cf_auth_token')
    localStorage.removeItem('cf_user_email')
    localStorage.removeItem('cf_auth_provider')

    // Redirect to home page
    // Once Cloudflare Access is configured, this will redirect to /cdn-cgi/access/logout
    window.location.href = '/'
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
