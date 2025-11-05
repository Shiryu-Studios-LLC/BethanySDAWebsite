import { Link } from 'react-router-dom'
import { IconLock } from '@tabler/icons-react'

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white mt-auto py-3">
      <div className="container-xl">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <p className="text-muted mb-0 small">
            © {new Date().getFullYear()} Bethany SDA Church. All rights reserved.
          </p>
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
    </footer>
  )
}
