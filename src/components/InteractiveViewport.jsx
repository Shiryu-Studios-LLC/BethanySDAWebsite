import { useState, useRef, useEffect } from 'react'
import {
  IconGripVertical,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconSettings,
  IconBoxPadding
} from '@tabler/icons-react'
import BlockRenderer from './BlockEditor/BlockRenderer'
import UnrealAlertDialog from './UnrealAlertDialog'
import FloatingTextToolbar from './FloatingTextToolbar'
import SpacingControl from './SpacingControl'
import ResizeHandles from './ResizeHandles'
import BorderControlPanel from './BorderControlPanel'
import BrowserFrame from './BrowserFrame'

export default function InteractiveViewport({ blocks, onBlocksChange, onBlockSelect, viewMode = 'edit' }) {
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState(null)
  const [draggedBlockIndex, setDraggedBlockIndex] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, blockIndex: null })
  const [editingBlockIndex, setEditingBlockIndex] = useState(null)
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [spacingControlVisible, setSpacingControlVisible] = useState(false)
  const [spacingControlBlock, setSpacingControlBlock] = useState(null)
  const [borderControlVisible, setBorderControlVisible] = useState(false)
  const [borderControlBlock, setBorderControlBlock] = useState(null)
  const [resizingBlockIndex, setResizingBlockIndex] = useState(null)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null)
  const editableRefs = useRef({})

  const isEditMode = viewMode === 'edit'

  // Handle text selection for toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!isEditMode || editingBlockIndex === null) {
        setToolbarVisible(false)
        return
      }

      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
        setToolbarVisible(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      })
      setToolbarVisible(true)
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [isEditMode, editingBlockIndex])

  const handleBlockClick = (block, index) => {
    setSelectedBlockIndex(index)
    onBlockSelect?.(block, index)
  }

  const handleOpenSpacingControl = (block, index) => {
    setSpacingControlBlock({ ...block, index })
    setSpacingControlVisible(true)
  }

  const handleSpacingUpdate = (index, spacing) => {
    const newBlocks = [...blocks]
    newBlocks[index] = {
      ...newBlocks[index],
      data: {
        ...newBlocks[index].data,
        spacing
      }
    }
    onBlocksChange?.(newBlocks)
  }

  const handleOpenBorderControl = (block, index) => {
    setBorderControlBlock({ ...block, index })
    setBorderControlVisible(true)
  }

  const handleBorderUpdate = (index, borderData) => {
    const newBlocks = [...blocks]
    newBlocks[index] = {
      ...newBlocks[index],
      data: {
        ...newBlocks[index].data,
        ...borderData
      }
    }
    onBlocksChange?.(newBlocks)
  }

  const handleResize = (index, dimensions) => {
    const newBlocks = [...blocks]
    newBlocks[index] = {
      ...newBlocks[index],
      data: {
        ...newBlocks[index].data,
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
      }
    }
    onBlocksChange?.(newBlocks)
  }

  const handleFormat = (command) => {
    if (editingBlockIndex === null) return

    switch (command) {
      case 'bold':
        document.execCommand('bold', false, null)
        break
      case 'italic':
        document.execCommand('italic', false, null)
        break
      case 'underline':
        document.execCommand('underline', false, null)
        break
      case 'h1':
        document.execCommand('formatBlock', false, '<h1>')
        break
      case 'h2':
        document.execCommand('formatBlock', false, '<h2>')
        break
      case 'h3':
        document.execCommand('formatBlock', false, '<h3>')
        break
      case 'alignLeft':
        document.execCommand('justifyLeft', false, null)
        break
      case 'alignCenter':
        document.execCommand('justifyCenter', false, null)
        break
      case 'alignRight':
        document.execCommand('justifyRight', false, null)
        break
      case 'bulletList':
        document.execCommand('insertUnorderedList', false, null)
        break
      case 'numberedList':
        document.execCommand('insertOrderedList', false, null)
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) {
          document.execCommand('createLink', false, url)
        }
        break
      default:
        break
    }

    // Update block content after formatting
    updateBlockContent(editingBlockIndex)
  }

  const updateBlockContent = (index) => {
    const element = editableRefs.current[index]
    if (!element) return

    const newBlocks = [...blocks]
    const block = newBlocks[index]

    // Update the appropriate field based on block type
    if (block.type === 'text' || block.type === 'html') {
      block.data.content = element.innerHTML
    } else if (block.type === 'heading') {
      block.data.text = element.innerText
    } else if (block.type === 'hero') {
      // Determine which element was edited (title or subtitle)
      if (element.dataset.field === 'title') {
        block.data.title = element.innerText
      } else if (element.dataset.field === 'subtitle') {
        block.data.subtitle = element.innerText
      }
    } else if (block.type === 'image-text') {
      if (element.dataset.field === 'title') {
        block.data.title = element.innerText
      } else if (element.dataset.field === 'content') {
        block.data.content = element.innerHTML
      }
    } else if (block.type === 'cta') {
      if (element.dataset.field === 'heading') {
        block.data.heading = element.innerText
      } else if (element.dataset.field === 'buttonText') {
        block.data.buttonText = element.innerText
      }
    }

    onBlocksChange?.(newBlocks)
  }

  const handleContentEdit = (index, element) => {
    setEditingBlockIndex(index)
    editableRefs.current[index] = element
  }


  const handleDrop = (e) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType')
    if (componentType) {
      // Create new block from toolbox
      const newBlock = {
        type: componentType,
        data: getDefaultBlockData(componentType),
        hidden: false
      }
      onBlocksChange?.([...blocks, newBlock])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleBlockDelete = (index) => {
    setDeleteDialog({ isOpen: true, blockIndex: index })
  }

  const confirmDelete = () => {
    if (deleteDialog.blockIndex !== null) {
      const newBlocks = blocks.filter((_, i) => i !== deleteDialog.blockIndex)
      onBlocksChange?.(newBlocks)
    }
    setDeleteDialog({ isOpen: false, blockIndex: null })
  }

  const handleBlockToggleVisibility = (index) => {
    const newBlocks = [...blocks]
    newBlocks[index] = {
      ...newBlocks[index],
      hidden: !newBlocks[index].hidden
    }
    onBlocksChange?.(newBlocks)
  }

  const renderBlock = (block, index) => {
    const isHovered = hoveredBlockIndex === index
    const isHidden = block.hidden
    const spacing = block.data?.spacing || {}

    return (
      <div
        key={index}
        onMouseEnter={() => isEditMode && setHoveredBlockIndex(index)}
        onMouseLeave={() => isEditMode && setHoveredBlockIndex(null)}
        onClick={() => isEditMode && handleBlockClick(block, index)}
        style={{
          position: 'relative',
          border: isEditMode && isHovered ? '2px solid #4a7ba7' : '2px solid transparent',
          borderRadius: '4px',
          opacity: isHidden ? 0.5 : 1,
          cursor: isEditMode ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          marginTop: spacing.marginTop || '0',
          marginRight: spacing.marginRight || '0',
          marginBottom: spacing.marginBottom || '0',
          marginLeft: spacing.marginLeft || '0',
          paddingTop: spacing.paddingTop || '0',
          paddingRight: spacing.paddingRight || '0',
          paddingBottom: spacing.paddingBottom || '0',
          paddingLeft: spacing.paddingLeft || '0'
        }}
      >
        {/* Block Controls - Show on Hover in Edit Mode */}
        {isEditMode && isHovered && (
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '8px',
            display: 'flex',
            gap: '4px',
            zIndex: 10
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenSpacingControl(block, index)
              }}
              title="Adjust Spacing"
              style={{
                background: '#3a3a3a',
                border: '1px solid #4a4a4a',
                borderRadius: '3px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#e0e0e0',
                fontSize: '10px'
              }}
            >
              <IconBoxPadding size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenBorderControl(block, index)
              }}
              title="Border & Style"
              style={{
                background: '#3a3a3a',
                border: '1px solid #4a4a4a',
                borderRadius: '3px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#e0e0e0',
                fontSize: '10px'
              }}
            >
              <IconSettings size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleBlockToggleVisibility(index)
              }}
              title={isHidden ? 'Show Block' : 'Hide Block'}
              style={{
                background: '#3a3a3a',
                border: '1px solid #4a4a4a',
                borderRadius: '3px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#e0e0e0'
              }}
            >
              {isHidden ? <IconEyeOff size={14} /> : <IconEye size={14} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleBlockDelete(index)
              }}
              title="Delete Block"
              style={{
                background: '#3a3a3a',
                border: '1px solid #4a4a4a',
                borderRadius: '3px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#ff6b6b'
              }}
            >
              <IconTrash size={14} />
            </button>
          </div>
        )}

        {/* Resize Handles - Show when block is selected and resizable */}
        {isEditMode && selectedBlockIndex === index && ['image', 'video', 'section', 'hero'].includes(block.type) && (
          <ResizeHandles
            initialWidth={parseInt(block.data?.width) || 300}
            initialHeight={parseInt(block.data?.height) || 200}
            onResize={(dimensions) => handleResize(index, dimensions)}
          />
        )}

        {/* Drag Handle - Only in Edit Mode */}
        {isEditMode && isHovered && (
          <div
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'grab',
              color: '#7a7a7a'
            }}
          >
            <IconGripVertical size={18} />
          </div>
        )}

        {/* Block Content - Always render as preview */}
        <div>
          <BlockPreview
            block={block}
            blockIndex={index}
            isPreview={true}
            isEditMode={isEditMode}
            onContentEdit={handleContentEdit}
            onBlur={() => updateBlockContent(index)}
          />
        </div>
      </div>
    )
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#7a7a7a',
          backgroundColor: '#1e1e1e',
          borderRadius: '4px',
          border: '2px dashed #3a3a3a'
        }}
      >
        <IconSettings size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>No blocks yet</p>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>
          {isEditMode ? 'Drag components from the toolbox or click to add' : 'No content to display'}
        </p>
      </div>
    )
  }

  const viewportContent = (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        backgroundColor: 'transparent',
        minHeight: '400px'
      }}
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )

  return (
    <>
      <BrowserFrame>
        {viewportContent}
      </BrowserFrame>

      {/* Floating Text Toolbar */}
      <FloatingTextToolbar
        isVisible={toolbarVisible}
        position={toolbarPosition}
        onFormat={handleFormat}
      />

      {/* Spacing Control Panel */}
      <SpacingControl
        isVisible={spacingControlVisible}
        block={spacingControlBlock}
        blockIndex={spacingControlBlock?.index}
        onUpdate={handleSpacingUpdate}
        onClose={() => setSpacingControlVisible(false)}
      />

      {/* Border Control Panel */}
      <BorderControlPanel
        isVisible={borderControlVisible}
        block={borderControlBlock}
        blockIndex={borderControlBlock?.index}
        onUpdate={handleBorderUpdate}
        onClose={() => setBorderControlVisible(false)}
      />

      {/* Delete Confirmation Dialog */}
      <UnrealAlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, blockIndex: null })}
        onConfirm={confirmDelete}
        title="Delete Block"
        message="Are you sure you want to delete this block? This action cannot be undone."
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
      />
    </>
  )
}

