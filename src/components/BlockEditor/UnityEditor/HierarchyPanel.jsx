import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconChevronDown,
  IconChevronRight,
  IconFileText,
  IconBoxMultiple,
  IconPhoto,
  IconQuote,
  IconVideo,
  IconPointer,
  IconLayoutGrid,
  IconSeparator,
  IconSpace,
  IconAlertCircle,
  IconCode,
  IconH1,
  IconPhotoPlus,
  IconLayoutNavbar,
  IconStar,
  IconChevronDown as IconChevronDownAlt,
  IconForms,
  IconMapPin,
  IconClock,
  IconGripVertical,
  IconSearch,
  IconPlus,
  IconEye,
  IconEyeOff,
  IconLock,
  IconLockOpen
} from '@tabler/icons-react'
import { BLOCK_TEMPLATES } from '../BlockLibrary'

const BLOCK_ICONS = {
  navbar: IconMapPin,
  hero: IconLayoutNavbar,
  heading: IconH1,
  text: IconFileText,
  image: IconPhoto,
  video: IconVideo,
  button: IconPointer,
  columns: IconLayoutGrid,
  rows: IconLayoutGrid,
  card: IconBoxMultiple,
  quote: IconQuote,
  embed: IconCode,
  callout: IconAlertCircle,
  spacer: IconSpace,
  divider: IconSeparator,
  gallery: IconPhotoPlus,
  section: IconLayoutNavbar,
  'icon-list': IconStar,
  accordion: IconChevronDownAlt,
  form: IconForms,
  map: IconMapPin,
  countdown: IconClock
}

