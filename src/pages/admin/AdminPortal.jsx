import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IconPhoto, IconFiles, IconCalendar, IconMicrophone, IconFileText, IconSettings, IconVideo, IconBook } from '@tabler/icons-react'
import UnrealToolbar from '../../components/UnrealToolbar'

export default function AdminPortal() {
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
      icon: IconFiles,
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
    },
    {
      title: 'Documentation',
      description: 'Complete guide to managing your church website and using all features.',
      icon: IconBook,
      link: '/admin/documentation',
      color: 'purple'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0'
    }}>
      <UnrealToolbar stats={stats} loadingStats={loadingStats} />

      <div style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* Feature Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  style={{
                    backgroundColor: '#252525',
                    border: '1px solid #3a3a3a',
                    borderRadius: '4px',
                    padding: '20px',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2d2d2d'
                    e.currentTarget.style.borderColor = '#4a7ba7'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#252525'
                    e.currentTarget.style.borderColor = '#3a3a3a'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '6px',
                      backgroundColor: '#4a7ba7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <Icon size={24} color="#ffffff" />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: '0 0 8px 0',
                        color: '#e0e0e0'
                      }}>
                        {feature.title}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: '#a0a0a0',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
