import { Outlet, Link } from 'react-router-dom'
import { IconUserCircle } from '@tabler/icons-react'

export default function Layout() {
  return (
    <div className="page">
      <header className="navbar navbar-expand-md d-print-none" style={{background: 'rgba(0,0,0,0.5)', position: 'fixed', width: '100%', zIndex: 1000}}>
        <div className="container-xl">
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <Link to="/" className="text-white text-decoration-none">
              Bethany SDA Church
            </Link>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <Link to="/admin" className="nav-link">
              <IconUserCircle className="me-1" size={20} />
              <span className="d-none d-md-inline">Admin Portal</span>
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <span className="nav-link-title">Home</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="page-wrapper">
        <Outlet />
      </div>
    </div>
  )
}
