import { IconMapPin, IconPhone, IconMail, IconClock, IconBrandFacebook, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react'

export default function Contact() {
  return (
    <div className="page-body">
      {/* Hero Section */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
              <p className="lead mb-0">
                We'd love to hear from you! Reach out with any questions or prayer requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="avatar avatar-xl bg-primary-lt mb-3 mx-auto">
                    <IconMapPin size={32} />
                  </div>
                  <h3 className="card-title mb-3">Visit Us</h3>
                  <p className="text-muted mb-2">
                    Houston, Texas
                  </p>
                  <p className="text-muted small">
                    (Exact address coming soon)
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="avatar avatar-xl bg-success-lt mb-3 mx-auto">
                    <IconPhone size={32} />
                  </div>
                  <h3 className="card-title mb-3">Call Us</h3>
                  <p className="text-muted mb-2">
                    (Phone number coming soon)
                  </p>
                  <p className="text-muted small">
                    Available during office hours
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <div className="avatar avatar-xl bg-info-lt mb-3 mx-auto">
                    <IconMail size={32} />
                  </div>
                  <h3 className="card-title mb-3">Email Us</h3>
                  <p className="text-muted mb-2">
                    (Email coming soon)
                  </p>
                  <p className="text-muted small">
                    We'll respond within 24-48 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex align-items-center">
                    <IconClock size={24} className="me-2" />
                    <h3 className="card-title mb-0">Service Times</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Sabbath School</strong>
                        <span className="text-muted">Saturdays</span>
                      </div>
                      <p className="text-muted mb-0">9:30 AM - 10:45 AM</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Divine Worship</strong>
                        <span className="text-muted">Saturdays</span>
                      </div>
                      <p className="text-muted mb-0">11:00 AM - 12:30 PM</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Prayer Meeting</strong>
                        <span className="text-muted">Wednesdays</span>
                      </div>
                      <p className="text-muted mb-0">7:00 PM - 8:00 PM</p>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Office Hours</strong>
                        <span className="text-muted">By Appointment</span>
                      </div>
                      <p className="text-muted mb-0">Please call ahead</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="mb-4 text-center">Find Us</h2>
          <div className="card">
            <div className="card-body p-0">
              <div className="ratio ratio-21x9 bg-secondary rounded">
                <div className="d-flex align-items-center justify-content-center text-white">
                  <div className="text-center">
                    <IconMapPin size={48} className="mb-3" />
                    <p className="mb-0">Interactive Map Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-5 bg-light">
        <div className="container py-4 text-center">
          <h2 className="mb-4">Connect With Us</h2>
          <p className="lead mb-4">Follow us on social media to stay updated with church news and events</p>
          <div className="d-flex justify-content-center gap-3">
            <a href="#" className="btn btn-icon btn-lg bg-facebook text-white">
              <IconBrandFacebook size={24} />
            </a>
            <a href="#" className="btn btn-icon btn-lg bg-youtube text-white">
              <IconBrandYoutube size={24} />
            </a>
            <a href="#" className="btn btn-icon btn-lg bg-instagram text-white">
              <IconBrandInstagram size={24} />
            </a>
          </div>
          <p className="text-muted mt-3 small">Social media links coming soon</p>
        </div>
      </section>
    </div>
  )
}
