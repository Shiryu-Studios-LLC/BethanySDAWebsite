import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IconCalendar, IconMapPin, IconClock, IconChevronDown } from '@tabler/icons-react'
import './Home.css'

export default function Home() {
  const [settings, setSettings] = useState({
    churchName: 'Bethany SDA Church',
    tagline: 'Houston\'s Haitian Seventh-day Adventist Community',
    sabbathSchool: 'Saturdays at 9:30 AM',
    worshipService: 'Saturdays at 11:00 AM',
    prayerMeeting: 'Wednesdays at 7:00 PM',
    address: 'Houston, Texas'
  })

  const [homepageSettings, setHomepageSettings] = useState({
    heroVideoUrl: '/videos/hero.mp4',
    heroImageUrl: '',
    welcomeMessage: 'Join us in worship, fellowship, and service as we grow together in faith',
    liveStreamUrl: '',
    showLiveStream: false
  })

  const [showLiveModal, setShowLiveModal] = useState(false)

  useEffect(() => {
    // Load settings initially
    const loadAllSettings = () => {
      const stored = localStorage.getItem('siteSettings')
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        setSettings(prev => ({ ...prev, ...parsedSettings }))
      }

      const homepageStored = localStorage.getItem('homepageSettings')
      if (homepageStored) {
        setHomepageSettings(JSON.parse(homepageStored))
      }
    }

    // Load settings on mount
    loadAllSettings()

    // Poll for settings updates every 30 seconds
    const pollInterval = setInterval(() => {
      loadAllSettings()
    }, 30000) // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval)
  }, [])

  const fullAddress = settings.address && settings.city && settings.state
    ? `${settings.address}, ${settings.city}, ${settings.state} ${settings.zipCode || ''}`.trim()
    : settings.address || 'Houston, Texas'

  const extractYouTubeId = (url) => {
    if (!url) return null
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/live\/([^&\n?#]+)/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const youtubeId = extractYouTubeId(homepageSettings.liveStreamUrl)
  const isLiveStreamActive = homepageSettings.showLiveStream && youtubeId

  return (
    <div className="page-body p-0">
      {/* Hero Section */}
      <section className="hero-section" style={{ cursor: isLiveStreamActive ? 'pointer' : 'default' }} onClick={() => isLiveStreamActive && setShowLiveModal(true)}>
        {/* Background Video or Live Stream */}
        {isLiveStreamActive ? (
          <>
            {/* YouTube Live Stream (muted, no controls) */}
            <iframe
              className="hero-video"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1&playlist=${youtubeId}`}
              title="Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '100vh',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            ></iframe>
            {/* LIVE NOW Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(220, 38, 38, 0.95)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '14px',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'white',
                animation: 'pulse 2s infinite'
              }}></span>
              LIVE NOW
            </div>
          </>
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          >
            <source src={homepageSettings.heroVideoUrl || "/videos/hero.mp4"} type="video/mp4" />
          </video>
        )}

        {/* Gradient Overlay */}
        <div className="hero-overlay" style={{ pointerEvents: 'none' }}></div>

        {/* Content */}
        <div className="hero-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="hero-title animate-fade-in">
                  Welcome to {settings.churchName}
                </h1>
                <p className="hero-subtitle animate-fade-in-delay">
                  {settings.tagline}
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
                <p className="mb-0">{settings.sabbathSchool}</p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="service-time-card">
                <IconClock size={48} className="mb-3" />
                <h3 className="h4 mb-2">Divine Worship</h3>
                <p className="mb-0">{settings.worshipService}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-time-card">
                <IconClock size={48} className="mb-3" />
                <h3 className="h4 mb-2">Prayer Meeting</h3>
                <p className="mb-0">{settings.prayerMeeting}</p>
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
                    {fullAddress}
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

      {/* Live Stream Modal */}
      {showLiveModal && isLiveStreamActive && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setShowLiveModal(false)} style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content bg-dark">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-white d-flex align-items-center gap-2">
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#dc2626',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    LIVE NOW - {settings.churchName}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowLiveModal(false)}></button>
                </div>
                <div className="modal-body p-0">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                      title="Live Stream - Full Player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="modal-footer border-0 bg-dark">
                  <p className="text-white-50 small mb-0">Click anywhere outside to close</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}
