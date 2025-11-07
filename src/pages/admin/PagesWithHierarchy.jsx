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
  IconGripVertical
} from '@tabler/icons-react'
import InteractiveViewport from '../../components/InteractiveViewport'
import ComponentToolbox from '../../components/ComponentToolbox'
import UnrealAlertDialog from '../../components/UnrealAlertDialog'

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

        setSelectedPage({ ...data, content, show_page_header })
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

  const handleBlockSelect = (block) => {
    setSelectedBlock(block)
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
        setAlertDialog({
          isOpen: true,
          title: 'Success',
          message: 'Page saved successfully!',
          type: 'success'
        })
        loadPages() // Refresh the list
      } else {
        const error = await response.json()
        setAlertDialog({
          isOpen: true,
          title: 'Save Failed',
          message: error.error || 'Failed to save page',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving page:', error)
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: 'An error occurred while saving the page',
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
          title: 'Success',
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
          title: 'Success',
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
          flexShrink: 0,
          gap: '8px'
        }}>
          {!isPanelCollapsed && (
            <>
              <span style={{ fontSize: '13px', fontWeight: '600', flex: 1 }}>Page Hierarchy</span>
              <button
                onClick={() => setNewPageDialog({ isOpen: true })}
                title="Create New Page"
                style={{
                  background: '#4a7ba7',
                  border: '1px solid #5a8bb7',
                  borderRadius: '3px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '11px',
                  fontWeight: '500',
                  gap: '4px'
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
                        padding: '8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#3a3a3a' : 'transparent',
                        border: hoveredPageId === page.id ? '2px solid #4a7ba7' : '2px solid transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#2d2d2d')}
                      onMouseOut={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Drag Handle */}
                      <div
                        style={{
                          cursor: 'grab',
                          color: '#7a7a7a',
                          marginRight: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                        onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
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

                      {/* Delete Button - Only for non-core pages */}
                      {!isCorePages && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeletePageDialog({ isOpen: true, page })
                          }}
                          title="Delete Page"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.7
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                        >
                          <IconTrash size={14} />
                        </button>
                      )}
                    </div>

                    {/* Page Components/Blocks (when expanded) */}
                    {isExpanded && selectedPage?.id === page.id && selectedPage.content && selectedPage.content.length > 0 && (
                      <div style={{ marginLeft: '24px', marginTop: '4px' }}>
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
                                padding: '6px 8px',
                                fontSize: '12px',
                                color: isBlockSelected ? '#ffffff' : '#a0a0a0',
                                backgroundColor: isBlockSelected ? '#3a3a3a' : 'transparent',
                                borderRadius: '3px',
                                marginBottom: '2px',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseOver={(e) => !isBlockSelected && (e.currentTarget.style.backgroundColor = '#2d2d2d')}
                              onMouseOut={(e) => !isBlockSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <BlockIcon size={14} style={{ marginRight: '6px' }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              {/* Left: Page Info */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedPage.title}</span>
                <span style={{ fontSize: '12px', color: '#7a7a7a', marginLeft: '12px' }}>
                  /{selectedPage.slug}
                </span>
              </div>

              {/* Center: Mode Switcher */}
              <div style={{
                display: 'flex',
                backgroundColor: '#1e1e1e',
                borderRadius: '4px',
                padding: '2px',
                border: '1px solid #3a3a3a'
              }}>
                <button
                  onClick={() => setViewMode('edit')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 16px',
                    backgroundColor: viewMode === 'edit' ? '#4a7ba7' : 'transparent',
                    border: 'none',
                    borderRadius: '3px',
                    color: viewMode === 'edit' ? '#ffffff' : '#a0a0a0',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
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
                    backgroundColor: viewMode === 'preview' ? '#4a7ba7' : 'transparent',
                    border: 'none',
                    borderRadius: '3px',
                    color: viewMode === 'preview' ? '#ffffff' : '#a0a0a0',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <IconEye size={14} />
                  <span>Preview</span>
                </button>
              </div>

              {/* Right: Save Button */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
                padding: '24px',
                backgroundColor: '#1a1a1a'
              }}>
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto'
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
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Inspector</span>
          )}
        </div>

        {/* Panel Content */}
        {!isPropertiesPanelCollapsed && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px'
          }}>
            {selectedPage ? (
              <div>
                {/* Page Component - Always shown */}
                <InspectorComponent
                  title="Page"
                  icon={pageIcons[selectedPage.slug]?.icon || IconFile}
                  color={pageIcons[selectedPage.slug]?.color || '#6a6a6a'}
                  defaultExpanded={false}
                >
                  <PropertyField
                    label="Title"
                    value={selectedPage.title}
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, title: value }))}
                  />
                  <PropertyField
                    label="Slug"
                    value={selectedPage.slug}
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, slug: value }))}
                  />
                  <PropertyField
                    label="Status"
                    value={selectedPage.is_published}
                    type="boolean"
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, is_published: value }))}
                  />
                  <PropertyField
                    label="Show in Nav"
                    value={selectedPage.show_in_nav}
                    type="boolean"
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, show_in_nav: value }))}
                  />
                  <PropertyField
                    label="Show Header"
                    value={selectedPage.show_page_header}
                    type="boolean"
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, show_page_header: value }))}
                  />
                  <PropertyField
                    label="Nav Order"
                    value={selectedPage.nav_order}
                    type="number"
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, nav_order: parseInt(value) || 0 }))}
                  />
                  <PropertyField label="Page ID" value={selectedPage.id} readOnly />
                  <PropertyField
                    label="Description"
                    value={selectedPage.meta_description || ''}
                    multiline
                    editable
                    onChange={(value) => setSelectedPage(prev => ({ ...prev, meta_description: value }))}
                  />
                </InspectorComponent>

                {/* Block Component - Only shown when a block is selected */}
                {selectedBlock && (
                  <InspectorComponent
                    title={selectedBlock.type || 'Block'}
                    icon={getBlockIcon(selectedBlock.type)}
                    color="#4a7ba7"
                    defaultExpanded={false}
                  >
                    <PropertyField
                      label="Type"
                      value={selectedBlock.type}
                      editable
                      onChange={(value) => {
                        const updatedBlocks = selectedPage.content.map(block =>
                          block === selectedBlock ? { ...block, type: value } : block
                        )
                        handleBlocksChange(updatedBlocks)
                        setSelectedBlock({ ...selectedBlock, type: value })
                      }}
                    />
                    {selectedBlock.data && Object.keys(selectedBlock.data).length > 0 && (
                      <>
                        {Object.entries(selectedBlock.data).map(([key, value]) => (
                          <PropertyField
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={typeof value === 'string' ? value : JSON.stringify(value)}
                            multiline={typeof value === 'string' && value.length > 50}
                            editable
                            onChange={(newValue) => {
                              const updatedData = { ...selectedBlock.data, [key]: newValue }
                              const updatedBlock = { ...selectedBlock, data: updatedData }
                              const updatedBlocks = selectedPage.content.map(block =>
                                block === selectedBlock ? updatedBlock : block
                              )
                              handleBlocksChange(updatedBlocks)
                              setSelectedBlock(updatedBlock)
                            }}
                          />
                        ))}
                      </>
                    )}
                    {selectedBlock.hidden !== undefined && (
                      <PropertyField
                        label="Hidden"
                        value={selectedBlock.hidden}
                        type="boolean"
                        editable
                        onChange={(value) => {
                          const updatedBlock = { ...selectedBlock, hidden: value }
                          const updatedBlocks = selectedPage.content.map(block =>
                            block === selectedBlock ? updatedBlock : block
                          )
                          handleBlocksChange(updatedBlocks)
                          setSelectedBlock(updatedBlock)
                        }}
                      />
                    )}
                  </InspectorComponent>
                )}
              </div>
            ) : (
              <div style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ fontSize: '12px' }}>Select a page or component to view properties</p>
              </div>
            )}
          </div>
        )}
      </div>

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
    </div>
  )
}

