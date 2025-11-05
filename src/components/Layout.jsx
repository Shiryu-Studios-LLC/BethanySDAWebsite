import { Outlet, Link } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="page d-flex flex-column min-vh-100">
      <header className="navbar navbar-expand-md d-print-none" style={{background: 'rgba(0,0,0,0.5)', position: 'fixed', width: '100%', zIndex: 1000}}>
        <div className="container-xl">
          <h1 className="navbar-brand navbar-brand-autodark pe-0 pe-md-3">
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
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <span className="nav-link-title">Home</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    <span className="nav-link-title">About</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/events" className="nav-link">
                    <span className="nav-link-title">Events</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/visit" className="nav-link">
                    <span className="nav-link-title">Visit</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link">
                    <span className="nav-link-title">Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="page-wrapper flex-fill">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
