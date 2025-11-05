import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IconHeart, IconBible, IconUsers, IconWorld } from '@tabler/icons-react'

export default function About() {
  const [settings, setSettings] = useState({
    churchName: 'Bethany SDA Church',
    missionStatement: 'To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.',
    ourHistory: 'Bethany SDA Church is a vibrant community of believers in Houston, Texas, celebrating our Haitian heritage while welcoming all who seek to worship God.',
    ourBeliefs: ''
  })

  useEffect(() => {
    // Load general site settings (church name)
    const siteStored = localStorage.getItem('siteSettings')
    if (siteStored) {
      const parsedSettings = JSON.parse(siteStored)
      setSettings(prev => ({ ...prev, ...parsedSettings }))
    }

    // Load about page specific settings
    const aboutStored = localStorage.getItem('aboutPageSettings')
    if (aboutStored) {
      const parsedSettings = JSON.parse(aboutStored)
      setSettings(prev => ({ ...prev, ...parsedSettings }))
    }
  }, [])

  const beliefs = [
    {
      icon: IconBible,
      title: 'Bible-Based',
      description: 'We believe the Bible is God\'s inspired Word and the foundation of our faith and practice.'
    },
    {
      icon: IconHeart,
      title: 'Grace-Centered',
      description: 'We celebrate God\'s amazing grace through Jesus Christ and His gift of salvation.'
    },
    {
      icon: IconUsers,
      title: 'Community-Focused',
      description: 'We are committed to loving God and loving others through service and fellowship.'
    },
    {
      icon: IconWorld,
      title: 'Mission-Driven',
      description: 'We share the gospel and make disciples, preparing people for Christ\'s soon return.'
    }
  ]

  return (
    <div className="page-body">
      {/* Hero Section */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">About {settings.churchName}</h1>
              <p className="lead mb-0">
                Learn more about {settings.churchName} and our mission to share God's love in Houston.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Our Story</h2>
              {settings.ourHistory ? (
                <div dangerouslySetInnerHTML={{ __html: settings.ourHistory.replace(/\n/g, '<br />') }} />
              ) : (
                <>
                  <p className="lead mb-4">
                    Bethany SDA Church is a vibrant community of believers in Houston, Texas, celebrating
                    our Haitian heritage while welcoming all who seek to worship God.
                  </p>
                  <p className="mb-4">
                    We are part of the worldwide Seventh-day Adventist Church, which has a presence in
                    over 200 countries and territories. Our church family is united by a common faith in
                    Jesus Christ and a commitment to sharing His love with our community.
                  </p>
                  <p className="mb-0">
                    As a Haitian Seventh-day Adventist congregation, we treasure our cultural heritage
                    while embracing the diversity of God's family. We conduct services in multiple languages
                    and celebrate the rich traditions that make our community unique.
                  </p>
                </>
              )}
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body p-0">
                  <div className="ratio ratio-16x9 bg-secondary rounded">
                    <div className="d-flex align-items-center justify-content-center text-white">
                      <p className="mb-0">Church Photo Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Beliefs */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="text-center mb-5">What We Believe</h2>
          <div className="row g-4">
            {beliefs.map((belief, index) => {
              const Icon = belief.icon
              return (
                <div key={index} className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-3">
                        <div className="avatar avatar-md bg-primary-lt me-3">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="card-title mb-2">{belief.title}</h3>
                          <p className="text-muted mb-0">{belief.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-5">
            <p className="mb-3">Learn more about Seventh-day Adventist beliefs</p>
            <a
              href="https://www.adventist.org/beliefs/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              View Full Statement of Beliefs
            </a>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="mb-4">Our Mission</h2>
              <p className="lead mb-4">
                {settings.missionStatement}
              </p>
              <div className="card bg-primary text-white">
                <div className="card-body p-4">
                  <h3 className="mb-3">Our Vision</h3>
                  <p className="mb-0">
                    To be a thriving, multicultural church community that reflects God's love,
                    actively shares the gospel, and makes a positive impact in Houston and beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-4 text-center">
          <h2 className="mb-4">Join Our Family</h2>
          <p className="lead mb-4">
            We'd love to welcome you to Bethany SDA Church. Come experience our warm fellowship!
          </p>
          <Link to="/visit" className="btn btn-light btn-lg">
            Plan Your Visit
          </Link>
        </div>
      </section>
    </div>
  )
}
