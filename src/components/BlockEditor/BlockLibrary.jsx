import { IconLayoutColumns, IconPhoto, IconVideo, IconSquare, IconTypography, IconSeparator, IconClick, IconLayoutNavbar } from '@tabler/icons-react'

export const BLOCK_TEMPLATES = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: IconLayoutNavbar,
    category: 'Layout',
    template: {
      type: 'hero',
      content: {
        title: 'Welcome to Our Church',
        subtitle: 'Join us for worship, fellowship, and community',
        buttonText: 'Learn More',
        buttonUrl: '/about'
      }
    }
  },
  {
    id: 'heading',
    name: 'Heading',
    icon: IconTypography,
    category: 'Text',
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
    category: 'Text',
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
    category: 'Elements',
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
    id: 'columns',
    name: '2 Columns',
    icon: IconLayoutColumns,
    category: 'Layout',
    template: {
      type: 'columns',
      content: {
        columns: [
          { html: '<p>Column 1 content</p>' },
          { html: '<p>Column 2 content</p>' }
        ]
      }
    }
  },
  {
    id: 'spacer',
    name: 'Spacer',
    icon: IconSquare,
    category: 'Layout',
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
    category: 'Elements',
    template: {
      type: 'divider',
      content: {
        thickness: 1,
        color: '#dee2e6'
      }
    }
  }
]

export default function BlockLibrary({ onAddBlock }) {
  const categories = ['Layout', 'Text', 'Media', 'Elements']

  return (
    <div className="block-library">
      <div className="p-3 border-bottom bg-light">
        <h5 className="mb-0">Add Blocks</h5>
        <small className="text-muted">Click to add, drag to reorder</small>
      </div>

      {categories.map(category => {
        const categoryBlocks = BLOCK_TEMPLATES.filter(b => b.category === category)
        if (categoryBlocks.length === 0) return null

        return (
          <div key={category} className="p-3 border-bottom">
            <h6 className="text-muted text-uppercase small mb-2">{category}</h6>
            <div className="d-grid gap-2">
              {categoryBlocks.map(block => {
                const Icon = block.icon
                return (
                  <button
                    key={block.id}
                    className="btn btn-outline-secondary text-start d-flex align-items-center gap-2"
                    onClick={() => onAddBlock(block.template)}
                  >
                    <Icon size={20} />
                    {block.name}
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
