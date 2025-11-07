import { useState } from 'react'
import {
  IconTextSize,
  IconPhoto,
  IconLayoutGrid,
  IconClick,
  IconHeading,
  IconLanguage,
  IconCalendar,
  IconChevronRight
} from '@tabler/icons-react'

// Available component types that can be dragged into the viewport
const componentLibrary = [
  { type: 'hero', icon: IconHeading, label: 'Hero', color: '#4a7ba7' },
  { type: 'text', icon: IconTextSize, label: 'Text', color: '#5a9b5a' },
  { type: 'html', icon: IconTextSize, label: 'HTML', color: '#7b8ba7' },
  { type: 'image', icon: IconPhoto, label: 'Image', color: '#9b7ba7' },
  { type: 'card-grid', icon: IconLayoutGrid, label: 'Card Grid', color: '#7ba7a7' },
  { type: 'cta', icon: IconClick, label: 'CTA', color: '#a77b7b' },
  { type: 'language-switcher', icon: IconLanguage, label: 'Language', color: '#8a7ba7' },
  { type: 'events-list', icon: IconCalendar, label: 'Events', color: '#7ba78a' },
]

export default function ComponentToolbox({ onAddComponent }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDragStart = (e, componentType) => {
    e.dataTransfer.setData('componentType', componentType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleAddClick = (componentType) => {
    // Create a default block structure
    const newBlock = {
      type: componentType,
      data: getDefaultBlockData(componentType),
      hidden: false
    }
    onAddComponent?.(newBlock)
  }

  return (
    <div
      style={{
        width: isExpanded ? '200px' : '48px',
        backgroundColor: '#252525',
        borderRight: '1px solid #3a3a3a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      {/* Toolbox Header */}
      <div
        style={{
          height: '40px',
          borderBottom: '1px solid #3a3a3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded && (
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#e0e0e0' }}>
            Components
          </span>
        )}
        <IconChevronRight
          size={16}
          style={{
            color: '#a0a0a0',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            margin: isExpanded ? '0' : '0 auto'
          }}
        />
      </div>

      {/* Component List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px'
        }}
      >
        {componentLibrary.map((component) => {
          const Icon = component.icon
          return (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component.type)}
              onClick={() => handleAddClick(component.type)}
              title={isExpanded ? '' : component.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                gap: '8px',
                padding: isExpanded ? '8px' : '4px',
                marginBottom: '4px',
                backgroundColor: '#2a2a2a',
                border: '1px solid #3a3a3a',
                borderRadius: '3px',
                cursor: 'grab',
                transition: 'all 0.15s ease',
                userSelect: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3a3a3a'
                e.currentTarget.style.borderColor = component.color
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a'
                e.currentTarget.style.borderColor = '#3a3a3a'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: component.color + '33',
                  borderRadius: '3px',
                  flexShrink: 0
                }}
              >
                <Icon size={18} style={{ color: component.color }} />
              </div>
              {isExpanded && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#e0e0e0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {component.label}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: '#7a7a7a',
                      marginTop: '2px'
                    }}
                  >
                    {component.type}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
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
