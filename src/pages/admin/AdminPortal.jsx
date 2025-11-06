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

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <StatCard
              icon={IconPhoto}
              label="Images"
              value={loadingStats ? '...' : stats.images}
              color="#4a7ba7"
            />
            <StatCard
              icon={IconVideo}
              label="Videos"
              value={loadingStats ? '...' : stats.videos}
              color="#5a9b5a"
            />
            <StatCard
              icon={IconFileText}
              label="Documents"
              value={loadingStats ? '...' : stats.documents}
              color="#7b8ba7"
            />
            <StatCard
              icon={IconPhoto}
              label="Total Files"
              value={loadingStats ? '...' : stats.totalFiles}
              color="#9b7ba7"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component - Unreal Style
function StatCard({ icon: Icon, label, value, color = '#4a7ba7' }) {
  return (
    <div style={{
      backgroundColor: '#252525',
      border: '1px solid #3a3a3a',
      borderRadius: '4px',
      padding: '32px',
      textAlign: 'center',
      transition: 'all 0.15s ease'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '8px',
        backgroundColor: color + '33',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        border: `2px solid ${color}44`
      }}>
        <Icon size={32} style={{ color }} />
      </div>
      <div style={{
        fontSize: '40px',
        fontWeight: '600',
        color: '#e0e0e0',
        marginBottom: '8px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '14px',
        color: '#a0a0a0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '500'
      }}>
        {label}
      </div>
    </div>
  )
}
