import { useState } from 'react'
import {
  IconGripVertical,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconSettings
} from '@tabler/icons-react'
import BlockRenderer from './BlockEditor/BlockRenderer'

export default function InteractiveViewport({ blocks, onBlocksChange, onBlockSelect, viewMode = 'edit' }) {
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState(null)
  const [draggedBlockIndex, setDraggedBlockIndex] = useState(null)

  const isEditMode = viewMode === 'edit'

  const handleBlockClick = (block, index) => {
    onBlockSelect?.(block)
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
    if (confirm('Are you sure you want to delete this block?')) {
      const newBlocks = blocks.filter((_, i) => i !== index)
      onBlocksChange?.(newBlocks)
    }
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

    return (
      <div
        key={index}
        onMouseEnter={() => isEditMode && setHoveredBlockIndex(index)}
        onMouseLeave={() => isEditMode && setHoveredBlockIndex(null)}
        onClick={() => isEditMode && handleBlockClick(block, index)}
        style={{
          position: 'relative',
          marginBottom: isEditMode ? '16px' : '0',
          border: isEditMode && isHovered ? '2px solid #4a7ba7' : '2px solid transparent',
          borderRadius: isEditMode ? '4px' : '0',
          backgroundColor: isEditMode ? (isHidden ? '#2a2a2a' : '#252525') : 'transparent',
          opacity: isHidden ? 0.5 : 1,
          cursor: isEditMode ? 'pointer' : 'default',
          transition: 'all 0.2s ease'
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

        {/* Block Content Preview */}
        <div style={{
          padding: isEditMode ? '16px 16px 16px 36px' : '0',
          minHeight: isEditMode ? '60px' : 'auto'
        }}>
          {isEditMode && (
            <div style={{
              fontSize: '11px',
              color: '#7a7a7a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              {block.type || 'Unknown Block'}
            </div>
          )}

          {isEditMode ? (
            <BlockPreview block={block} />
          ) : (
            <BlockRenderer block={block} />
          )}
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

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        backgroundColor: isEditMode ? '#1e1e1e' : 'transparent',
        borderRadius: '4px',
        padding: isEditMode ? '24px' : '0',
        minHeight: '400px'
      }}
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

// Block Preview Component - Renders a preview based on block type
function BlockPreview({ block }) {
  const blockData = block.data || {}

  switch (block.type) {
    case 'hero':
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

    case 'text':
    case 'html':
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
    case 'card-grid':
      return {
        title: 'Card Grid',
        columns: 3,
        cards: []
      }
    case 'cta':
      return {
        heading: 'Call to Action',
        buttonText: 'Learn More',
        buttonLink: '#'
      }
    case 'language-switcher':
      return {}
    case 'events-list':
      return {
        limit: 5,
        view: 'list'
      }
    default:
      return {}
  }
}
