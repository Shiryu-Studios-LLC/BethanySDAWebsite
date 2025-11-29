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
  IconLayout2,
  IconBoxMultiple,
  IconNews,
  IconUsers,
  IconPlayerPlay,
  IconBrandYoutube,
  IconLink,
  IconClock,
  IconCode,
  IconLayoutList,
  IconPhotoPlus,
  IconLayoutBottombar,
  IconSearch,
  IconX
} from '@tabler/icons-react'

// Available component types organized by category
const componentLibrary = [
  {
    category: 'Layout',
    components: [
      { type: 'hero', icon: IconHeading, label: 'Hero', color: '#4a7ba7' },
      { type: 'section', icon: IconBoxMultiple, label: 'Section', color: '#5a8ba7' },
      { type: 'two-column', icon: IconColumns, label: 'Two Column', color: '#8a9b7b' },
      { type: 'three-column', icon: IconLayoutGrid, label: 'Three Column', color: '#7ba7a7' },
      { type: 'card-grid', icon: IconLayoutGrid, label: 'Card Grid', color: '#7ba7a7' },
      { type: 'divider', icon: IconSeparator, label: 'Divider', color: '#7a7a7a' },
      { type: 'spacer', icon: IconSeparator, label: 'Spacer', color: '#6a6a6a' },
    ]
  },
  {
    category: 'Content',
    components: [
      { type: 'heading', icon: IconHeading, label: 'Heading', color: '#4a7ba7' },
      { type: 'text', icon: IconTextSize, label: 'Text', color: '#5a9b5a' },
      { type: 'html', icon: IconCode, label: 'HTML', color: '#7b8ba7' },
      { type: 'image', icon: IconPhoto, label: 'Image', color: '#9b7ba7' },
      { type: 'image-text', icon: IconPhotoPlus, label: 'Image + Text', color: '#8b7ba7' },
      { type: 'gallery', icon: IconLayoutGrid, label: 'Gallery', color: '#7b9ba7' },
      { type: 'video', icon: IconVideo, label: 'Video', color: '#6a8ba7' },
      { type: 'youtube', icon: IconBrandYoutube, label: 'YouTube', color: '#ff0000' },
      { type: 'bulletin', icon: IconFileDescription, label: 'Bulletin', color: '#7b9b8b' },
    ]
  },
  {
    category: 'Interactive',
    components: [
      { type: 'button', icon: IconClick, label: 'Button', color: '#a77b7b' },
      { type: 'cta', icon: IconClick, label: 'CTA Banner', color: '#a77b7b' },
      { type: 'contact-form', icon: IconMail, label: 'Contact Form', color: '#9b7b7b' },
      { type: 'accordion', icon: IconListDetails, label: 'Accordion', color: '#8b7b9b' },
      { type: 'tabs', icon: IconLayoutList, label: 'Tabs', color: '#7b8b9b' },
      { type: 'language-switcher', icon: IconLanguage, label: 'Language', color: '#8a7ba7' },
    ]
  },
  {
    category: 'Dynamic',
    components: [
      { type: 'events-list', icon: IconCalendar, label: 'Events', color: '#7ba78a' },
      { type: 'event-calendar', icon: IconCalendar, label: 'Calendar', color: '#6ba78a' },
      { type: 'news-list', icon: IconNews, label: 'News', color: '#7ba79a' },
      { type: 'blog-posts', icon: IconNews, label: 'Blog Posts', color: '#8ba78a' },
      { type: 'sermon-list', icon: IconPlayerPlay, label: 'Sermons', color: '#9ba78a' },
      { type: 'staff-grid', icon: IconUsers, label: 'Staff', color: '#7b9b8a' },
      { type: 'countdown', icon: IconClock, label: 'Countdown', color: '#ab7b7b' },
      { type: 'map', icon: IconMap, label: 'Map', color: '#5a9b7b' },
      { type: 'testimonial', icon: IconQuote, label: 'Testimonial', color: '#7b8b9b' },
      { type: 'social-feed', icon: IconLink, label: 'Social Feed', color: '#8b7b9b' },
      { type: 'embed', icon: IconLayout2, label: 'Embed', color: '#9b8b7b' },
    ]
  },
  {
    category: 'Navigation',
    components: [
      { type: 'breadcrumb', icon: IconLink, label: 'Breadcrumb', color: '#7a8a9a' },
      { type: 'menu', icon: IconLayoutBottombar, label: 'Menu', color: '#6a7a8a' },
      { type: 'link', icon: IconLink, label: 'Link', color: '#5a6a7a' },
    ]
  }
]

export default function ComponentToolbox({ onAddComponent }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState({ 'Layout': true, 'Content': true, 'Interactive': true, 'Dynamic': true, 'Navigation': true })
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter components based on search
  const filteredLibrary = componentLibrary.map(category => ({
    ...category,
    components: category.components.filter(comp =>
      comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.components.length > 0)

  return (
    <div
      style={{
        width: isExpanded ? '240px' : '48px',
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
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#e0e0e0' }}>
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

      {/* Search Bar */}
      {isExpanded && (
        <div style={{ padding: '8px', borderBottom: '1px solid #3a3a3a' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1e1e1e',
            borderRadius: '4px',
            padding: '4px 8px',
            border: '1px solid #3a3a3a'
          }}>
            <IconSearch size={14} style={{ color: '#6a6a6a', marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e0e0e0',
                fontSize: '11px'
              }}
            />
            {searchQuery && (
              <IconX
                size={14}
                style={{ color: '#6a6a6a', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>
      )}

      {/* Component List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px'
        }}
      >
        {filteredLibrary.map((category) => {
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

    // New components
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
