import { Link } from 'react-router-dom'
import { IconCalendar, IconMapPin, IconClock, IconChevronDown } from '@tabler/icons-react'
import './Home.css'

export default function Home() {
  return (
    <div className="page-body p-0">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="hero-overlay"></div>

        {/* Content */}
        <div className="hero-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="hero-title animate-fade-in">
                  Welcome to Bethany SDA Church
                </h1>
                <p className="hero-subtitle animate-fade-in-delay">
                  Houston's Haitian Seventh-day Adventist Community
                </p>
                <p className="hero-description animate-fade-in-delay-2">
                  Join us in worship, fellowship, and service as we grow together in faith
                </p>
                <div className="hero-buttons animate-fade-in-delay-3">
                  <Link to="/visit" className="btn btn-primary btn-lg px-5 py-3 me-3">
                    <IconMapPin size={20} className="me-2" />
                    Plan A Visit
                  </Link>
                  <Link to="/events" className="btn btn-outline-light btn-lg px-5 py-3">
                    <IconCalendar size={20} className="me-2" />
                    View Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <IconChevronDown size={32} className="bounce" />
        </div>
      </section>

      {/* Service Times Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container">
          <div className="row text-center text-white">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="service-time-card">
                <IconClock size={48} className="mb-3" />
                <h3 className="h4 mb-2">Sabbath School</h3>
                <p className="mb-0">Saturdays at 9:30 AM</p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="service-time-card">
                <IconClock size={48} className="mb-3" />
                <h3 className="h4 mb-2">Divine Worship</h3>
                <p className="mb-0">Saturdays at 11:00 AM</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-time-card">
                <IconClock size={48} className="mb-3" />
                <h3 className="h4 mb-2">Prayer Meeting</h3>
                <p className="mb-0">Wednesdays at 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">Welcome Home</h2>
              <p className="lead mb-4">
                At Bethany SDA Church, we believe in creating a warm, welcoming environment
                where everyone can experience God's love and grow in their faith journey.
              </p>
              <p className="text-muted mb-4">
                Whether you're new to the area, new to church, or looking for a church home,
                we invite you to join our vibrant community of believers. We celebrate our
                Haitian heritage while welcoming all who seek to worship and serve together.
              </p>
              <Link to="/about" className="btn btn-primary btn-lg">
                Learn More About Us
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body p-0">
                  <div className="ratio ratio-16x9 bg-secondary rounded">
                    {/* Placeholder for image */}
                    <div className="d-flex align-items-center justify-content-center text-white">
                      <p className="mb-0">Church Image Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold mb-4">Join Us This Sabbath</h2>
          <p className="lead mb-5">
            Experience the joy of worship and fellowship with our church family
          </p>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card bg-white text-dark">
                <div className="card-body p-4">
                  <h5 className="card-title mb-3">Our Location</h5>
                  <p className="mb-2">
                    <IconMapPin size={20} className="me-2" />
                    Houston, Texas
                  </p>
                  <p className="text-muted mb-4">
                    We'd love to see you this weekend!
                  </p>
                  <Link to="/contact" className="btn btn-primary btn-lg">
                    Get Directions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
