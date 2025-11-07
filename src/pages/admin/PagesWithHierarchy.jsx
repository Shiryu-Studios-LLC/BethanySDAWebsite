import { useState, useEffect } from 'react'
import {
  IconHome,
  IconMapPin,
  IconInfoCircle,
  IconFile,
  IconChevronRight,
  IconChevronDown,
  IconLayoutNavbar,
  IconLayoutBottombar,
  IconDeviceFloppy
} from '@tabler/icons-react'
import UnityEditor from '../../components/BlockEditor/UnityEditor'

export default function PagesWithHierarchy() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState(null)
  const [expandedPages, setExpandedPages] = useState({})
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [isPropertiesPanelCollapsed, setIsPropertiesPanelCollapsed] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [saving, setSaving] = useState(false)

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

  const handleBlocksChange = (newBlocks) => {
    setSelectedPage(prev => ({ ...prev, content: newBlocks }))
  }

  const handleSave = async () => {
    if (!selectedPage) return

    setSaving(true)
    try {
      const dataToSave = {
        ...selectedPage,
        content: JSON.stringify(selectedPage.content)
      }

      const response = await fetch(`/api/pages/${selectedPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      })

      if (response.ok) {
        alert('Page saved successfully!')
        loadPages() // Refresh the list
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save page')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page')
    } finally {
      setSaving(false)
    }
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
        overflow: 'hidden',
        backgroundColor: '#1a1a1a'
      }}>
        {selectedPage ? (
          <>
            {/* Editor Toolbar */}
            <div style={{
              height: '48px',
              backgroundColor: '#252525',
              borderBottom: '1px solid #3a3a3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              flexShrink: 0
            }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedPage.title}</span>
                <span style={{ fontSize: '12px', color: '#7a7a7a', marginLeft: '12px' }}>
                  /{selectedPage.slug}
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  backgroundColor: '#4a7ba7',
                  border: '1px solid #5a8bb7',
                  borderRadius: '3px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = '#5a8bb7')}
                onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = '#4a7ba7')}
              >
                {saving ? (
                  <>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>

            {/* Unity Editor */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <UnityEditor
                blocks={selectedPage.content || []}
                onChange={handleBlocksChange}
                pageTitle={selectedPage.title}
                pageSubtitle={selectedPage.meta_description}
                showPageHeader={selectedPage.show_page_header}
                pageSlug={selectedPage.slug}
              />
            </div>
          </>
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

      {/* Right Panel - Properties */}
      <div style={{
        width: isPropertiesPanelCollapsed ? '50px' : '320px',
        backgroundColor: '#252525',
        borderLeft: '1px solid #3a3a3a',
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
          <button
            onClick={() => setIsPropertiesPanelCollapsed(!isPropertiesPanelCollapsed)}
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
                transform: isPropertiesPanelCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            />
          </button>
          {!isPropertiesPanelCollapsed && (
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Properties</span>
          )}
        </div>

        {/* Panel Content */}
        {!isPropertiesPanelCollapsed && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px'
          }}>
            {selectedPage ? (
              <div>
                {/* Page Properties */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#a0a0a0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}>
                    Page Settings
                  </h3>

                  <PropertyField label="Title" value={selectedPage.title} />
                  <PropertyField label="Slug" value={selectedPage.slug} />
                  <PropertyField label="Status" value={selectedPage.is_published ? 'Published' : 'Draft'} />
                  <PropertyField label="Show in Nav" value={selectedPage.show_in_nav ? 'Yes' : 'No'} />
                  <PropertyField label="Show Header" value={selectedPage.show_page_header ? 'Yes' : 'No'} />
                  <PropertyField label="Nav Order" value={selectedPage.nav_order} />
                </div>

                {/* Block Properties (if a block is selected) */}
                {selectedBlock && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#a0a0a0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '12px'
                    }}>
                      Block Settings
                    </h3>

                    <PropertyField label="Type" value={selectedBlock.type} />
                    {selectedBlock.content && (
                      <PropertyField label="Content" value={selectedBlock.content.substring(0, 50) + '...'} />
                    )}
                  </div>
                )}

                {/* Meta Information */}
                <div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#a0a0a0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}>
                    Meta Data
                  </h3>

                  <PropertyField label="Page ID" value={selectedPage.id} />
                  <PropertyField label="Blocks" value={selectedPage.content?.length || 0} />
                  {selectedPage.meta_description && (
                    <PropertyField label="Description" value={selectedPage.meta_description.substring(0, 50) + '...'} multiline />
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ fontSize: '12px' }}>Select a page or block to view properties</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Property Field Component
function PropertyField({ label, value, multiline = false }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{
        fontSize: '11px',
        color: '#7a7a7a',
        marginBottom: '4px',
        fontWeight: '500'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#e0e0e0',
        backgroundColor: '#1a1a1a',
        padding: '8px',
        borderRadius: '3px',
        border: '1px solid #3a3a3a',
        wordWrap: multiline ? 'break-word' : 'normal',
        whiteSpace: multiline ? 'normal' : 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {value || '-'}
      </div>
    </div>
  )
}
