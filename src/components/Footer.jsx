import { Link } from 'react-router-dom'
import { IconBrandFacebook, IconBrandYoutube, IconBrandInstagram, IconLock } from '@tabler/icons-react'

export default function Footer() {
  return (
    <footer className="footer footer-dark bg-dark text-white mt-auto">
      <div className="container-xl">
        <div className="row py-5">
          {/* About Section */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h3 className="mb-3">Bethany SDA Church</h3>
            <p className="text-muted mb-3">
              Houston's Haitian Seventh-day Adventist Community, dedicated to sharing God's love and preparing for Christ's return.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-icon btn-sm bg-facebook text-white" title="Facebook">
                <IconBrandFacebook size={18} />
              </a>
              <a href="#" className="btn btn-icon btn-sm bg-youtube text-white" title="YouTube">
                <IconBrandYoutube size={18} />
              </a>
              <a href="#" className="btn btn-icon btn-sm bg-instagram text-white" title="Instagram">
                <IconBrandInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-4 mb-4 mb-lg-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/visit" className="text-muted text-decoration-none">Plan a Visit</Link>
              </li>
              <li className="mb-2">
                <Link to="/events" className="text-muted text-decoration-none">Events</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-4 mb-4 mb-lg-0">
            <h5 className="mb-3">Contact</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                Houston, Texas
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">
                  Get Directions
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div className="col-lg-3 col-md-4">
            <h5 className="mb-3">Service Times</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <strong>Sabbath School:</strong> Sat 9:30 AM
              </li>
              <li className="mb-2">
                <strong>Worship:</strong> Sat 11:00 AM
              </li>
              <li className="mb-2">
                <strong>Prayer Meeting:</strong> Wed 7:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 pb-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <p className="text-muted mb-0">
                © {new Date().getFullYear()} Bethany SDA Church. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link
                to="/admin"
                className="text-muted text-decoration-none small"
                title="Admin Portal"
              >
                <IconLock size={14} className="me-1" />
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
