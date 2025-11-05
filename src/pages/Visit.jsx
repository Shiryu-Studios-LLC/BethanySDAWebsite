import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IconClock, IconMapPin, IconCalendar, IconUsers, IconHome, IconHeart } from '@tabler/icons-react'

export default function Visit() {
  const [settings, setSettings] = useState({
    visitPageTitle: 'Plan Your Visit',
    visitPageDescription: 'We\'d love to meet you! Here\'s everything you need to know for your first visit to Bethany SDA Church.',
    sabbathSchool: 'Saturdays at 9:30 AM',
    worshipService: 'Saturdays at 11:00 AM',
    prayerMeeting: 'Wednesdays at 7:00 PM',
    address: '',
    city: '',
    state: ''
  })

  useEffect(() => {
    const stored = localStorage.getItem('siteSettings')
    if (stored) {
      const parsedSettings = JSON.parse(stored)
      setSettings(prev => ({ ...prev, ...parsedSettings }))
    }
  }, [])

  const fullAddress = settings.address && settings.city && settings.state
    ? `${settings.address}, ${settings.city}, ${settings.state} ${settings.zipCode || ''}`.trim()
    : 'Houston, Texas'

  return (
    <div className="page-body">
      {/* Hero Section */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">{settings.visitPageTitle}</h1>
              <p className="lead mb-0">
                {settings.visitPageDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="text-center mb-5">Service Times</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <IconClock size={48} className="text-primary mb-3" />
                  <h3 className="h4 mb-3">Sabbath School</h3>
                  <p className="mb-2"><strong>{settings.sabbathSchool}</strong></p>
                  <p className="text-muted">
                    Bible study and discussion groups for all ages. Join us as we dive deep into God's Word together.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-primary">
                <div className="card-body text-center">
                  <IconClock size={48} className="text-primary mb-3" />
                  <h3 className="h4 mb-3">Divine Worship</h3>
                  <p className="mb-2"><strong>{settings.worshipService}</strong></p>
                  <p className="text-muted">
                    Our main worship service featuring inspiring music, prayer, and a message from God's Word.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <IconClock size={48} className="text-primary mb-3" />
                  <h3 className="h4 mb-3">Prayer Meeting</h3>
                  <p className="mb-2"><strong>{settings.prayerMeeting}</strong></p>
                  <p className="text-muted">
                    Mid-week prayer and Bible study. A time to connect with God and strengthen our faith together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="text-center mb-5">What to Expect</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <IconUsers size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-2">Warm Welcome</h4>
                  <p className="text-muted mb-0">
                    Our greeters will welcome you at the door and help you find your way. Feel free to ask any questions!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <IconHeart size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-2">Casual Dress</h4>
                  <p className="text-muted mb-0">
                    Come as you are! While some dress up, many attend in casual attire. What matters most is your heart.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <IconHome size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-2">Family Friendly</h4>
                  <p className="text-muted mb-0">
                    Children are welcome in all services. We have children's programs and a nursery available.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <IconCalendar size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-2">Service Length</h4>
                  <p className="text-muted mb-0">
                    Our main worship service typically lasts 90-120 minutes, including music, prayer, and message.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Find Us</h2>
              <div className="d-flex align-items-start mb-3">
                <IconMapPin size={24} className="text-primary me-3 mt-1" />
                <div>
                  <h5 className="mb-2">Address</h5>
                  <p className="mb-0">
                    {fullAddress}
                    {!settings.address && <><br /><small className="text-muted">(Address can be configured in Site Settings)</small></>}
                  </p>
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary btn-lg mt-3">
                Get Directions
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="ratio ratio-16x9 bg-secondary rounded">
                    <div className="d-flex align-items-center justify-content-center text-white">
                      <p className="mb-0">Map Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-4 text-center">
          <h2 className="mb-4">Questions?</h2>
          <p className="lead mb-4">
            We're here to help! If you have any questions about visiting, feel free to reach out.
          </p>
          <Link to="/contact" className="btn btn-outline-light btn-lg">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