// Unity-style Inspector Component Block
function InspectorComponent({ title, icon: Icon, color, defaultExpanded = true, children }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div style={{
      marginBottom: '8px',
      backgroundColor: '#2a2a2a',
      border: '1px solid #3a3a3a',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      {/* Component Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 10px',
          backgroundColor: '#2d2d2d',
          cursor: 'pointer',
          borderBottom: isExpanded ? '1px solid #3a3a3a' : 'none',
          transition: 'background-color 0.15s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#353535'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2d2d2d'}
      >
        <IconChevronRight
          size={14}
          style={{
            color: '#a0a0a0',
            marginRight: '6px',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
        <Icon size={16} style={{ color, marginRight: '8px' }} />
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#e0e0e0',
          flex: 1
        }}>
          {title}
        </span>
      </div>

      {/* Component Content */}
      {isExpanded && (
        <div style={{ padding: '12px 10px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Property Field Component
function PropertyField({ label, value, multiline = false, editable = false, readOnly = false, type = 'text', onChange }) {
  if (readOnly || !editable) {
    // Read-only display
    return (
      <div style={{ marginBottom: '10px' }}>
        <div style={{
          fontSize: '10px',
          color: '#8a8a8a',
          marginBottom: '4px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '11px',
          color: '#d0d0d0',
          backgroundColor: '#1e1e1e',
          padding: '6px 8px',
          borderRadius: '2px',
          border: '1px solid #3a3a3a',
          wordWrap: multiline ? 'break-word' : 'normal',
          whiteSpace: multiline ? 'normal' : 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.4'
        }}>
          {value || '-'}
        </div>
      </div>
    )
  }

  // Editable field
  if (type === 'boolean') {
    return (
      <div style={{ marginBottom: '10px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: '8px'
        }}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange?.(e.target.checked)}
            style={{
              width: '14px',
              height: '14px',
              cursor: 'pointer'
            }}
          />
          <span style={{
            fontSize: '10px',
            color: '#8a8a8a',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {label}
          </span>
        </label>
      </div>
    )
  }

  const InputComponent = multiline ? 'textarea' : 'input'

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        fontSize: '10px',
        color: '#8a8a8a',
        marginBottom: '4px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.3px'
      }}>
        {label}
      </div>
      <InputComponent
        type={type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          width: '100%',
          fontSize: '11px',
          color: '#d0d0d0',
          backgroundColor: '#1e1e1e',
          padding: '6px 8px',
          borderRadius: '2px',
          border: '1px solid #3a3a3a',
          fontFamily: 'inherit',
          lineHeight: '1.4',
          resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? '60px' : 'auto'
        }}
        onFocus={(e) => e.target.style.borderColor = '#4a7ba7'}
        onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
            backgroundColor: '#2d2d2d',
            border: '1px solid #4a4a4a',
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            width: '480px',
            maxWidth: '90vw',
            overflow: 'hidden',
            animation: 'slideIn 0.2s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #3a3a3a',
              backgroundColor: '#252525'
            }}
          >
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#e0e0e0'
            }}>
              Create New Page
            </h2>
          </div>

          {/* Body */}
          <div style={{
            padding: '24px',
            color: '#c0c0c0',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#a0a0a0',
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
                  padding: '8px 12px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3a3a3a',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#a0a0a0',
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
                  padding: '8px 12px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3a3a3a',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: '#7a7a7a',
                marginTop: '4px'
              }}>
                URL: /{formData.slug || 'page-slug'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #3a3a3a',
              backgroundColor: '#252525',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                backgroundColor: '#3a3a3a',
                border: '1px solid #4a4a4a',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4a4a4a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3a3a3a'}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '8px 20px',
                backgroundColor: '#4a7ba7',
                border: '1px solid #5a8bb7',
                borderRadius: '3px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a8bb7'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4a7ba7'}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
