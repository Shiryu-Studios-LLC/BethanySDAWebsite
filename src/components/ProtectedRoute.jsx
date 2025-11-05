import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Check if we're being redirected back after logout
    if (sessionStorage.getItem('logging_out') === 'true') {
      sessionStorage.removeItem('logging_out')
      // Force redirect to home page
      window.location.href = '/'
    }
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="page-body">
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Verifying authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If authenticated, render the protected content
  return children
}
