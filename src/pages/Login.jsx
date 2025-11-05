import { useEffect } from 'react'
import { IconShield } from '@tabler/icons-react'

export default function Login() {
  useEffect(() => {
    // When users visit /login, immediately redirect them to /admin
    // Cloudflare Access will intercept the /admin request and show the authentication page
    // After successful authentication, Cloudflare will redirect them back to /admin
    window.location.href = '/admin'
  }, [])

  return (
    <div className="page-body">
      <div className="container-tight py-5">
        <div className="text-center mb-4">
          <div className="avatar avatar-xl bg-primary-lt mb-3 mx-auto">
            <IconShield size={40} />
          </div>
          <h2>Redirecting to login...</h2>
          <p className="text-muted mt-3">
            You will be redirected to Cloudflare Access to authenticate
          </p>
          <div className="spinner-border mt-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
