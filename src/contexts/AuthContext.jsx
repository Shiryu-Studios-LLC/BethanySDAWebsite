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
      // When Cloudflare Access is configured, it will protect the /admin routes
      // and inject CF-Access-Authenticated-User-Email header
      // For now, we'll check if we can access a protected endpoint
      const response = await fetch('/admin/check-auth', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
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
    // Clear authentication and redirect to Cloudflare Access logout
    setIsAuthenticated(false)
    setUser(null)
    window.location.href = '/cdn-cgi/access/logout'
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
