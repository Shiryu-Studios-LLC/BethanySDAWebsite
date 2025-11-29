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
  IconX,
  IconChevronDown,
  IconLayersLinked
} from '@tabler/icons-react'

// Available component types organized by category
const componentLibrary = [
  {
    category: 'Layout',
    components: [
      { type: 'hero', icon: IconHeading, label: 'Hero', color: '#58a6ff' },
      { type: 'section', icon: IconBoxMultiple, label: 'Section', color: '#79c0ff' },
      { type: 'two-column', icon: IconColumns, label: 'Two Column', color: '#a5d6ff' },
      { type: 'three-column', icon: IconLayoutGrid, label: 'Three Column', color: '#79c0ff' },
      { type: 'card-grid', icon: IconLayoutGrid, label: 'Card Grid', color: '#a5d6ff' },
      { type: 'divider', icon: IconSeparator, label: 'Divider', color: '#7d8590' },
      { type: 'spacer', icon: IconSeparator, label: 'Spacer', color: '#6e7681' },
    ]
  },
  {
    category: 'Content',
    components: [
      { type: 'heading', icon: IconHeading, label: 'Heading', color: '#d29922' },
      { type: 'text', icon: IconTextSize, label: 'Text', color: '#f0883e' },
      { type: 'html', icon: IconCode, label: 'HTML', color: '#db6d28' },
      { type: 'image', icon: IconPhoto, label: 'Image', color: '#a371f7' },
      { type: 'image-text', icon: IconPhotoPlus, label: 'Image + Text', color: '#b083f0' },
      { type: 'gallery', icon: IconLayoutGrid, label: 'Gallery', color: '#bc8cff' },
      { type: 'video', icon: IconVideo, label: 'Video', color: '#d2a8ff' },
      { type: 'youtube', icon: IconBrandYoutube, label: 'YouTube', color: '#ff4444' },
      { type: 'bulletin', icon: IconFileDescription, label: 'Bulletin', color: '#d2a8ff' },
    ]
  },
  {
    category: 'Interactive',
    components: [
      { type: 'button', icon: IconClick, label: 'Button', color: '#3fb950' },
      { type: 'cta', icon: IconClick, label: 'CTA Banner', color: '#56d364' },
      { type: 'contact-form', icon: IconMail, label: 'Contact Form', color: '#7ee787' },
      { type: 'accordion', icon: IconListDetails, label: 'Accordion', color: '#4ac26b' },
      { type: 'tabs', icon: IconLayoutList, label: 'Tabs', color: '#2ea043' },
      { type: 'language-switcher', icon: IconLanguage, label: 'Language', color: '#39d353' },
    ]
  },
  {
    category: 'Dynamic',
    components: [
      { type: 'events-list', icon: IconCalendar, label: 'Events', color: '#f778ba' },
      { type: 'event-calendar', icon: IconCalendar, label: 'Calendar', color: '#f778ba' },
      { type: 'news-list', icon: IconNews, label: 'News', color: '#db61a2' },
      { type: 'blog-posts', icon: IconNews, label: 'Blog Posts', color: '#ea6045' },
      { type: 'sermon-list', icon: IconPlayerPlay, label: 'Sermons', color: '#f778ba' },
      { type: 'staff-grid', icon: IconUsers, label: 'Staff', color: '#ff7b72' },
      { type: 'countdown', icon: IconClock, label: 'Countdown', color: '#ff9492' },
      { type: 'map', icon: IconMap, label: 'Map', color: '#39d353' },
      { type: 'testimonial', icon: IconQuote, label: 'Testimonial', color: '#d29922' },
      { type: 'social-feed', icon: IconLayersLinked, label: 'Social Feed', color: '#58a6ff' },
      { type: 'embed', icon: IconLayout2, label: 'Embed', color: '#a371f7' },
    ]
  },
  {
    category: 'Navigation',
    components: [
      { type: 'breadcrumb', icon: IconLink, label: 'Breadcrumb', color: '#7d8590' },
      { type: 'menu', icon: IconLayoutBottombar, label: 'Menu', color: '#7d8590' },
      { type: 'link', icon: IconLink, label: 'Link', color: '#58a6ff' },
    ]
  }
]

export default function ComponentToolbox({ onAddComponent }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState({
    'Layout': true,
    'Content': true,
    'Interactive': true,
    'Dynamic': true,
    'Navigation': true
  })
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
        width: isExpanded ? '260px' : '48px',
        backgroundColor: '#161b22',
        borderRight: '1px solid #30363d',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      {/* Toolbox Header */}
      <div
        style={{
          height: '48px',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          cursor: 'pointer',
          flexShrink: 0
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconBoxMultiple size={18} style={{ color: '#58a6ff' }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#e6edf3' }}>
              Components
            </span>
          </div>
        )}
        <IconChevronRight
          size={16}
          style={{
            color: '#7d8590',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            margin: isExpanded ? '0' : '0 auto'
          }}
        />
      </div>

      {/* Search Bar */}
      {isExpanded && (
        <div style={{
          padding: '12px',
          borderBottom: '1px solid #30363d',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0d1117',
            borderRadius: '6px',
            padding: '8px 10px',
            border: '1px solid #30363d',
            transition: 'border-color 0.15s'
          }}>
            <IconSearch size={14} style={{ color: '#7d8590', marginRight: '8px', flexShrink: 0 }} />
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
                color: '#e6edf3',
                fontSize: '12px',
                minWidth: 0
              }}
            />
            {searchQuery && (
              <IconX
                size={14}
                style={{ color: '#7d8590', cursor: 'pointer', flexShrink: 0, marginLeft: '6px' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchQuery('')
                }}
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
          overflowX: 'hidden',
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
                    padding: '6px 8px',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    userSelect: 'none',
                    borderRadius: '6px',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(110, 118, 129, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {isCategoryExpanded ? (
                    <IconChevronDown size={12} style={{ color: '#7d8590', marginRight: '6px' }} />
                  ) : (
                    <IconChevronRight size={12} style={{ color: '#7d8590', marginRight: '6px' }} />
                  )}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#7d8590',
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
                      gap: '10px',
                      padding: isExpanded ? '10px 12px' : '8px',
                      marginBottom: '3px',
                      backgroundColor: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      cursor: 'grab',
                      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#161b22'
                      e.currentTarget.style.borderColor = component.color
                      e.currentTarget.style.transform = 'translateX(2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#0d1117'
                      e.currentTarget.style.borderColor = '#30363d'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: component.color + '15',
                        borderRadius: '6px',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} style={{ color: component.color }} />
                    </div>
                    {isExpanded && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#e6edf3',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.4'
                          }}
                        >
                          {component.label}
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            color: '#7d8590',
                            marginTop: '2px',
                            fontFamily: 'ui-monospace, SFMono-Regular, monospace'
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
