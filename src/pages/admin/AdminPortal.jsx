import { Link } from 'react-router-dom'
import { IconPhoto, IconHome, IconCalendar, IconMicrophone, IconFileText, IconSettings } from '@tabler/icons-react'

export default function AdminPortal() {
  const features = [
    {
      title: 'Media Library',
      description: 'Upload and manage images, videos, and documents for your website.',
      icon: IconPhoto,
      link: '/admin/media',
      color: 'primary'
    },
    {
      title: 'Homepage',
      description: 'Edit homepage content, hero video, and featured announcements.',
      icon: IconHome,
      link: '/admin/homepage',
      color: 'success'
    },
    {
      title: 'Events',
      description: 'Create and manage church events, services, and special programs.',
      icon: IconCalendar,
      link: '/admin/events',
      color: 'info'
    },
    {
      title: 'Sermons',
      description: 'Upload sermon audio and video, manage sermon archive.',
      icon: IconMicrophone,
      link: '/admin/sermons',
      color: 'warning'
    },
    {
      title: 'Bulletins',
      description: 'Upload weekly bulletins, newsletters, and announcements.',
      icon: IconFileText,
      link: '/admin/bulletins',
      color: 'danger'
    },
    {
      title: 'Site Settings',
      description: 'Configure site information, contact details, and social media links.',
      icon: IconSettings,
      link: '/admin/settings',
      color: 'secondary'
    }
  ]

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Admin Portal</h2>
              <div className="text-muted">Manage church content without editing code</div>
            </div>
          </div>
        </div>

        <div className="row row-cards mt-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="col-md-6 col-lg-4">
                <div className="card card-link card-link-pop">
                  <Link to={feature.link} className="d-block">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className={`avatar avatar-md bg-${feature.color}-lt me-3`}>
                          <Icon size={28} />
                        </div>
                        <h3 className="card-title mb-0">{feature.title}</h3>
                      </div>
                      <p className="text-muted mb-0">{feature.description}</p>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="row row-cards mt-4">
          <div className="col-12">
            <h3 className="mb-3">Quick Stats</h3>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconPhoto size={48} className="text-primary mb-2" />
                <h3 className="m-0">--</h3>
                <div className="text-muted">Images</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconFileText size={48} className="text-success mb-2" />
                <h3 className="m-0">--</h3>
                <div className="text-muted">Videos</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconCalendar size={48} className="text-info mb-2" />
                <h3 className="m-0">--</h3>
                <div className="text-muted">Upcoming Events</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconMicrophone size={48} className="text-warning mb-2" />
                <h3 className="m-0">--</h3>
                <div className="text-muted">Sermons</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
