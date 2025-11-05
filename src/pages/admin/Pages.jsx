import { Link } from 'react-router-dom'
import { IconArrowLeft, IconHome, IconMapPin, IconInfoCircle } from '@tabler/icons-react'

export default function Pages() {
  const pages = [
    {
      title: 'Homepage',
      description: 'Edit homepage content, hero video, and featured announcements.',
      icon: IconHome,
      link: '/admin/homepage',
      color: 'primary'
    },
    {
      title: 'Visit Page',
      description: 'Manage visit page content, service times, and visitor information.',
      icon: IconMapPin,
      link: '/admin/visit-page',
      color: 'success'
    },
    {
      title: 'About Page',
      description: 'Configure mission statement, church history, and beliefs.',
      icon: IconInfoCircle,
      link: '/admin/about-page',
      color: 'info'
    }
  ]

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle">
                <Link to="/admin" className="text-muted text-decoration-none">
                  <IconArrowLeft className="me-1" size={16} />
                  Back to Admin Portal
                </Link>
              </div>
              <h2 className="page-title">Pages</h2>
              <p className="text-muted mt-1">Edit content for all site pages</p>
            </div>
          </div>
        </div>

        <div className="row row-cards mt-4">
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <div key={page.title} className="col-md-6 col-lg-4">
                <div className="card card-link card-link-pop">
                  <Link to={page.link} className="d-block">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className={`avatar avatar-md bg-${page.color}-lt me-3`}>
                          <Icon size={28} />
                        </div>
                        <h3 className="card-title mb-0">{page.title}</h3>
                      </div>
                      <p className="text-muted mb-0">{page.description}</p>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