// Block Preview Component - Renders a preview based on block type
function BlockPreview({ block, blockIndex, isPreview = false, isEditMode = false, onContentEdit, onBlur }) {
  const blockData = block.data || {}

  const makeEditable = (content, field) => ({
    contentEditable: isEditMode,
    suppressContentEditableWarning: true,
    onFocus: (e) => isEditMode && onContentEdit?.(blockIndex, e.target),
    onBlur: (e) => isEditMode && onBlur?.(e),
    onInput: (e) => isEditMode && onBlur?.(e),
    'data-field': field,
    style: {
      outline: isEditMode ? '2px solid transparent' : 'none',
      cursor: isEditMode ? 'text' : 'default'
    }
  })

  switch (block.type) {
    case 'hero':
      if (isPreview) {
        return (
          <div style={{
            backgroundColor: blockData.backgroundColor || '#0054a6',
            backgroundImage: blockData.backgroundImage ? `url(${blockData.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '60px 20px',
            textAlign: 'center',
            borderRadius: '4px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {blockData.title && (
              <h1
                {...makeEditable(blockData.title, 'title')}
                style={{
                  ...makeEditable(blockData.title, 'title').style,
                  fontSize: '36px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {blockData.title}
              </h1>
            )}
            {blockData.subtitle && (
              <p
                {...makeEditable(blockData.subtitle, 'subtitle')}
                style={{
                  ...makeEditable(blockData.subtitle, 'subtitle').style,
                  fontSize: '18px',
                  opacity: 0.9,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {blockData.subtitle}
              </p>
            )}
          </div>
        )
      }
      return (
        <div>
          {blockData.title && (
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#e0e0e0',
              marginBottom: '8px'
            }}>
              {blockData.title}
            </div>
          )}
          {blockData.subtitle && (
            <div style={{
              fontSize: '13px',
              color: '#a0a0a0'
            }}>
              {blockData.subtitle}
            </div>
          )}
          {blockData.backgroundImage && (
            <div style={{
              fontSize: '11px',
              color: '#7a7a7a',
              marginTop: '8px'
            }}>
              Background: {blockData.backgroundImage}
            </div>
          )}
        </div>
      )

    case 'heading':
      if (isPreview) {
        const HeadingTag = blockData.level || 'h2'
        return (
          <HeadingTag
            {...makeEditable(blockData.text, 'text')}
            style={{
              ...makeEditable(blockData.text, 'text').style,
              textAlign: blockData.alignment || 'left',
              margin: '16px 0',
              color: '#000000'
            }}
          >
            {blockData.text || 'Heading'}
          </HeadingTag>
        )
      }
      return (
        <div style={{ fontSize: '14px', color: '#a0a0a0' }}>
          {blockData.level?.toUpperCase() || 'H2'}: {blockData.text || 'Heading'}
        </div>
      )

    case 'text':
    case 'html':
      if (isPreview && blockData.content) {
        return (
          <div
            {...makeEditable(blockData.content, 'content')}
            style={{
              ...makeEditable(blockData.content, 'content').style,
              fontSize: '14px',
              color: '#000000',
              lineHeight: '1.6',
              padding: '16px',
              backgroundColor: 'transparent',
              borderRadius: '4px'
            }}
            dangerouslySetInnerHTML={!isEditMode ? { __html: blockData.content } : undefined}
          >
            {isEditMode && <div dangerouslySetInnerHTML={{ __html: blockData.content }} />}
          </div>
        )
      }
      return (
        <div style={{
          fontSize: '12px',
          color: '#a0a0a0',
          lineHeight: '1.5',
          maxHeight: '100px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {blockData.content ? (
            <div dangerouslySetInnerHTML={{
              __html: blockData.content.substring(0, 200) + (blockData.content.length > 200 ? '...' : '')
            }} />
          ) : (
            <span style={{ color: '#7a7a7a', fontStyle: 'italic' }}>No content</span>
          )}
        </div>
      )

    case 'image':
      if (isPreview && blockData.src) {
        return (
          <div style={{ textAlign: 'center' }}>
            <img
              src={blockData.src}
              alt={blockData.alt || 'Image'}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '4px',
                border: '1px solid #3a3a3a'
              }}
            />
            {blockData.alt && (
              <div style={{
                fontSize: '12px',
                color: '#7a7a7a',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                {blockData.alt}
              </div>
            )}
          </div>
        )
      }
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {blockData.src && (
            <div style={{
              width: '80px',
              height: '60px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #3a3a3a',
              borderRadius: '3px',
              backgroundImage: `url(${blockData.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          )}
          <div style={{ flex: 1 }}>
            {blockData.alt && (
              <div style={{ fontSize: '12px', color: '#e0e0e0', marginBottom: '4px' }}>
                {blockData.alt}
              </div>
            )}
            {blockData.src && (
              <div style={{ fontSize: '11px', color: '#7a7a7a' }}>
                {blockData.src.split('/').pop()}
              </div>
            )}
          </div>
        </div>
      )

    case 'card-grid':
      return (
        <div>
          {blockData.title && (
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#e0e0e0',
              marginBottom: '8px'
            }}>
              {blockData.title}
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#7a7a7a' }}>
            {blockData.cards?.length || 0} cards • {blockData.columns || 3} columns
          </div>
        </div>
      )

    case 'cta':
      return (
        <div>
          {blockData.heading && (
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#e0e0e0',
              marginBottom: '8px'
            }}>
              {blockData.heading}
            </div>
          )}
          {blockData.buttonText && (
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#4a7ba7',
              color: '#ffffff',
              fontSize: '12px',
              borderRadius: '3px',
              marginTop: '8px'
            }}>
              {blockData.buttonText}
            </div>
          )}
        </div>
      )

    case 'language-switcher':
      return (
        <div style={{ fontSize: '12px', color: '#a0a0a0' }}>
          Language selector component
        </div>
      )

    case 'events-list':
      return (
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0', marginBottom: '8px' }}>
            Events List
          </div>
          <div style={{ fontSize: '11px', color: '#7a7a7a' }}>
            Limit: {blockData.limit || 'All'} • View: {blockData.view || 'Default'}
          </div>
        </div>
      )

    default:
      return (
        <div style={{
          fontSize: '12px',
          color: '#7a7a7a',
          fontStyle: 'italic'
        }}>
          {JSON.stringify(blockData).substring(0, 150)}
          {JSON.stringify(blockData).length > 150 ? '...' : ''}
        </div>
      )
  }
}

