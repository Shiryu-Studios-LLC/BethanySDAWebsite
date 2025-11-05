import { useEffect } from 'react'
import { IconLogout } from '@tabler/icons-react'

export default function Logout() {
  useEffect(() => {
    // Simply redirect to home after a brief moment
    // Cloudflare Access session will be revoked on next request
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 1500)

    return () => clearTimeout(timer)
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
