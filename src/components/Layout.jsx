import { Outlet, Link, useLocation } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="page d-flex flex-column min-vh-100">
      {!isHomePage && (
        <header className="navbar navbar-expand-md navbar-dark bg-dark sticky-top d-print-none shadow">
          <div className="container-xl">
            <h1 className="navbar-brand pe-0 pe-md-3 mb-0">
              <Link to="/" className="text-white text-decoration-none">
                Bethany SDA Church
              </Link>
            </h1>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbar-menu"
              aria-controls="navbar-menu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar-menu">
              <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/about" className="nav-link">
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/events" className="nav-link">
                      Events
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/visit" className="nav-link">
                      Visit
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/contact" className="nav-link">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="page-wrapper flex-fill">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
