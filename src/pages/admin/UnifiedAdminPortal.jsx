import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import UnrealToolbar from '../../components/UnrealToolbar'
import AdminPortal from './AdminPortal'
import PagesWithHierarchy from './PagesWithHierarchy'
import MediaLibrary from './MediaLibrary'
import AdminEvents from './AdminEvents'
import Sermons from './Sermons'
import Bulletins from './Bulletins'
import SiteSettings from './SiteSettings'
import Documentation from './Documentation'

export default function UnifiedAdminPortal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard')
  const [stats, setStats] = useState({
    images: 0,
    videos: 0,
    documents: 0,
    totalFiles: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Update activeTab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'dashboard'
    setActiveTab(tab)
  }, [searchParams])

  // Load stats on component mount
  useEffect(() => {
    loadStats()
  }, [])

  // Handle tab change with URL update
  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setSearchParams({ tab: newTab })
  }

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

  // Component mapping
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminPortal />
      case 'pages':
        return <PagesWithHierarchy />
      case 'media':
        return <MediaLibrary />
      case 'events':
        return <AdminEvents />
      case 'sermons':
        return <Sermons />
      case 'bulletins':
        return <Bulletins />
      case 'settings':
        return <SiteSettings />
      case 'documentation':
        return <Documentation />
      default:
        return <AdminPortal />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0'
    }}>
      <UnrealToolbar
        stats={stats}
        loadingStats={loadingStats}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Content Area */}
      <div>
        {renderContent()}
      </div>
    </div>
  )
}
