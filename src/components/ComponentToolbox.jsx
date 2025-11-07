import { useState } from 'react'
import {
  IconTextSize,
  IconPhoto,
  IconLayoutGrid,
  IconClick,
  IconHeading,
  IconLanguage,
  IconCalendar,
  IconChevronRight,
  IconVideo,
  IconColumns,
  IconSeparator,
  IconMap,
  IconMail,
  IconQuote,
  IconListDetails,
  IconFileDescription,
  IconLayout2
} from '@tabler/icons-react'

// Available component types organized by category
const componentLibrary = [
  {
    category: 'Layout',
    components: [
      { type: 'hero', icon: IconHeading, label: 'Hero', color: '#4a7ba7' },
      { type: 'two-column', icon: IconColumns, label: 'Two Column', color: '#8a9b7b' },
      { type: 'card-grid', icon: IconLayoutGrid, label: 'Card Grid', color: '#7ba7a7' },
      { type: 'divider', icon: IconSeparator, label: 'Divider', color: '#7a7a7a' },
    ]
  },
  {
    category: 'Content',
    components: [
      { type: 'text', icon: IconTextSize, label: 'Text', color: '#5a9b5a' },
      { type: 'html', icon: IconTextSize, label: 'HTML', color: '#7b8ba7' },
      { type: 'image', icon: IconPhoto, label: 'Image', color: '#9b7ba7' },
      { type: 'video', icon: IconVideo, label: 'Video', color: '#6a8ba7' },
      { type: 'bulletin', icon: IconFileDescription, label: 'Bulletin', color: '#7b9b8b' },
    ]
  },
  {
    category: 'Interactive',
    components: [
      { type: 'cta', icon: IconClick, label: 'CTA', color: '#a77b7b' },
      { type: 'contact-form', icon: IconMail, label: 'Contact Form', color: '#9b7b7b' },
      { type: 'accordion', icon: IconListDetails, label: 'Accordion', color: '#8b7b9b' },
      { type: 'language-switcher', icon: IconLanguage, label: 'Language', color: '#8a7ba7' },
    ]
  },
  {
    category: 'Dynamic',
    components: [
      { type: 'events-list', icon: IconCalendar, label: 'Events', color: '#7ba78a' },
      { type: 'map', icon: IconMap, label: 'Map', color: '#5a9b7b' },
      { type: 'testimonial', icon: IconQuote, label: 'Testimonial', color: '#7b8b9b' },
      { type: 'embed', icon: IconLayout2, label: 'Embed', color: '#9b8b7b' },
    ]
  }
]

export default function ComponentToolbox({ onAddComponent }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({ 'Layout': true, 'Content': true, 'Interactive': true, 'Dynamic': true })

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
        {componentLibrary.map((category) => {
          const isCategoryExpanded = expandedCategories[category.category]

          return (
            <div key={category.category} style={{ marginBottom: '12px' }}>
              {/* Category Header */}
              {isExpanded && (
                <div
                  onClick={() => setExpandedCategories(prev => ({
                    ...prev,
                    [category.category]: !prev[category.category]
                  }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 4px',
                    cursor: 'pointer',
                    marginBottom: '6px',
                    userSelect: 'none'
                  }}
                >
                  <IconChevronRight
                    size={12}
                    style={{
                      color: '#7a7a7a',
                      marginRight: '6px',
                      transform: isCategoryExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#7a7a7a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {category.category}
                  </span>
                </div>
              )}

              {/* Components in Category */}
              {(!isExpanded || isCategoryExpanded) && category.components.map((component) => {
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
    default:
      return {}
  }
}
