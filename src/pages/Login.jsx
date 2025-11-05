import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconLock, IconBrandGoogle, IconBrandMicrosoft, IconShield } from '@tabler/icons-react'

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoading(true)

    // TEMPORARY: This simulates authentication until Cloudflare Access is configured
    // Once Cloudflare Access is set up, it will handle the entire OAuth flow automatically
    // and this code will no longer be needed - Cloudflare Access will redirect users here after auth

    // For demo purposes, simulate successful authentication
    const demoEmail = prompt('Enter your email to simulate Google login (temporary - will be replaced by Cloudflare Access):')

    if (demoEmail) {
      localStorage.setItem('cf_auth_token', 'demo_token_' + Date.now())
      localStorage.setItem('cf_user_email', demoEmail)
      localStorage.setItem('cf_auth_provider', 'google')
      navigate('/admin')
    } else {
      setIsLoading(false)
    }
  }

  const handleMicrosoftLogin = () => {
    setIsLoading(true)

    // TEMPORARY: This simulates authentication until Cloudflare Access is configured
    // Once Cloudflare Access is set up, it will handle the entire OAuth flow automatically
    // and this code will no longer be needed - Cloudflare Access will redirect users here after auth

    // For demo purposes, simulate successful authentication
    const demoEmail = prompt('Enter your email to simulate Microsoft login (temporary - will be replaced by Cloudflare Access):')

    if (demoEmail) {
      localStorage.setItem('cf_auth_token', 'demo_token_' + Date.now())
      localStorage.setItem('cf_user_email', demoEmail)
      localStorage.setItem('cf_auth_provider', 'microsoft')
      navigate('/admin')
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-body">
      <div className="container-tight py-5">
        <div className="text-center mb-4">
          <a href="/" className="navbar-brand navbar-brand-autodark">
            <h1 className="mb-0">Bethany SDA Church</h1>
          </a>
        </div>
        <div className="card card-md">
          <div className="card-body">
            <div className="text-center mb-4">
              <div className="avatar avatar-xl bg-primary-lt mb-3 mx-auto">
                <IconShield size={40} />
              </div>
              <h2 className="card-title">Staff Login</h2>
              <p className="text-muted">
                Sign in with your organization account to access the admin portal
              </p>
            </div>

            <div className="mb-3">
              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <IconBrandGoogle size={20} className="me-2" />
                Continue with Google
              </button>
            </div>

            <div className="mb-3">
              <button
                className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
              >
                <IconBrandMicrosoft size={20} className="me-2" />
                Continue with Microsoft
              </button>
            </div>

            <div className="text-center mt-4">
              <div className="d-flex align-items-center justify-content-center text-muted small">
                <IconLock size={16} className="me-1" />
                Secured by Cloudflare Access
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-muted mt-3">
          <a href="/" className="text-decoration-none">
            &larr; Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
