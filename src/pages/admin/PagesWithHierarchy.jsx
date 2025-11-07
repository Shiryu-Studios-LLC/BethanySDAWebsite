import { useState, useEffect } from 'react'
import {
  IconHome,
  IconMapPin,
  IconInfoCircle,
  IconFile,
  IconChevronRight,
  IconChevronDown,
  IconLayoutNavbar,
  IconLayoutBottombar
} from '@tabler/icons-react'

export default function PagesWithHierarchy() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState(null)
  const [expandedPages, setExpandedPages] = useState({})
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  // Icon mapping for special pages
  const pageIcons = {
    'home': { icon: IconHome, color: '#4a7ba7' },
    'visit': { icon: IconMapPin, color: '#5a9b5a' },
    'about': { icon: IconInfoCircle, color: '#7b8ba7' },
    'navbar': { icon: IconLayoutNavbar, color: '#6a9ba7' },
    'footer': { icon: IconLayoutBottombar, color: '#8a7ba7' }
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
        const pagesData = data.pages || []
        setPages(pagesData)

        // Auto-expand all pages initially
        const expanded = {}
        pagesData.forEach(page => {
          expanded[page.id] = true
        })
        setExpandedPages(expanded)
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPageContent = async (slug) => {
    try {
      const response = await fetch(`/api/pages/${slug}`)
      if (response.ok) {
        const data = await response.json()

        // Parse content from JSON string to blocks array
        let content = []
        if (data.content) {
          try {
            content = JSON.parse(data.content)
            if (!Array.isArray(content)) {
              content = []
            }
          } catch (e) {
            console.warn('Failed to parse content as JSON, using empty array')
            content = []
          }
        }

        setSelectedPage({ ...data, content })
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  const togglePageExpansion = (pageId) => {
    setExpandedPages(prev => ({
      ...prev,
      [pageId]: !prev[pageId]
    }))
  }

  const handlePageSelect = (page) => {
    loadPageContent(page.slug)
  }

  const getBlockIcon = (blockType) => {
    // Map block types to icons - you can customize this
    return IconFile
  }

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 40px)', // Full height minus toolbar
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0'
    }}>
      {/* Left Panel - Hierarchy */}
      <div style={{
        width: isPanelCollapsed ? '50px' : '300px',
        backgroundColor: '#252525',
        borderRight: '1px solid #3a3a3a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Panel Header */}
        <div style={{
          height: '48px',
          borderBottom: '1px solid #3a3a3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0
        }}>
          {!isPanelCollapsed && (
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Page Hierarchy</span>
          )}
          <button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#a0a0a0',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <IconChevronRight
              size={18}
              style={{
                transform: isPanelCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </button>
        </div>

        {/* Panel Content */}
        {!isPanelCollapsed && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px'
          }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#a0a0a0' }}>
                Loading pages...
              </div>
            ) : (
              pages.map((page) => {
                const iconConfig = pageIcons[page.slug] || { icon: IconFile, color: '#6a6a6a' }
                const Icon = iconConfig.icon
                const isExpanded = expandedPages[page.id]
                const isSelected = selectedPage?.id === page.id
                const isCorePages = ['home', 'visit', 'about', 'navbar', 'footer'].includes(page.slug)

                return (
                  <div key={page.id} style={{ marginBottom: '4px' }}>
                    {/* Page Item */}
                    <div
                      onClick={() => handlePageSelect(page)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#3a3a3a' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#2d2d2d')}
                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePageExpansion(page.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#a0a0a0',
                          cursor: 'pointer',
                          padding: '0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '4px'
                        }}
                      >
                        {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                      </button>

                      <Icon size={16} style={{ color: iconConfig.color, marginRight: '8px' }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '400',
                          color: isSelected ? '#ffffff' : '#e0e0e0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {page.title}
                        </div>
                        {isCorePages && (
                          <div style={{
                            fontSize: '10px',
                            color: '#7a7a7a',
                            marginTop: '2px'
                          }}>
                            Core Page
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Page Content/Blocks (when expanded) */}
                    {isExpanded && selectedPage?.id === page.id && selectedPage.content && (
                      <div style={{ marginLeft: '24px', marginTop: '4px' }}>
                        {selectedPage.content.map((block, index) => {
                          const BlockIcon = getBlockIcon(block.type)
                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 8px',
                                fontSize: '12px',
                                color: '#a0a0a0',
                                borderRadius: '3px',
                                marginBottom: '2px'
                              }}
                            >
                              <BlockIcon size={14} style={{ marginRight: '6px' }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {block.type || 'Block'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {selectedPage ? (
          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{selectedPage.title}</h2>
            <p style={{ color: '#a0a0a0', margin: '0 0 24px 0' }}>/{selectedPage.slug}</p>

            <div style={{
              backgroundColor: '#252525',
              border: '1px solid #3a3a3a',
              borderRadius: '4px',
              padding: '20px'
            }}>
              <p style={{ color: '#a0a0a0' }}>
                Page editor content will go here. This will include the block editor interface.
              </p>
              <p style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '12px' }}>
                Blocks: {selectedPage.content?.length || 0}
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a0a0a0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <IconFile size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>Select a page from the hierarchy to edit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
