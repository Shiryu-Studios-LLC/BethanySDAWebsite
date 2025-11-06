import { useState } from 'react'
import {
  IconChevronDown,
  IconChevronRight,
  IconFileText,
  IconBoxMultiple,
  IconPhoto,
  IconQuote,
  IconVideo,
  IconCursor,
  IconLayoutGrid,
  IconSeparator,
  IconSpace,
  IconAlertCircle,
  IconCode,
  IconH1,
  IconPhotoPlus,
  IconLayoutNavbar,
  IconStar,
  IconChevronDownLeft,
  IconForms,
  IconMapPin,
  IconClock
} from '@tabler/icons-react'

const BLOCK_ICONS = {
  hero: IconCursor,
  heading: IconH1,
  text: IconFileText,
  image: IconPhoto,
  video: IconVideo,
  button: IconCursor,
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
  accordion: IconChevronDownLeft,
  form: IconForms,
  map: IconMapPin,
  countdown: IconClock
}

function HierarchyItem({ block, level = 0, isSelected, onSelect, expandedBlocks, toggleExpand }) {
  const Icon = BLOCK_ICONS[block.type] || IconFileText
  const hasChildren = block.type === 'columns' && block.content.columns && block.content.columns.some(col => col.blocks && col.blocks.length > 0)
  const isExpanded = expandedBlocks.has(block.id)

  const getBlockLabel = (block) => {
    switch (block.type) {
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
        onClick={() => onSelect(block.id)}
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

export default function HierarchyPanel({ blocks, selectedBlock, onSelectBlock, width }) {
  const [expandedBlocks, setExpandedBlocks] = useState(new Set())

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
          padding: '0 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#cbcbcb'
        }}
      >
        Hierarchy
      </div>

      {/* Block List */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {blocks.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6a6a6a', fontSize: '12px' }}>
            No blocks yet
          </div>
        ) : (
          blocks.map(block => (
            <HierarchyItem
              key={block.id}
              block={block}
              level={0}
              isSelected={selectedBlock?.id === block.id}
              onSelect={onSelectBlock}
              expandedBlocks={expandedBlocks}
              toggleExpand={toggleExpand}
            />
          ))
        )}
      </div>
    </div>
  )
}
