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
  IconBoxMultiple,
  IconCursor,
  IconHandMove,
  IconZoomIn,
  IconZoomOut,
  IconSquare,
  IconCircle,
  IconPhoto,
  IconTextSize,
  IconColumns,
  IconMenu2,
  IconFolderOpen,
  IconDownload,
  IconArrowBack,
  IconArrowForward,
  IconEyeOff,
  IconLock,
  IconCopy
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
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState('edit')
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
  const [activeTool, setActiveTool] = useState('cursor')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [activeRightPanel, setActiveRightPanel] = useState('layers')

  // Icon mapping for special pages
  const pageIcons = {
    'home': { icon: IconHome, color: '#6ab7ff' },
    'visit': { icon: IconMapPin, color: '#87d068' },
    'about': { icon: IconInfoCircle, color: '#d3adf7' },
    'navbar': { icon: IconLayoutNavbar, color: '#ffa940' },
    'footer': { icon: IconLayoutBottombar, color: '#ff85c0' }
  }

  useEffect(() => {
    loadPages()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault()
        setShowGridGuides(prev => !prev)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && selectedPage) {
        e.preventDefault()
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        setViewMode(prev => prev === 'edit' ? 'preview' : 'edit')
      }
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
      const localPages = localStorage.getItem('pages')
      if (localPages) {
        const pagesData = JSON.parse(localPages)
        setPages(pagesData)
        const expanded = {}
        pagesData.forEach(page => {
          expanded[page.id] = true
        })
        setExpandedPages(expanded)
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

      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        const pagesData = data.pages || []
        setPages(pagesData)
        localStorage.setItem('pages', JSON.stringify(pagesData))
        const expanded = {}
        pagesData.forEach(page => {
          expanded[page.id] = true
        })
        setExpandedPages(expanded)
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
      const localPage = localStorage.getItem(`page_${slug}`)
      if (localPage) {
        const data = JSON.parse(localPage)
        setSelectedPage(data)
        return
      }

      const response = await fetch(`/api/pages/${slug}`)
      if (response.ok) {
        const data = await response.json()
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
        const show_page_header = data.show_page_header ?? false
        const pageData = { ...data, content, show_page_header }
        setSelectedPage(pageData)
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
      localStorage.setItem(`page_${selectedPage.slug}`, JSON.stringify(selectedPage))
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
            title: 'Saved',
            message: 'Page saved successfully!',
            type: 'success'
          })
          loadPages()
        } else {
          const error = await response.json()
          setAlertDialog({
            isOpen: true,
            title: 'Partial Save',
            message: 'Saved locally. Server error: ' + (error.error || 'Unknown'),
            type: 'warning'
          })
        }
      } catch (apiError) {
        console.error('API save failed:', apiError)
        setAlertDialog({
          isOpen: true,
          title: 'Saved Locally',
          message: 'Page saved locally!',
          type: 'success'
        })
      }
    } catch (error) {
      console.error('Error saving:', error)
      setAlertDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save',
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
        setAlertDialog({ isOpen: true, title: 'Created', message: 'Page created!', type: 'success' })
        setNewPageDialog({ isOpen: false })
        loadPages()
      } else {
        const error = await response.json()
        setAlertDialog({ isOpen: true, title: 'Error', message: error.error || 'Failed to create', type: 'error' })
      }
    } catch (error) {
      console.error('Error creating:', error)
      setAlertDialog({ isOpen: true, title: 'Error', message: 'Failed to create page', type: 'error' })
    }
  }

  const handleDeletePage = async (page) => {
    const corePages = ['home', 'visit', 'about', 'navbar', 'footer']
    if (corePages.includes(page.slug)) {
      setAlertDialog({ isOpen: true, title: 'Cannot Delete', message: 'Core pages cannot be deleted.', type: 'warning' })
      return
    }
    try {
      const response = await fetch(`/api/pages/${page.id}`, { method: 'DELETE' })
      if (response.ok) {
        setAlertDialog({ isOpen: true, title: 'Deleted', message: 'Page deleted!', type: 'success' })
        setDeletePageDialog({ isOpen: false, page: null })
        if (selectedPage?.id === page.id) {
          setSelectedPage(null)
          const currentParams = Object.fromEntries(searchParams.entries())
          delete currentParams.page
          setSearchParams(currentParams)
        }
        loadPages()
      } else {
        const error = await response.json()
        setAlertDialog({ isOpen: true, title: 'Error', message: error.error || 'Failed to delete', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting:', error)
      setAlertDialog({ isOpen: true, title: 'Error', message: 'Failed to delete', type: 'error' })
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
    const newPages = [...pages]
    const draggedIndex = newPages.findIndex(p => p.id === draggedPage.id)
    const targetIndex = newPages.findIndex(p => p.id === targetPage.id)
    newPages.splice(draggedIndex, 1)
    newPages.splice(targetIndex, 0, draggedPage)
    setPages(newPages)
    setDraggedPage(null)
  }

  const getBlockIcon = (blockType) => {
    return IconBoxMultiple
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(pageSearchQuery.toLowerCase())
  )

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 40px)',
      backgroundColor: '#2b2b2b',
      color: '#cccccc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Menu Bar - Photoshop Style */}
      <div style={{
        height: '32px',
        backgroundColor: '#323232',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        gap: '16px',
        flexShrink: 0
      }}>
        {/* Menu Items */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <MenuButton label="File">
            <MenuItem icon={IconPlus} label="New Page" onClick={() => setNewPageDialog({ isOpen: true })} />
            <MenuItem icon={IconFolderOpen} label="Open..." />
            <MenuDivider />
            <MenuItem icon={IconDeviceFloppy} label="Save" shortcut="⌘S" onClick={handleSave} />
            <MenuItem icon={IconDownload} label="Export..." />
          </MenuButton>
          <MenuButton label="Edit">
            <MenuItem icon={IconArrowBack} label="Undo" shortcut="⌘Z" />
            <MenuItem icon={IconArrowForward} label="Redo" shortcut="⌘⇧Z" />
            <MenuDivider />
            <MenuItem icon={IconCopy} label="Duplicate" shortcut="⌘D" />
            <MenuItem icon={IconTrash} label="Delete" shortcut="Del" />
          </MenuButton>
          <MenuButton label="View">
            <MenuItem icon={IconEye} label="Preview Mode" shortcut="⌘E" onClick={() => setViewMode('preview')} />
            <MenuItem icon={IconEdit} label="Edit Mode" shortcut="⌘E" onClick={() => setViewMode('edit')} />
            <MenuDivider />
            <MenuItem label="Show Grid" shortcut="⌘'" onClick={() => setShowGridGuides(!showGridGuides)} />
            <MenuItem label="Zoom In" shortcut="⌘+" onClick={() => setZoomLevel(z => Math.min(z + 10, 200))} />
            <MenuItem label="Zoom Out" shortcut="⌘-" onClick={() => setZoomLevel(z => Math.max(z - 10, 25))} />
          </MenuButton>
          <MenuButton label="Window">
            <MenuItem label="Layers" onClick={() => setActiveRightPanel('layers')} />
            <MenuItem label="Properties" onClick={() => setActiveRightPanel('properties')} />
            <MenuItem label="Components" onClick={() => setActiveRightPanel('components')} />
          </MenuButton>
        </div>

        {/* Right side - Document name and save status */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
          {selectedPage && (
            <>
              <span style={{ color: '#999' }}>{selectedPage.title}</span>
              {saving && <span style={{ color: '#6ab7ff' }}>Saving...</span>}
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Tools Panel - Vertical */}
        <div style={{
          width: '52px',
          backgroundColor: '#282828',
          borderRight: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 4px',
          gap: '4px',
          flexShrink: 0
        }}>
          <ToolButton icon={IconCursor} active={activeTool === 'cursor'} onClick={() => setActiveTool('cursor')} tooltip="Move Tool (V)" />
          <ToolButton icon={IconHandMove} active={activeTool === 'hand'} onClick={() => setActiveTool('hand')} tooltip="Hand Tool (H)" />
          <ToolButton icon={IconZoomIn} active={activeTool === 'zoom'} onClick={() => setActiveTool('zoom')} tooltip="Zoom Tool (Z)" />
          <div style={{ height: '1px', backgroundColor: '#1a1a1a', margin: '4px 0' }} />
          <ToolButton icon={IconSquare} active={activeTool === 'rectangle'} onClick={() => setActiveTool('rectangle')} tooltip="Rectangle (U)" />
          <ToolButton icon={IconCircle} active={activeTool === 'ellipse'} onClick={() => setActiveTool('ellipse')} tooltip="Ellipse (U)" />
          <ToolButton icon={IconTextSize} active={activeTool === 'text'} onClick={() => setActiveTool('text')} tooltip="Text Tool (T)" />
          <div style={{ height: '1px', backgroundColor: '#1a1a1a', margin: '4px 0' }} />
          <ToolButton icon={IconPhoto} active={activeTool === 'image'} onClick={() => setActiveTool('image')} tooltip="Image Tool" />
          <ToolButton icon={IconColumns} active={activeTool === 'layout'} onClick={() => setActiveTool('layout')} tooltip="Layout Tool" />
        </div>

        {/* Center - Canvas Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#3c3c3c' }}>
          {/* Tab Bar */}
          {selectedPage && (
            <div style={{
              height: '36px',
              backgroundColor: '#2b2b2b',
              borderBottom: '1px solid #1a1a1a',
              display: 'flex',
              alignItems: 'stretch',
              flexShrink: 0
            }}>
              <div style={{
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3c3c3c',
                borderRight: '1px solid #1a1a1a',
                fontSize: '12px',
                gap: '8px',
                minWidth: '150px'
              }}>
                <span>{selectedPage.title}</span>
                <IconX size={14} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setSelectedPage(null)} />
              </div>
            </div>
          )}

          {/* Canvas */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            position: 'relative'
          }}>
            {selectedPage ? (
              <>
                {showGridGuides && viewMode === 'edit' && (
                  <GridGuides viewportSize={viewportSize} onToggle={() => setShowGridGuides(false)} />
                )}
                <div style={{
                  width: viewportSize.width + 'px',
                  minHeight: viewportSize.height + 'px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center',
                  transition: 'transform 0.2s'
                }}>
                  <InteractiveViewport
                    blocks={selectedPage.content || []}
                    onBlocksChange={handleBlocksChange}
                    onBlockSelect={handleBlockSelect}
                    viewMode={viewMode}
                  />
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                <IconFile size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p>No document open</p>
                <button
                  onClick={() => pages.length > 0 && handlePageSelect(pages[0])}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    backgroundColor: '#6ab7ff',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Open Recent
                </button>
              </div>
            )}
          </div>

          {/* Bottom Info Bar */}
          <div style={{
            height: '28px',
            backgroundColor: '#282828',
            borderTop: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '16px',
            fontSize: '11px',
            color: '#999',
            flexShrink: 0
          }}>
            <span>{zoomLevel}%</span>
            {selectedPage && (
              <>
                <span>•</span>
                <span>{selectedPage.content?.length || 0} blocks</span>
                <span>•</span>
                <span>{viewportSize.width} × {viewportSize.height}</span>
              </>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button onClick={() => setZoomLevel(z => Math.max(z - 10, 25))} style={zoomButtonStyle}>-</button>
              <button onClick={() => setZoomLevel(100)} style={zoomButtonStyle}>100%</button>
              <button onClick={() => setZoomLevel(z => Math.min(z + 10, 200))} style={zoomButtonStyle}>+</button>
            </div>
          </div>
        </div>

        {/* Right Panels - Stacked like Photoshop */}
        <div style={{
          width: '280px',
          backgroundColor: '#282828',
          borderLeft: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {/* Layers Panel */}
          <PanelSection
            title="Layers"
            isExpanded={activeRightPanel === 'layers'}
            onToggle={() => setActiveRightPanel(activeRightPanel === 'layers' ? '' : 'layers')}
          >
            <div style={{ padding: '8px' }}>
              {/* Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3c3c3c',
                borderRadius: '4px',
                padding: '6px 8px',
                marginBottom: '8px'
              }}>
                <IconSearch size={14} style={{ color: '#999', marginRight: '6px' }} />
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
                    color: '#ccc',
                    fontSize: '11px'
                  }}
                />
              </div>

              {/* Pages List */}
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredPages.map(page => {
                  const iconConfig = pageIcons[page.slug] || { icon: IconFile, color: '#999' }
                  const Icon = iconConfig.icon
                  const isSelected = selectedPage?.id === page.id
                  return (
                    <div
                      key={page.id}
                      onClick={() => handlePageSelect(page)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px 8px',
                        backgroundColor: isSelected ? '#4a4a4a' : 'transparent',
                        borderRadius: '3px',
                        marginBottom: '2px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#3c3c3c')}
                      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Icon size={14} style={{ color: iconConfig.color, marginRight: '8px' }} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {page.title}
                      </span>
                      <IconEyeOff size={12} style={{ opacity: page.is_published ? 0 : 0.5 }} />
                    </div>
                  )
                })}
              </div>
            </div>
          </PanelSection>

          {/* Properties Panel */}
          <PanelSection
            title="Properties"
            isExpanded={activeRightPanel === 'properties'}
            onToggle={() => setActiveRightPanel(activeRightPanel === 'properties' ? '' : 'properties')}
          >
            <div style={{ padding: '12px', fontSize: '12px' }}>
              {selectedPage ? (
                <>
                  <PropertyRow label="Title" value={selectedPage.title} />
                  <PropertyRow label="Slug" value={selectedPage.slug} />
                  <PropertyRow label="Status" value={selectedPage.is_published ? 'Published' : 'Draft'} />
                  <PropertyRow label="Blocks" value={selectedPage.content?.length || 0} />
                </>
              ) : (
                <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                  No page selected
                </div>
              )}
            </div>
          </PanelSection>

          {/* Components Panel */}
          <PanelSection
            title="Components"
            isExpanded={activeRightPanel === 'components'}
            onToggle={() => setActiveRightPanel(activeRightPanel === 'components' ? '' : 'components')}
          >
            <div style={{ padding: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              {viewMode === 'edit' && selectedPage && (
                <ComponentToolbox onAddComponent={handleAddComponent} />
              )}
            </div>
          </PanelSection>
        </div>
      </div>

      {/* Dialogs */}
      <UnrealAlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        confirmText="OK"
      />

      <NewPageDialog
        isOpen={newPageDialog.isOpen}
        onClose={() => setNewPageDialog({ isOpen: false })}
        onConfirm={handleCreatePage}
      />

      <UnrealAlertDialog
        isOpen={deletePageDialog.isOpen}
        onClose={() => setDeletePageDialog({ isOpen: false, page: null })}
        onConfirm={() => handleDeletePage(deletePageDialog.page)}
        title="Delete Page"
        message={`Delete "${deletePageDialog.page?.title}"?`}
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
      />

      {showImageUploader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <ImageUploadManager
              onSelect={(url) => {
                if (imageUploaderCallback) imageUploaderCallback(url)
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

      {showCSSEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
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

      {selectedBlock && selectedBlock.index !== undefined && viewMode === 'edit' && (
        <PropertiesPanel
          block={selectedBlock}
          blockIndex={selectedBlock?.index}
          onUpdate={handleBlockUpdate}
          isVisible={true}
        />
      )}
    </div>
  )
}

// Helper Components
function MenuButton({ label, children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div style={{
        padding: '6px 12px',
        cursor: 'pointer',
        backgroundColor: isOpen ? '#4a4a4a' : 'transparent',
        borderRadius: '3px',
        transition: 'background-color 0.15s'
      }}>
        {label}
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          backgroundColor: '#353535',
          border: '1px solid #1a1a1a',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          minWidth: '200px',
          padding: '4px',
          zIndex: 1000,
          marginTop: '2px'
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon: Icon, label, shortcut, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        borderRadius: '3px',
        backgroundColor: 'transparent',
        transition: 'background-color 0.15s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a4a4a'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {Icon && <Icon size={14} style={{ marginRight: '8px', opacity: 0.7 }} />}
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && <span style={{ fontSize: '10px', color: '#999', marginLeft: '16px' }}>{shortcut}</span>}
    </div>
  )
}

function MenuDivider() {
  return <div style={{ height: '1px', backgroundColor: '#2a2a2a', margin: '4px 0' }} />
}

function ToolButton({ icon: Icon, active, onClick, tooltip }) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      style={{
        width: '44px',
        height: '44px',
        backgroundColor: active ? '#4a4a4a' : 'transparent',
        border: 'none',
        borderRadius: '4px',
        color: active ? '#6ab7ff' : '#999',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s'
      }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = '#3c3c3c')}
      onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Icon size={20} />
    </button>
  )
}

function PanelSection({ title, isExpanded, onToggle, children }) {
  return (
    <div style={{
      borderBottom: '1px solid #1a1a1a',
      flexShrink: 0
    }}>
      <div
        onClick={onToggle}
        style={{
          padding: '10px 12px',
          backgroundColor: '#2b2b2b',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {isExpanded ? <IconChevronDown size={14} style={{ marginRight: '6px' }} /> : <IconChevronRight size={14} style={{ marginRight: '6px' }} />}
        {title}
      </div>
      {isExpanded && children}
    </div>
  )
}

function PropertyRow({ label, value }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        padding: '6px 8px',
        backgroundColor: '#3c3c3c',
        borderRadius: '3px',
        fontSize: '11px'
      }}>
        {value}
      </div>
    </div>
  )
}

const zoomButtonStyle = {
  padding: '2px 8px',
  backgroundColor: '#3c3c3c',
  border: '1px solid #4a4a4a',
  borderRadius: '3px',
  color: '#ccc',
  fontSize: '10px',
  cursor: 'pointer'
}

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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#353535',
          border: '1px solid #1a1a1a',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          width: '400px',
          maxWidth: '90vw'
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a2a' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>New Page</h2>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Page title"
              autoFocus
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#2b2b2b',
                border: '1px solid #4a4a4a',
                borderRadius: '4px',
                color: '#ccc',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' }}>Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="page-slug"
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#2b2b2b',
                border: '1px solid #4a4a4a',
                borderRadius: '4px',
                color: '#ccc',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </div>
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #2a2a2a',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <button onClick={onClose} style={dialogButtonStyle}>Cancel</button>
          <button onClick={handleConfirm} style={{ ...dialogButtonStyle, backgroundColor: '#6ab7ff', color: '#fff' }}>Create</button>
        </div>
      </div>
    </div>
  )
}

const dialogButtonStyle = {
  padding: '6px 16px',
  backgroundColor: '#4a4a4a',
  border: 'none',
  borderRadius: '4px',
  color: '#ccc',
  fontSize: '12px',
  cursor: 'pointer'
}
