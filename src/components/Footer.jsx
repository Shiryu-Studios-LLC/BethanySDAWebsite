import { Link } from 'react-router-dom'
import { IconLock } from '@tabler/icons-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-fc5bfa77df6042a081860f61dded7bb3.r2.dev'

  return (
    <footer className="footer bg-dark text-white mt-auto py-3">
      <div className="container-xl">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={`${R2_PUBLIC_URL}/sda-logo.svg`}
              alt="Seventh-day Adventist Logo"
              style={{ height: '40px', width: 'auto' }}
            />
            <p className="text-muted mb-0 small">
              © {new Date().getFullYear()} Bethany SDA Church. All rights reserved.
            </p>
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <LanguageSwitcher />
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
