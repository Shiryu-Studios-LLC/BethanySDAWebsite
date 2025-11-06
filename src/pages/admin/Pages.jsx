import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconHome, IconMapPin, IconInfoCircle, IconPlus, IconFile } from '@tabler/icons-react'

export default function Pages() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  // Icon mapping for special pages
  const pageIcons = {
    'home': { icon: IconHome, color: 'primary' },
    'visit': { icon: IconMapPin, color: 'success' },
    'about': { icon: IconInfoCircle, color: 'info' }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages || [])
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

        {/* All Pages */}
        <div className="mb-4 mt-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : pages.length === 0 ? (
            <div className="card">
              <div className="empty">
                <div className="empty-icon">
                  <IconFile size={48} />
                </div>
                <p className="empty-title">No pages yet</p>
                <p className="empty-subtitle text-muted">
                  Create your first page to get started
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
              {pages.map((page) => {
                const iconConfig = pageIcons[page.slug] || { icon: IconFile, color: 'secondary' }
                const Icon = iconConfig.icon
                const isCorePages = ['home', 'visit', 'about'].includes(page.slug)

                return (
                  <div key={page.id} className="col-md-6 col-lg-4">
                    <div className="card card-link card-link-pop">
                      <Link to={`/admin/page-editor/${page.slug}`} className="d-block">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className={`avatar avatar-md bg-${iconConfig.color}-lt me-3`}>
                              <Icon size={28} />
                            </div>
                            <div className="flex-fill">
                              <h3 className="card-title mb-0">{page.title}</h3>
                              <div className="text-muted small">/{page.slug}</div>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            {isCorePages && (
                              <span className="badge bg-azure-lt">Core Page</span>
                            )}
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
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
