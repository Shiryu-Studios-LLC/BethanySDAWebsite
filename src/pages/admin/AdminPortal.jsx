import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IconPhoto, IconPage, IconCalendar, IconMicrophone, IconFileText, IconSettings, IconLogout, IconVideo } from '@tabler/icons-react'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminPortal() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    images: 0,
    videos: 0,
    documents: 0,
    totalFiles: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  // Load stats on component mount
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoadingStats(true)
      const response = await fetch('/api/media')

      if (response.ok) {
        const data = await response.json()
        const files = data.files || []

        // Count different file types
        const imageCount = files.filter(f =>
          f.fileKey.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        ).length

        const videoCount = files.filter(f =>
          f.fileKey.match(/\.(mp4|webm|ogg|mkv|avi|mov)$/i)
        ).length

        const documentCount = files.filter(f =>
          f.fileKey.match(/\.(pdf|doc|docx)$/i)
        ).length

        setStats({
          images: imageCount,
          videos: videoCount,
          documents: documentCount,
          totalFiles: files.length
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const features = [
    {
      title: 'Media Library',
      description: 'Upload and manage images, videos, and documents for your website.',
      icon: IconPhoto,
      link: '/admin/media',
      color: 'primary'
    },
    {
      title: 'Pages',
      description: 'Edit Page content, for all site pages.',
      icon: IconPage,
      link: '/admin/pages',
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
              <div className="text-muted">
                {user?.email ? `Logged in as ${user.email}` : 'Manage church content without editing code'}
              </div>
            </div>
            <div className="col-auto">
              <button onClick={logout} className="btn btn-outline-danger">
                <IconLogout size={16} className="me-1" />
                Logout
              </button>
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
                <h3 className="m-0">
                  {loadingStats ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    stats.images
                  )}
                </h3>
                <div className="text-muted">Images</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconVideo size={48} className="text-success mb-2" />
                <h3 className="m-0">
                  {loadingStats ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    stats.videos
                  )}
                </h3>
                <div className="text-muted">Videos</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconFileText size={48} className="text-info mb-2" />
                <h3 className="m-0">
                  {loadingStats ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    stats.documents
                  )}
                </h3>
                <div className="text-muted">Documents</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <IconPhoto size={48} className="text-warning mb-2" />
                <h3 className="m-0">
                  {loadingStats ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    stats.totalFiles
                  )}
                </h3>
                <div className="text-muted">Total Files</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