function HierarchyItem({ block, level = 0, isSelected, onSelect, expandedBlocks, toggleExpand }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = BLOCK_ICONS[block.type] || IconFileText
  const hasChildren = block.type === 'columns' && block.content.columns && block.content.columns.some(col => col.blocks && col.blocks.length > 0)
  const isExpanded = expandedBlocks.has(block.id)

  const getBlockLabel = (block) => {
    switch (block.type) {
      case 'navbar':
        return block.content.brandName || 'Navigation Bar'
      case 'hero':
        return block.content.title || 'Hero Section'
      case 'heading':
        return block.content.text || 'Heading'
      case 'text':
        return 'Text Block'
      case 'image':
        return block.content.alt || 'Image'
      case 'video':
        return 'Video'
      case 'button':
        return block.content.text || 'Button'
      case 'columns':
        const colCount = block.content.columnCount || block.content.columns?.length || 2
        return `${colCount} Columns`
      case 'card':
        return block.content.title || 'Card'
      case 'quote':
        return block.content.author || 'Quote'
      case 'embed':
        return 'Embed'
      case 'callout':
        return block.content.title || 'Callout'
      case 'spacer':
        return `Spacer (${block.content.height}px)`
      case 'divider':
        return 'Divider'
      default:
        return block.type
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => onSelect(block.id)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            paddingLeft: `${8 + level * 16}px`,
            cursor: 'pointer',
            backgroundColor: isSelected ? '#3a3a3a' : 'transparent',
            color: isSelected ? '#fff' : '#cbcbcb',
            fontSize: '12px',
            borderBottom: '1px solid #2a2a2a',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = '#333333'
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {/* Drag Handle */}
          <span
            {...attributes}
            {...listeners}
            style={{ marginRight: '4px', cursor: 'grab', display: 'flex', alignItems: 'center', opacity: 0.4 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.8 }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.4 }}
          >
            <IconGripVertical size={12} />
          </span>

          {hasChildren && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(block.id)
              }}
              style={{ marginRight: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {isExpanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
            </span>
          )}
          {!hasChildren && <span style={{ width: '16px', display: 'inline-block' }}></span>}
          <Icon size={14} style={{ marginRight: '6px', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {getBlockLabel(block)}
          </span>
        </div>
      </div>

      {/* Render nested blocks in columns */}
      {hasChildren && isExpanded && block.content.columns.map((col, colIdx) => (
        <div key={colIdx}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 8px',
              paddingLeft: `${8 + (level + 1) * 16}px`,
              color: '#8a8a8a',
              fontSize: '11px',
              borderBottom: '1px solid #2a2a2a',
              fontStyle: 'italic'
            }}
          >
            <IconLayoutGrid size={12} style={{ marginRight: '6px' }} />
            Column {colIdx + 1}
          </div>
          {col.blocks && col.blocks.map(nestedBlock => (
            <HierarchyItem
              key={nestedBlock.id}
              block={nestedBlock}
              level={level + 2}
              isSelected={isSelected}
              onSelect={onSelect}
              expandedBlocks={expandedBlocks}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      ))}
    </>
  )
}

export default function HierarchyPanel({ blocks, selectedBlock, onSelectBlock, width, onReorderBlocks, onAddBlock }) {
  const [expandedBlocks, setExpandedBlocks] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [blockStates, setBlockStates] = useState({}) // { blockId: { hidden: false, locked: false } }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Filter blocks by search
  const filteredBlocks = searchQuery
    ? blocks.filter(block => {
        const label = getBlockLabel(block).toLowerCase()
        return label.includes(searchQuery.toLowerCase())
      })
    : blocks

  // Filter templates for add menu
  const filteredTemplates = searchQuery
    ? BLOCK_TEMPLATES.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : BLOCK_TEMPLATES

  const getBlockLabel = (block) => {
    switch (block.type) {
      case 'navbar':
        return block.content?.brandName || 'Navigation Bar'
      case 'hero':
        return block.content?.title || 'Hero Section'
      case 'heading':
        return block.content?.text || 'Heading'
      case 'text':
        return 'Text Block'
      case 'image':
        return block.content?.alt || 'Image'
      case 'video':
        return 'Video'
      case 'button':
        return block.content?.text || 'Button'
      case 'columns':
        const colCount = block.content?.columnCount || block.content?.columns?.length || 2
        return `${colCount} Columns`
      case 'card':
        return block.content?.title || 'Card'
      case 'quote':
        return block.content?.author || 'Quote'
      case 'embed':
        return 'Embed'
      case 'callout':
        return block.content?.title || 'Callout'
      case 'spacer':
        return `Spacer (${block.content?.height}px)`
      case 'divider':
        return 'Divider'
      default:
        return block.type
    }
  }

  const toggleBlockVisibility = (blockId) => {
    setBlockStates(prev => ({
      ...prev,
      [blockId]: { ...prev[blockId], hidden: !prev[blockId]?.hidden }
    }))
  }

  const toggleBlockLock = (blockId) => {
    setBlockStates(prev => ({
      ...prev,
      [blockId]: { ...prev[blockId], locked: !prev[blockId]?.locked }
    }))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex(b => b.id === active.id)
    const newIndex = blocks.findIndex(b => b.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex)
      onReorderBlocks(reorderedBlocks)
    }
  }

  const toggleExpand = (blockId) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(blockId)) {
        newSet.delete(blockId)
      } else {
        newSet.add(blockId)
      }
      return newSet
    })
  }

  return (
    <div
      className="hierarchy-panel"
      style={{
        width: `${width}px`,
        backgroundColor: '#2b2b2b',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          height: '28px',
          backgroundColor: '#323232',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#cbcbcb'
        }}
      >
        <span>Layers</span>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbcbcb',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Add Block"
        >
          <IconPlus size={16} />
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '8px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1a1a1a',
          borderRadius: '4px',
          padding: '4px 8px'
        }}>
          <IconSearch size={14} style={{ color: '#6a6a6a', marginRight: '4px' }} />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#cbcbcb',
              fontSize: '12px',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Add Block Menu */}
      {showAddMenu && onAddBlock && (
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          borderBottom: '1px solid #1a1a1a',
          backgroundColor: '#1e1e1e'
        }}>
          <div style={{ padding: '4px' }}>
            {filteredTemplates.map(template => {
              const Icon = template.icon
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    const newBlock = {
                      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      ...template.template
                    }
                    onAddBlock(newBlock)
                    setShowAddMenu(false)
                    setSearchQuery('')
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#cbcbcb',
                    fontSize: '11px',
                    cursor: 'pointer',
                    borderRadius: '3px',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  <span>{template.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Block List */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {filteredBlocks.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6a6a6a', fontSize: '12px' }}>
            {searchQuery ? 'No blocks found' : 'No blocks yet'}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {filteredBlocks.map(block => (
                <HierarchyItem
                  key={block.id}
                  block={block}
                  level={0}
                  isSelected={selectedBlock?.id === block.id}
                  onSelect={onSelectBlock}
                  expandedBlocks={expandedBlocks}
                  toggleExpand={toggleExpand}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
