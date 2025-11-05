import { IconShield, IconLogin, IconHome } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export default function Login() {
  const handleLogin = () => {
    // Redirect to /admin, which will trigger Cloudflare Access authentication
    window.location.href = '/admin'
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
                Access the admin portal with your authorized Google or GitHub account
              </p>
            </div>

            <div className="mb-3">
              <button
                onClick={handleLogin}
                className="btn btn-primary w-100"
              >
                <IconLogin size={20} className="me-2" />
                Continue to Login
              </button>
            </div>

            <div className="text-center">
              <div className="small text-muted mb-2">
                <IconShield size={16} className="me-1" />
                Secured by Cloudflare Access
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-muted mt-3">
          <Link to="/" className="text-decoration-none">
            <IconHome size={16} className="me-1" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
