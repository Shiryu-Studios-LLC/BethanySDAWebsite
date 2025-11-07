import { IconLayoutColumns, IconPhoto, IconVideo, IconSquare, IconTypography, IconSeparator, IconClick, IconLayoutNavbar, IconCards, IconQuote, IconFrame, IconInfoCircle, IconPhotoPlus, IconStar, IconChevronDown, IconForms, IconMapPin, IconClock } from '@tabler/icons-react'

export const BLOCK_TEMPLATES = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: IconLayoutNavbar,
    category: 'Containers',
    template: {
      type: 'hero',
      content: {
        title: 'Welcome to Our Church',
        subtitle: 'Join us for worship, fellowship, and community',
        buttonText: 'Learn More',
        buttonUrl: '/about',
        backgroundType: 'color', // 'color', 'image', 'video', or 'gradient'
        backgroundColor: '#0054a6',
        backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: '',
        backgroundVideo: '',
        spacing: { marginTop: 0, marginBottom: 16, paddingTop: 80, paddingBottom: 80 }
      }
    }
  },
  {
    id: 'heading',
    name: 'Heading',
    icon: IconTypography,
    category: 'Content',
    template: {
      type: 'heading',
      content: {
        text: 'Section Heading',
        level: 2,
        align: 'left'
      }
    }
  },
  {
    id: 'text',
    name: 'Text Block',
    icon: IconTypography,
    category: 'Content',
    template: {
      type: 'text',
      content: {
        html: '<p>Add your text content here. You can format it with bold, italic, and more.</p>'
      }
    }
  },
  {
    id: 'image',
    name: 'Image',
    icon: IconPhoto,
    category: 'Media',
    template: {
      type: 'image',
      content: {
        url: '',
        alt: '',
        caption: ''
      }
    }
  },
  {
    id: 'video',
    name: 'YouTube Video',
    icon: IconVideo,
    category: 'Media',
    template: {
      type: 'video',
      content: {
        youtubeId: ''
      }
    }
  },
  {
    id: 'button',
    name: 'Button',
    icon: IconClick,
    category: 'Interactive',
    template: {
      type: 'button',
      content: {
        text: 'Click Here',
        url: '#',
        style: 'primary',
        size: 'md'
      }
    }
  },
  {
    id: 'columns-2',
    name: '2 Columns',
    icon: IconLayoutColumns,
    category: 'Containers',
    template: {
      type: 'columns',
      content: {
        columnCount: 2,
        columns: [
          { blocks: [] },
          { blocks: [] }
        ]
      }
    }
  },
  {
    id: 'columns-3',
    name: '3 Columns',
    icon: IconLayoutColumns,
    category: 'Containers',
    template: {
      type: 'columns',
      content: {
        columnCount: 3,
        columns: [
          { blocks: [] },
          { blocks: [] },
          { blocks: [] }
        ]
      }
    }
  },
  {
    id: 'card',
    name: 'Feature Card',
    icon: IconCards,
    category: 'Content',
    template: {
      type: 'card',
      content: {
        title: 'Feature Title',
        description: 'Feature description goes here',
        icon: '🌟',
        linkText: 'Learn More',
        linkUrl: '#'
      }
    }
  },
  {
    id: 'quote',
    name: 'Quote',
    icon: IconQuote,
    category: 'Content',
    template: {
      type: 'quote',
      content: {
        quote: 'Enter your quote or testimonial here...',
        author: 'Author Name',
        role: 'Role or Title'
      }
    }
  },
  {
    id: 'embed',
    name: 'Embed/Iframe',
    icon: IconFrame,
    category: 'Media',
    template: {
      type: 'embed',
      content: {
        embedCode: '',
        height: 400
      }
    }
  },
  {
    id: 'callout',
    name: 'Callout Box',
    icon: IconInfoCircle,
    category: 'Content',
    template: {
      type: 'callout',
      content: {
        title: 'Important Notice',
        message: 'Your callout message here',
        style: 'info' // info, success, warning, danger
      }
    }
  },
  {
    id: 'rows-2',
    name: '2 Rows',
    icon: IconLayoutColumns,
    category: 'Containers',
    template: {
      type: 'rows',
      content: {
        rowCount: 2,
        rows: [
          { blocks: [] },
          { blocks: [] }
        ]
      }
    }
  },
  {
    id: 'rows-3',
    name: '3 Rows',
    icon: IconLayoutColumns,
    category: 'Containers',
    template: {
      type: 'rows',
      content: {
        rowCount: 3,
        rows: [
          { blocks: [] },
          { blocks: [] },
          { blocks: [] }
        ]
      }
    }
  },
  {
    id: 'gallery',
    name: 'Image Gallery',
    icon: IconPhotoPlus,
    category: 'Media',
    template: {
      type: 'gallery',
      content: {
        images: [
          { url: '', alt: '', caption: '' },
          { url: '', alt: '', caption: '' },
          { url: '', alt: '', caption: '' }
        ],
        columns: 3,
        spacing: 8
      }
    }
  },
  {
    id: 'section',
    name: 'Section Container',
    icon: IconLayoutNavbar,
    category: 'Containers',
    template: {
      type: 'section',
      content: {
        blocks: [],
        backgroundColor: '#1a1d2e',
        backgroundImage: '',
        paddingTop: 40,
        paddingBottom: 40,
        fullWidth: false
      }
    }
  },
  {
    id: 'icon-list',
    name: 'Icon List',
    icon: IconStar,
    category: 'Content',
    template: {
      type: 'icon-list',
      content: {
        items: [
          { icon: '✓', title: 'Feature 1', description: 'Description here' },
          { icon: '✓', title: 'Feature 2', description: 'Description here' },
          { icon: '✓', title: 'Feature 3', description: 'Description here' }
        ]
      }
    }
  },
  {
    id: 'accordion',
    name: 'Accordion/FAQ',
    icon: IconChevronDown,
    category: 'Interactive',
    template: {
      type: 'accordion',
      content: {
        items: [
          { title: 'Question 1', content: 'Answer 1' },
          { title: 'Question 2', content: 'Answer 2' },
          { title: 'Question 3', content: 'Answer 3' }
        ]
      }
    }
  },
  {
    id: 'form',
    name: 'Contact Form',
    icon: IconForms,
    category: 'Interactive',
    template: {
      type: 'form',
      content: {
        title: 'Get In Touch',
        fields: [
          { type: 'text', label: 'Name', required: true },
          { type: 'email', label: 'Email', required: true },
          { type: 'textarea', label: 'Message', required: true }
        ],
        submitText: 'Send Message',
        submitUrl: '/api/contact'
      }
    }
  },
  {
    id: 'map',
    name: 'Map',
    icon: IconMapPin,
    category: 'Media',
    template: {
      type: 'map',
      content: {
        embedCode: '',
        height: 400,
        address: ''
      }
    }
  },
  {
    id: 'countdown',
    name: 'Countdown Timer',
    icon: IconClock,
    category: 'Interactive',
    template: {
      type: 'countdown',
      content: {
        title: 'Event Starts In',
        targetDate: '',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true
      }
    }
  },
  {
    id: 'spacer',
    name: 'Spacer',
    icon: IconSquare,
    category: 'Decorative',
    template: {
      type: 'spacer',
      content: {
        height: 40
      }
    }
  },
  {
    id: 'divider',
    name: 'Divider',
    icon: IconSeparator,
    category: 'Decorative',
    template: {
      type: 'divider',
      content: {
        thickness: 1,
        color: '#dee2e6'
      }
    }
  }
]

export default function BlockLibrary({ onAddBlock, compact = false }) {
  const categories = ['Containers', 'Content', 'Media', 'Interactive', 'Decorative']

  // Show all categories in all modes
  const filteredCategories = categories

  return (
    <div className="block-library">
      {!compact && (
        <div className="p-3 border-bottom bg-light">
          <h5 className="mb-0">Add Blocks</h5>
          <small className="text-muted">Click to add, drag to reorder</small>
        </div>
      )}

      {filteredCategories.map(category => {
        const categoryBlocks = BLOCK_TEMPLATES.filter(b => b.category === category)
        if (categoryBlocks.length === 0) return null

        return (
          <div key={category} className={compact ? 'mb-3' : 'p-3 border-bottom'}>
            <h6 className="text-muted text-uppercase small mb-2">{category}</h6>
            <div className="d-flex flex-wrap gap-2">
              {categoryBlocks.map(block => {
                const Icon = block.icon
                return (
                  <button
                    key={block.id}
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => onAddBlock(block.template)}
                    title={block.name}
                    style={{ width: compact ? '100%' : 'calc(50% - 4px)' }}
                  >
                    <Icon size={16} className="me-1" />
                    <span className="small">{block.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
