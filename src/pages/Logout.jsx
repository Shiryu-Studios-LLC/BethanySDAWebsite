import { useEffect } from 'react'
import { IconLogout } from '@tabler/icons-react'

export default function Logout() {
  useEffect(() => {
    // When this page loads, immediately redirect to Cloudflare logout
    // Cloudflare will redirect back HERE (to /logout), not to /admin
    // Then we redirect to home

    const hasLoggedOut = sessionStorage.getItem('cf_logged_out')

    if (hasLoggedOut) {
      // We've already been to Cloudflare logout, now go home
      sessionStorage.removeItem('cf_logged_out')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } else {
      // First time on this page, go to Cloudflare logout
      sessionStorage.setItem('cf_logged_out', 'true')
      // Cloudflare will redirect back to /logout (the current page)
      window.location.replace('/cdn-cgi/access/logout')
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
