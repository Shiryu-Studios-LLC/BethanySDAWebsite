import { useEffect, useState } from 'react'
import { IconLogout } from '@tabler/icons-react'

export default function Logout() {
  const [loggedOut, setLoggedOut] = useState(false)

  useEffect(() => {
    // Check if we've already called the logout endpoint
    if (sessionStorage.getItem('logout_called') === 'true') {
      // We've already logged out, now redirect to home
      sessionStorage.removeItem('logout_called')
      setLoggedOut(true)
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } else {
      // First time here, call Cloudflare logout endpoint
      sessionStorage.setItem('logout_called', 'true')
      // Redirect to Cloudflare logout, which will redirect back here
      window.location.href = '/cdn-cgi/access/logout'
    }
  }, [])

  return (
    <div className="page-body">
      <div className="container-tight py-5">
        <div className="text-center mb-4">
          <div className="avatar avatar-xl bg-danger-lt mb-3 mx-auto">
            <IconLogout size={40} />
          </div>
          <h2>Logging out...</h2>
          <p className="text-muted mt-3">
            You have been logged out successfully
          </p>
          <div className="spinner-border mt-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
