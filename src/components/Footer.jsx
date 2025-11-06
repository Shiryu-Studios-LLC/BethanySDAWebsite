import { Link } from 'react-router-dom'
import { IconLock } from '@tabler/icons-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white mt-auto py-3">
      <div className="container-xl">
        <div className="d-flex flex-column align-items-center gap-3">
          {/* Logo */}
          <div className="d-flex justify-content-center">
            <img
              src="/sda-logo.svg"
              alt="Seventh-day Adventist Logo"
              style={{ height: '50px', width: 'auto' }}
              onError={(e) => {
                console.error('Failed to load SDA logo')
                e.target.style.display = 'none'
              }}
            />
          </div>

          {/* Footer content */}
          <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 w-100">
            <p className="text-muted mb-0 small">
              © {new Date().getFullYear()} Bethany SDA Church. All rights reserved.
            </p>
            <span className="text-muted">|</span>
            <LanguageSwitcher />
            <span className="text-muted">|</span>
            <Link
              to="/login"
              className="text-muted text-decoration-none small"
              title="Staff Login"
            >
              <IconLock size={14} className="me-1" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
