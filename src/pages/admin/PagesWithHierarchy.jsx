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
  IconDeviceFloppy,
  IconEdit,
  IconEye,
  IconPlus
} from '@tabler/icons-react'
import InteractiveViewport from '../../components/InteractiveViewport'
import ComponentToolbox from '../../components/ComponentToolbox'

export default function PagesWithHierarchy() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState(null)
  const [expandedPages, setExpandedPages] = useState({})
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [isPropertiesPanelCollapsed, setIsPropertiesPanelCollapsed] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState('edit') // 'edit' or 'preview'

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
                  defaultExpanded={true}
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
                    defaultExpanded={true}
                  >
                    <PropertyField label="Type" value={selectedBlock.type} />
                    {selectedBlock.data && Object.keys(selectedBlock.data).length > 0 && (
                      <>
                        {Object.entries(selectedBlock.data).map(([key, value]) => (
                          <PropertyField
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={typeof value === 'string' ? value : JSON.stringify(value)}
                            multiline={typeof value === 'string' && value.length > 50}
                          />
                        ))}
                      </>
                    )}
                    {selectedBlock.hidden !== undefined && (
                      <PropertyField label="Hidden" value={selectedBlock.hidden ? 'Yes' : 'No'} />
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
