import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page-body p-0">
      <section className="hero" style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1
        }}></div>

        {/* Content */}
        <div className="container" style={{zIndex: 1}}>
          <div className="row justify-content-center">
            <div className="col-12 text-center text-white">
              <h1 className="display-4 fw-bold mb-3">Welcome to Bethany SDA Church</h1>
              <p className="lead mb-4">Houston's Haitian Seventh-day Adventist Community</p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/visit" className="btn btn-primary btn-lg">
                  Plan A Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
