import { useEffect, useRef, useState } from 'react'
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconH1,
  IconH2,
  IconH3,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconLink,
  IconList,
  IconListNumbers
} from '@tabler/icons-react'

export default function FloatingTextToolbar({ isVisible, position, onFormat }) {
  const toolbarRef = useRef(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    if (isVisible && position && toolbarRef.current) {
      const toolbar = toolbarRef.current
      const rect = toolbar.getBoundingClientRect()

      let x = position.x
      let y = position.y - rect.height - 10 // Position above selection

      // Keep toolbar within viewport
      if (x + rect.width > window.innerWidth) {
        x = window.innerWidth - rect.width - 10
      }
      if (x < 10) {
        x = 10
      }
      if (y < 10) {
        y = position.y + 30 // Position below if no space above
      }

      setAdjustedPosition({ x, y })
    }
  }, [isVisible, position])

  if (!isVisible) return null

  const ToolbarButton = ({ icon: Icon, label, onClick, active }) => (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.()
      }}
      onMouseDown={(e) => e.preventDefault()}
      title={label}
      style={{
        background: active ? '#4a7ba7' : '#3a3a3a',
        border: '1px solid #4a4a4a',
        borderRadius: '3px',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e0e0e0',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!active) e.target.style.backgroundColor = '#4a4a4a'
      }}
      onMouseLeave={(e) => {
        if (!active) e.target.style.backgroundColor = '#3a3a3a'
      }}
    >
      <Icon size={16} />
    </button>
  )

  const Divider = () => (
    <div style={{
      width: '1px',
      height: '24px',
      backgroundColor: '#4a4a4a',
      margin: '0 4px'
    }} />
  )

  return (
    <div
      ref={toolbarRef}
      style={{
        position: 'fixed',
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        backgroundColor: '#2d2d2d',
        border: '1px solid #4a4a4a',
        borderRadius: '6px',
        padding: '6px',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        zIndex: 10000,
        animation: 'fadeIn 0.15s ease'
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Text Formatting */}
      <ToolbarButton icon={IconBold} label="Bold" onClick={() => onFormat?.('bold')} />
      <ToolbarButton icon={IconItalic} label="Italic" onClick={() => onFormat?.('italic')} />
      <ToolbarButton icon={IconUnderline} label="Underline" onClick={() => onFormat?.('underline')} />

      <Divider />

      {/* Headings */}
      <ToolbarButton icon={IconH1} label="Heading 1" onClick={() => onFormat?.('h1')} />
      <ToolbarButton icon={IconH2} label="Heading 2" onClick={() => onFormat?.('h2')} />
      <ToolbarButton icon={IconH3} label="Heading 3" onClick={() => onFormat?.('h3')} />

      <Divider />

      {/* Alignment */}
      <ToolbarButton icon={IconAlignLeft} label="Align Left" onClick={() => onFormat?.('alignLeft')} />
      <ToolbarButton icon={IconAlignCenter} label="Align Center" onClick={() => onFormat?.('alignCenter')} />
      <ToolbarButton icon={IconAlignRight} label="Align Right" onClick={() => onFormat?.('alignRight')} />

      <Divider />

      {/* Lists */}
      <ToolbarButton icon={IconList} label="Bullet List" onClick={() => onFormat?.('bulletList')} />
      <ToolbarButton icon={IconListNumbers} label="Numbered List" onClick={() => onFormat?.('numberedList')} />

      <Divider />

      {/* Link */}
      <ToolbarButton icon={IconLink} label="Insert Link" onClick={() => onFormat?.('link')} />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