// Helper function to create default data for each block type
function getDefaultBlockData(componentType) {
  switch (componentType) {
    case 'hero':
      return {
        title: 'New Hero Section',
        subtitle: 'Add your subtitle here',
        backgroundColor: '#0054a6',
        backgroundImage: ''
      }
    case 'text':
      return {
        content: 'Enter your text content here...'
      }
    case 'html':
      return {
        content: '<p>Enter HTML content here...</p>'
      }
    case 'image':
      return {
        src: '',
        alt: 'Image description'
      }
    case 'video':
      return {
        src: '',
        poster: '',
        autoplay: false
      }
    case 'card-grid':
      return {
        title: 'Card Grid',
        columns: 3,
        cards: []
      }
    case 'two-column':
      return {
        leftContent: '<p>Left column content</p>',
        rightContent: '<p>Right column content</p>'
      }
    case 'cta':
      return {
        heading: 'Call to Action',
        buttonText: 'Learn More',
        buttonLink: '#'
      }
    case 'divider':
      return {
        style: 'solid',
        color: '#cccccc'
      }
    case 'map':
      return {
        address: '123 Main St, City, State 12345',
        zoom: 15
      }
    case 'contact-form':
      return {
        title: 'Contact Us',
        fields: ['name', 'email', 'message']
      }
    case 'testimonial':
      return {
        quote: 'This is a testimonial quote',
        author: 'John Doe',
        role: 'Position'
      }
    case 'accordion':
      return {
        items: [
          { title: 'Section 1', content: 'Content for section 1' },
          { title: 'Section 2', content: 'Content for section 2' }
        ]
      }
    case 'embed':
      return {
        embedCode: '',
        aspectRatio: '16:9'
      }
    case 'bulletin':
      return {
        date: new Date().toISOString().split('T')[0],
        fileUrl: ''
      }
    case 'language-switcher':
      return {}
    case 'events-list':
      return {
        limit: 5,
        view: 'list'
      }

    // New components - same as ComponentToolbox
    case 'section':
      return {
        backgroundColor: '#1a1d2e',
        padding: 'medium',
        content: []
      }
    case 'three-column':
      return {
        leftContent: '<p>Column 1</p>',
        centerContent: '<p>Column 2</p>',
        rightContent: '<p>Column 3</p>'
      }
    case 'spacer':
      return {
        height: '40px'
      }
    case 'heading':
      return {
        text: 'Heading Text',
        level: 'h2',
        alignment: 'left'
      }
    case 'image-text':
      return {
        imagePosition: 'left',
        imageSrc: '',
        imageAlt: 'Image description',
        title: 'Title',
        content: '<p>Content goes here...</p>',
        buttonText: '',
        buttonLink: ''
      }
    case 'gallery':
      return {
        images: [],
        columns: 3,
        lightbox: true
      }
    case 'youtube':
      return {
        videoId: '',
        autoplay: false
      }
    case 'button':
      return {
        text: 'Click Me',
        link: '#',
        style: 'primary',
        size: 'medium'
      }
    case 'tabs':
      return {
        tabs: [
          { title: 'Tab 1', content: '<p>Tab 1 content</p>' },
          { title: 'Tab 2', content: '<p>Tab 2 content</p>' }
        ]
      }
    case 'event-calendar':
      return {
        view: 'month'
      }
    case 'news-list':
      return {
        limit: 5,
        showExcerpt: true
      }
    case 'blog-posts':
      return {
        limit: 6,
        columns: 2
      }
    case 'sermon-list':
      return {
        limit: 5,
        showSpeaker: true,
        showDate: true
      }
    case 'staff-grid':
      return {
        columns: 3,
        showBio: true
      }
    case 'countdown':
      return {
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Event Countdown',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true
      }
    case 'social-feed':
      return {
        platform: 'instagram',
        limit: 6
      }
    case 'breadcrumb':
      return {
        showHome: true,
        separator: '/'
      }
    case 'menu':
      return {
        orientation: 'horizontal',
        items: []
      }
    case 'link':
      return {
        text: 'Link Text',
        url: '#',
        openInNewTab: false
      }
    default:
      return {}
  }
}
