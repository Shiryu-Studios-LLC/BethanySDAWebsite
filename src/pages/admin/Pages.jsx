import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconHome, IconMapPin, IconInfoCircle, IconPlus, IconFile } from '@tabler/icons-react'

export default function Pages() {
  const [dynamicPages, setDynamicPages] = useState([])
  const [loading, setLoading] = useState(true)

  const staticPages = [
    {
      title: 'Homepage',
      description: 'Edit homepage content with the visual page builder.',
      icon: IconHome,
      link: '/admin/page-editor/home',
      color: 'primary',
      isStatic: true
    },
    {
      title: 'Visit Page',
      description: 'Manage visit page content with the visual page builder.',
      icon: IconMapPin,
      link: '/admin/page-editor/visit',
      color: 'success',
      isStatic: true
    },
    {
      title: 'About Page',
      description: 'Configure about page content with the visual page builder.',
      icon: IconInfoCircle,
      link: '/admin/page-editor/about',
      color: 'info',
      isStatic: true
    }
  ]

  useEffect(() => {
    loadDynamicPages()
  }, [])

  const loadDynamicPages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setDynamicPages(data.pages || [])
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

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
            <div className="col-auto">
              <Link to="/admin/page-editor/new" className="btn btn-primary">
                <IconPlus size={16} className="me-1" />
                Create New Page
              </Link>
            </div>
          </div>
        </div>

        {/* Static Core Pages */}
        <div className="mb-4 mt-4">
          <h3 className="mb-3">Core Pages</h3>
          <div className="row row-cards">
            {staticPages.map((page) => {
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

        {/* Dynamic Custom Pages */}
        <div className="mb-4">
          <h3 className="mb-3">Custom Pages</h3>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : dynamicPages.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-icon">
                  <IconFile size={48} />
                </div>
                <p className="empty-title">No custom pages yet</p>
                <p className="empty-subtitle text-muted">
                  Create your first custom page to get started
                </p>
                <div className="empty-action">
                  <Link to="/admin/page-editor/new" className="btn btn-primary">
                    <IconPlus size={16} className="me-1" />
                    Create New Page
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="row row-cards">
              {dynamicPages.map((page) => (
                <div key={page.id} className="col-md-6 col-lg-4">
                  <div className="card card-link card-link-pop">
                    <Link to={`/admin/page-editor/${page.slug}`} className="d-block">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-md bg-secondary-lt me-3">
                            <IconFile size={28} />
                          </div>
                          <div className="flex-fill">
                            <h3 className="card-title mb-0">{page.title}</h3>
                            <div className="text-muted small">/{page.slug}</div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          {page.is_published ? (
                            <span className="badge bg-success-lt">Published</span>
                          ) : (
                            <span className="badge bg-secondary-lt">Draft</span>
                          )}
                          {page.show_in_nav && (
                            <span className="badge bg-info-lt">In Nav</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
