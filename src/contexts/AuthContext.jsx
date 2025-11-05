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
      // Cloudflare Access protects the /admin route and sets a CF_Authorization cookie
      // If the user can access this page, they're authenticated
      // Cloudflare Access also provides user identity in headers, but we can't access them directly in client-side code

      // We'll make a request to get user info from Cloudflare Access
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

    // Redirect to Cloudflare Access logout endpoint
    // This will clear the Cloudflare Access session and redirect to home
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
