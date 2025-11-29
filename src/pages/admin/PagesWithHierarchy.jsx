import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  IconHome,
  IconMapPin,
  IconInfoCircle,
  IconFile,
  IconChevronRight,
  IconChevronDown,
  IconLayoutNavbar,
  IconLayoutBottombar,
  IconDeviceFloppy,
  IconEdit,
  IconEye,
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconSearch,
  IconX,
  IconSettings,
  IconRefresh,
  IconBoxMultiple
} from '@tabler/icons-react'
import InteractiveViewport from '../../components/InteractiveViewport'
import ComponentToolbox from '../../components/ComponentToolbox'
import UnrealAlertDialog from '../../components/UnrealAlertDialog'
import ResponsivePreview from '../../components/ResponsivePreview'
import GridGuides from '../../components/GridGuides'
import ColorPicker from '../../components/ColorPicker'
import ImageUploadManager from '../../components/ImageUploadManager'
import CSSClassEditor from '../../components/CSSClassEditor'
import PropertiesPanel from '../../components/PropertiesPanel'

export default function PagesWithHierarchy() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState(null)
  const [expandedPages, setExpandedPages] = useState({})
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [isPropertiesPanelCollapsed, setIsPropertiesPanelCollapsed] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState('edit') // 'edit' or 'preview'
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '', type: 'info' })
  const [newPageDialog, setNewPageDialog] = useState({ isOpen: false })
  const [deletePageDialog, setDeletePageDialog] = useState({ isOpen: false, page: null })
  const [draggedPage, setDraggedPage] = useState(null)
  const [hoveredPageId, setHoveredPageId] = useState(null)
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 })
  const [showGridGuides, setShowGridGuides] = useState(false)
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showCSSEditor, setShowCSSEditor] = useState(false)
  const [imageUploaderCallback, setImageUploaderCallback] = useState(null)
  const [pageSearchQuery, setPageSearchQuery] = useState('')

  // Icon mapping for special pages
  const pageIcons = {
    'home': { icon: IconHome, color: '#4a9eff' },
    'visit': { icon: IconMapPin, color: '#4ade80' },
    'about': { icon: IconInfoCircle, color: '#a78bfa' },
    'navbar': { icon: IconLayoutNavbar, color: '#fb923c' },
    'footer': { icon: IconLayoutBottombar, color: '#f472b6' }
  }

  useEffect(() => {
    loadPages()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+' : Toggle grid guides
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault()
        setShowGridGuides(prev => !prev)
      }
      // Ctrl+S : Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && selectedPage) {
        e.preventDefault()
        handleSave()
      }
      // Ctrl+E : Toggle view mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        setViewMode(prev => prev === 'edit' ? 'preview' : 'edit')
      }
      // Delete : Delete selected block
      if (e.key === 'Delete' && selectedBlock && viewMode === 'edit') {
        e.preventDefault()
        if (confirm('Delete this block?')) {
          const updatedBlocks = selectedPage.content.filter(b => b !== selectedBlock)
          handleBlocksChange(updatedBlocks)
          setSelectedBlock(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPage, selectedBlock, viewMode])

  const loadPages = async () => {
    try {
      setLoading(true)

      // Try to load from localStorage first
      const localPages = localStorage.getItem('pages')
      if (localPages) {
        const pagesData = JSON.parse(localPages)
        setPages(pagesData)

        // Auto-expand all pages initially
        const expanded = {}
        pagesData.forEach(page => {
          expanded[page.id] = true
        })
        setExpandedPages(expanded)

        // Auto-select page from URL if 'page' param exists
        const pageSlug = searchParams.get('page')
        if (pageSlug && pagesData.length > 0) {
          const pageToSelect = pagesData.find(p => p.slug === pageSlug)
          if (pageToSelect) {
            loadPageContent(pageToSelect.slug)
          }
        }

        setLoading(false)
        return
      }

      // Fallback to API
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        const pagesData = data.pages || []
        setPages(pagesData)

        // Save to localStorage
        localStorage.setItem('pages', JSON.stringify(pagesData))

        // Auto-expand all pages initially
        const expanded = {}
        pagesData.forEach(page => {
          expanded[page.id] = true
        })
        setExpandedPages(expanded)

        // Auto-select page from URL if 'page' param exists
        const pageSlug = searchParams.get('page')
        if (pageSlug && pagesData.length > 0) {
          const pageToSelect = pagesData.find(p => p.slug === pageSlug)
          if (pageToSelect) {
            loadPageContent(pageToSelect.slug)
          }
        }
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPageContent = async (slug) => {
    try {
      // Try localStorage first
      const localPage = localStorage.getItem(`page_${slug}`)
      if (localPage) {
        const data = JSON.parse(localPage)
        setSelectedPage(data)
        return
      }

      // Fallback to API
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

        // Set show_page_header to false by default if not set
        const show_page_header = data.show_page_header ?? false

        const pageData = { ...data, content, show_page_header }
        setSelectedPage(pageData)

        // Save to localStorage
        localStorage.setItem(`page_${slug}`, JSON.stringify(pageData))
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
    // Update URL to persist selected page
    const currentParams = Object.fromEntries(searchParams.entries())
    setSearchParams({ ...currentParams, page: page.slug })
  }

  const handleBlocksChange = (newBlocks) => {
    setSelectedPage(prev => ({ ...prev, content: newBlocks }))
  }

  const handleBlockSelect = (block, index) => {
    setSelectedBlock({ ...block, index })
  }

  const handleBlockUpdate = (blockIndex, updatedData) => {
    if (!selectedPage || blockIndex === undefined) return
    const newBlocks = [...(selectedPage.content || [])]
    newBlocks[blockIndex] = {
      ...newBlocks[blockIndex],
      data: updatedData
    }
    setSelectedPage(prev => ({ ...prev, content: newBlocks }))
    // Update selectedBlock to reflect changes
    setSelectedBlock({ ...newBlocks[blockIndex], index: blockIndex })
  }

  const handleAddComponent = (newBlock) => {
    if (!selectedPage) return
    const updatedBlocks = [...(selectedPage.content || []), newBlock]
    setSelectedPage(prev => ({ ...prev, content: updatedBlocks }))
  }

  const handleSave = async () => {
    if (!selectedPage) return

    setSaving(true)
    try {
      // Save to localStorage immediately
      localStorage.setItem(`page_${selectedPage.slug}`, JSON.stringify(selectedPage))

      // Try to save to API as well
      const dataToSave = {
        ...selectedPage,
        content: JSON.stringify(selectedPage.content)
      }

      try {
        const response = await fetch(`/api/pages/${selectedPage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave)
        })

        if (response.ok) {
          setAlertDialog({
            isOpen: true,
            title: 'Saved Successfully',
            message: 'Page saved to server and localStorage!',
            type: 'success'
          })
          loadPages() // Refresh the list
        } else {
          const error = await response.json()
          setAlertDialog({
            isOpen: true,
            title: 'Partial Save',
            message: 'Page saved locally. Server save failed: ' + (error.error || 'Unknown error'),
            type: 'warning'
          })
        }
      } catch (apiError) {
        console.error('API save failed, but localStorage succeeded:', apiError)
        setAlertDialog({
          isOpen: true,
          title: 'Saved Locally',
          message: 'Page saved to localStorage! (Server not available)',
          type: 'success'
        })
      }
    } catch (error) {
      console.error('Error saving page:', error)
      setAlertDialog({
        isOpen: true,
        title: 'Save Failed',
        message: 'Failed to save page',
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCreatePage = async (newPageData) => {
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPageData.title,
          slug: newPageData.slug,
          content: JSON.stringify([]),
          show_page_header: false
        })
      })

      if (response.ok) {
        setAlertDialog({
          isOpen: true,
          title: 'Page Created',
          message: 'Page created successfully!',
          type: 'success'
        })
        setNewPageDialog({ isOpen: false })
        loadPages() // Refresh the list
      } else {
        const error = await response.json()
        setAlertDialog({
          isOpen: true,
          title: 'Create Failed',
          message: error.error || 'Failed to create page',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error creating page:', error)
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: 'An error occurred while creating the page',
        type: 'error'
      })
    }
  }

  const handleDeletePage = async (page) => {
    // Prevent deletion of core pages
    const corePages = ['home', 'visit', 'about', 'navbar', 'footer']
    if (corePages.includes(page.slug)) {
      setAlertDialog({
        isOpen: true,
        title: 'Cannot Delete',
        message: 'Core pages cannot be deleted.',
        type: 'warning'
      })
      return
    }

    try {
      const response = await fetch(`/api/pages/${page.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAlertDialog({
          isOpen: true,
          title: 'Page Deleted',
          message: 'Page deleted successfully!',
          type: 'success'
        })
        setDeletePageDialog({ isOpen: false, page: null })

        // If deleted page was selected, clear selection
        if (selectedPage?.id === page.id) {
          setSelectedPage(null)
          const currentParams = Object.fromEntries(searchParams.entries())
          delete currentParams.page
          setSearchParams(currentParams)
        }

        loadPages() // Refresh the list
      } else {
        const error = await response.json()
        setAlertDialog({
          isOpen: true,
          title: 'Delete Failed',
          message: error.error || 'Failed to delete page',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: 'An error occurred while deleting the page',
        type: 'error'
      })
    }
  }

  const handlePageDragStart = (e, page) => {
    setDraggedPage(page)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handlePageDragOver = (e, targetPage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setHoveredPageId(targetPage.id)
  }

  const handlePageDrop = async (e, targetPage) => {
    e.preventDefault()
    setHoveredPageId(null)

    if (!draggedPage || draggedPage.id === targetPage.id) {
      setDraggedPage(null)
      return
    }

    // Reorder pages array
    const newPages = [...pages]
    const draggedIndex = newPages.findIndex(p => p.id === draggedPage.id)
    const targetIndex = newPages.findIndex(p => p.id === targetPage.id)

    newPages.splice(draggedIndex, 1)
    newPages.splice(targetIndex, 0, draggedPage)

    setPages(newPages)
    setDraggedPage(null)

    // TODO: Implement API endpoint to save page order
    // For now, the order will reset on page reload
  }

  const getBlockIcon = (blockType) => {
    // Map block types to icons - you can customize this
    return IconBoxMultiple
  }

  // Filter pages based on search
  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(pageSearchQuery.toLowerCase())
  )

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 40px)',
      backgroundColor: '#0d1117',
      color: '#e6edf3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif'
    }}>
      {/* Left Panel - Page Hierarchy */}
      <div style={{
        width: isPanelCollapsed ? '50px' : '280px',
        backgroundColor: '#161b22',
        borderRight: '1px solid #30363d',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        {/* Panel Header */}
        <div style={{
          height: '56px',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          gap: '12px'
        }}>
          {!isPanelCollapsed && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <IconFile size={18} style={{ color: '#58a6ff' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#e6edf3' }}>Pages</span>
              </div>
              <button
                onClick={() => setNewPageDialog({ isOpen: true })}
                title="Create New Page"
                style={{
                  background: 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)',
                  border: '1px solid rgba(240,246,252,0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #2672f3 0%, #1a63d7 100%)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(31, 111, 235, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <IconPlus size={14} />
                New
              </button>
            </>
          )}
          <button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7d8590',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#30363d'
              e.currentTarget.style.color = '#e6edf3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#7d8590'
            }}
          >
            <IconChevronRight
              size={18}
              style={{
                transform: isPanelCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </button>
        </div>

        {/* Search Bar */}
        {!isPanelCollapsed && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #30363d',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0d1117',
              borderRadius: '6px',
              padding: '8px 12px',
              border: '1px solid #30363d',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
            onFocus={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
            onMouseLeave={(e) => !pageSearchQuery && (e.currentTarget.style.borderColor = '#30363d')}
            onBlur={(e) => !pageSearchQuery && (e.currentTarget.style.borderColor = '#30363d')}
            >
              <IconSearch size={16} style={{ color: '#7d8590', marginRight: '8px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search pages..."
                value={pageSearchQuery}
                onChange={(e) => setPageSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e6edf3',
                  fontSize: '13px',
                  minWidth: 0
                }}
              />
              {pageSearchQuery && (
                <IconX
                  size={16}
                  style={{ color: '#7d8590', cursor: 'pointer', flexShrink: 0, marginLeft: '8px' }}
                  onClick={() => setPageSearchQuery('')}
                />
              )}
            </div>
          </div>
        )}

        {/* Panel Content */}
        {!isPanelCollapsed && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px'
          }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#7d8590' }}>
                <div className="spinner-border spinner-border-sm" style={{ color: '#58a6ff' }} />
                <p style={{ marginTop: '12px', fontSize: '13px' }}>Loading pages...</p>
              </div>
            ) : filteredPages.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#7d8590' }}>
                <IconFile size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '13px' }}>
                  {pageSearchQuery ? 'No pages found' : 'No pages yet'}
                </p>
              </div>
            ) : (
              filteredPages.map((page) => {
                const iconConfig = pageIcons[page.slug] || { icon: IconFile, color: '#7d8590' }
                const Icon = iconConfig.icon
                const isExpanded = expandedPages[page.id]
                const isSelected = selectedPage?.id === page.id
                const isCorePages = ['home', 'visit', 'about', 'navbar', 'footer'].includes(page.slug)

                return (
                  <div
                    key={page.id}
                    style={{ marginBottom: '4px', position: 'relative' }}
                    draggable
                    onDragStart={(e) => handlePageDragStart(e, page)}
                    onDragOver={(e) => handlePageDragOver(e, page)}
                    onDrop={(e) => handlePageDrop(e, page)}
                    onDragEnd={() => setHoveredPageId(null)}
                  >
                    {/* Page Item */}
                    <div
                      onClick={() => handlePageSelect(page)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                        border: hoveredPageId === page.id ? '2px solid #58a6ff' : '2px solid transparent',
                        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'rgba(110, 118, 129, 0.1)')}
                      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '3px',
                          height: '20px',
                          backgroundColor: '#58a6ff',
                          borderRadius: '0 3px 3px 0'
                        }} />
                      )}

                      {/* Drag Handle */}
                      <div
                        style={{
                          cursor: 'grab',
                          color: '#7d8590',
                          marginRight: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          opacity: 0.5
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                      >
                        <IconGripVertical size={14} />
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePageExpansion(page.id)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#7d8590',
                          cursor: 'pointer',
                          padding: '0 4px',
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '8px'
                        }}
                      >
                        {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                      </button>

                      <Icon size={16} style={{ color: iconConfig.color, marginRight: '10px' }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: isSelected ? '600' : '500',
                          color: isSelected ? '#e6edf3' : '#c9d1d9',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {page.title}
                        </div>
                        {isCorePages && (
                          <div style={{
                            fontSize: '10px',
                            color: '#7d8590',
                            marginTop: '2px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Core
                          </div>
                        )}
                      </div>

                      {/* Delete Button - Only for non-core pages */}
                      {!isCorePages && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeletePageDialog({ isOpen: true, page })
                          }}
                          title="Delete Page"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f85149',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0,
                            borderRadius: '4px',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1'
                            e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0'
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <IconTrash size={14} />
                        </button>
                      )}
                    </div>

                    {/* Page Components/Blocks (when expanded) */}
                    {isExpanded && selectedPage?.id === page.id && selectedPage.content && selectedPage.content.length > 0 && (
                      <div style={{ marginLeft: '32px', marginTop: '4px' }}>
                        {selectedPage.content.map((block, index) => {
                          const BlockIcon = getBlockIcon(block.type)
                          const isBlockSelected = selectedBlock === block
                          return (
                            <div
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBlockSelect(block)
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 10px',
                                fontSize: '12px',
                                color: isBlockSelected ? '#e6edf3' : '#7d8590',
                                backgroundColor: isBlockSelected ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                borderRadius: '6px',
                                marginBottom: '2px',
                                cursor: 'pointer',
                                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderLeft: isBlockSelected ? '2px solid #58a6ff' : '2px solid transparent'
                              }}
                              onMouseEnter={(e) => !isBlockSelected && (e.currentTarget.style.backgroundColor = 'rgba(110, 118, 129, 0.08)')}
                              onMouseLeave={(e) => !isBlockSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <BlockIcon size={14} style={{ marginRight: '8px', flexShrink: 0 }} />
                              <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: isBlockSelected ? '500' : '400'
                              }}>
                                {block.type || 'Block'} {index + 1}
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
        backgroundColor: '#0d1117'
      }}>
        {selectedPage ? (
          <>
            {/* Editor Toolbar */}
            <div style={{
              height: '56px',
              backgroundColor: '#161b22',
              borderBottom: '1px solid #30363d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              flexShrink: 0,
              gap: '20px'
            }}>
              {/* Left: Page Info */}
              <div style={{ flex: '0 1 auto', minWidth: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#e6edf3' }}>{selectedPage.title}</span>
                <span style={{
                  fontSize: '11px',
                  color: '#7d8590',
                  backgroundColor: '#21262d',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
                }}>
                  /{selectedPage.slug}
                </span>
              </div>

              {/* Center: Mode Switcher and Responsive Preview */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: '1 1 auto',
                justifyContent: 'center',
                minWidth: 0
              }}>
                <div style={{
                  display: 'flex',
                  backgroundColor: '#0d1117',
                  borderRadius: '6px',
                  padding: '3px',
                  border: '1px solid #30363d'
                }}>
                  <button
                    onClick={() => setViewMode('edit')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      backgroundColor: viewMode === 'edit' ? '#58a6ff' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: viewMode === 'edit' ? '#ffffff' : '#7d8590',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => viewMode !== 'edit' && (e.currentTarget.style.backgroundColor = 'rgba(110, 118, 129, 0.1)')}
                    onMouseLeave={(e) => viewMode !== 'edit' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <IconEdit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      backgroundColor: viewMode === 'preview' ? '#58a6ff' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: viewMode === 'preview' ? '#ffffff' : '#7d8590',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => viewMode !== 'preview' && (e.currentTarget.style.backgroundColor = 'rgba(110, 118, 129, 0.1)')}
                    onMouseLeave={(e) => viewMode !== 'preview' && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <IconEye size={14} />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Responsive Preview Controls */}
                <ResponsivePreview
                  viewportSize={viewportSize}
                  onViewportChange={setViewportSize}
                />
              </div>

              {/* Right: Actions */}
              <div style={{ flex: '0 0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Keyboard Shortcuts Hint */}
                <div style={{
                  fontSize: '10px',
                  color: '#7d8590',
                  display: 'flex',
                  gap: '12px',
                  padding: '6px 12px',
                  backgroundColor: '#0d1117',
                  borderRadius: '6px',
                  border: '1px solid #30363d'
                }}>
                  <span title="Toggle view mode">⌘E</span>
                  <span title="Save">⌘S</span>
                  <span title="Toggle grid">⌘'</span>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: saving ? '#30363d' : 'linear-gradient(180deg, #238636 0%, #196c2e 100%)',
                    border: '1px solid rgba(240,246,252,0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => !saving && (e.target.style.background = 'linear-gradient(180deg, #2ea043 0%, #1e7e34 100)')}
                  onMouseLeave={(e) => !saving && (e.target.style.background = 'linear-gradient(180deg, #238636 0%, #196c2e 100%)')}
                >
                  {saving ? (
                    <>
                      <div className="spinner-border spinner-border-sm" />
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
            </div>

            {/* Viewport Area with Toolbox */}
            <div style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden'
            }}>
              {/* Component Toolbox - Only show in Edit mode */}
              {viewMode === 'edit' && (
                <ComponentToolbox onAddComponent={handleAddComponent} />
              )}

              {/* Interactive Viewport */}
              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '32px',
                backgroundColor: '#0d1117',
                position: 'relative'
              }}>
                {/* Grid Guides Overlay */}
                {showGridGuides && viewMode === 'edit' && (
                  <GridGuides
                    viewportSize={viewportSize}
                    onToggle={() => setShowGridGuides(false)}
                  />
                )}

                <div style={{
                  width: viewportSize.width + 'px',
                  minHeight: viewportSize.height + 'px',
                  margin: '0 auto',
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 0 1px rgba(240,246,252,0.1), 0 16px 32px rgba(1,4,9,0.85)'
                }}>
                  <InteractiveViewport
                    blocks={selectedPage.content || []}
                    onBlocksChange={handleBlocksChange}
                    onBlockSelect={handleBlockSelect}
                    viewMode={viewMode}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7d8590',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <IconFile size={64} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: '500' }}>Select a page to start editing</p>
            <button
              onClick={() => setNewPageDialog({ isOpen: true })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)',
                border: '1px solid rgba(240,246,252,0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(180deg, #2672f3 0%, #1a63d7 100%)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)'}
            >
              <IconPlus size={16} />
              Create New Page
            </button>
          </div>
        )}
      </div>

      {/* Right Panel - Properties (now using the fixed PropertiesPanel component) */}
      {/* Note: The Inspector panel was removed in favor of the floating PropertiesPanel */}

      {/* Alert Dialog */}
      <UnrealAlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        confirmText="OK"
      />

      {/* New Page Dialog */}
      <NewPageDialog
        isOpen={newPageDialog.isOpen}
        onClose={() => setNewPageDialog({ isOpen: false })}
        onConfirm={handleCreatePage}
      />

      {/* Delete Page Confirmation Dialog */}
      <UnrealAlertDialog
        isOpen={deletePageDialog.isOpen}
        onClose={() => setDeletePageDialog({ isOpen: false, page: null })}
        onConfirm={() => handleDeletePage(deletePageDialog.page)}
        title="Delete Page"
        message={`Are you sure you want to delete "${deletePageDialog.page?.title}"? This action cannot be undone.`}
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
      />

      {/* Image Upload Manager Modal */}
      {showImageUploader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(1, 4, 9, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <ImageUploadManager
              onSelect={(url) => {
                if (imageUploaderCallback) {
                  imageUploaderCallback(url)
                }
                setShowImageUploader(false)
                setImageUploaderCallback(null)
              }}
              onClose={() => {
                setShowImageUploader(false)
                setImageUploaderCallback(null)
              }}
            />
          </div>
        </div>
      )}

      {/* CSS Class Editor Modal */}
      {showCSSEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(1, 4, 9, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', width: '800px' }}>
            <CSSClassEditor
              block={selectedBlock}
              onChange={(updatedBlock) => {
                const updatedBlocks = selectedPage.content.map(b =>
                  b === selectedBlock ? updatedBlock : b
                )
                handleBlocksChange(updatedBlocks)
                setSelectedBlock(updatedBlock)
              }}
              onClose={() => setShowCSSEditor(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Properties Panel - Draggable */}
      <PropertiesPanel
        block={selectedBlock}
        blockIndex={selectedBlock?.index}
        onUpdate={handleBlockUpdate}
        isVisible={selectedBlock && selectedBlock.index !== undefined && viewMode === 'edit'}
      />
    </div>
  )
}

// New Page Dialog Component
function NewPageDialog({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({ title: '', slug: '' })

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!formData.title || !formData.slug) {
      alert('Please fill in all fields')
      return
    }
    onConfirm(formData)
    setFormData({ title: '', slug: '' })
  }

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(1, 4, 9, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }}
      >
        {/* Dialog */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '12px',
            boxShadow: '0 16px 70px rgba(1, 4, 9, 0.9)',
            width: '480px',
            maxWidth: '90vw',
            overflow: 'hidden',
            animation: 'slideIn 0.2s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '24px 24px 20px 24px',
              borderBottom: '1px solid #30363d'
            }}
          >
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#e6edf3'
            }}>
              Create New Page
            </h2>
          </div>

          {/* Body */}
          <div style={{
            padding: '24px',
            color: '#c9d1d9'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#c9d1d9',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Page Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter page title"
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#e6edf3',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#c9d1d9',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Page Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="page-slug"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#e6edf3',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  transition: 'all 0.15s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
              <div style={{
                fontSize: '11px',
                color: '#7d8590',
                marginTop: '6px',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace'
              }}>
                URL: /{formData.slug || 'page-slug'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid #30363d',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                backgroundColor: '#21262d',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#e6edf3',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#30363d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#21262d'}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)',
                border: '1px solid rgba(240,246,252,0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(180deg, #2672f3 0%, #1a63d7 100%)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(180deg, #1f6feb 0%, #1158c7 100%)'}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
