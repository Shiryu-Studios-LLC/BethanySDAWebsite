import { useState, useEffect, useRef } from 'react'
import { IconBoxPadding, IconBoxMargin, IconX, IconGripVertical } from '@tabler/icons-react'

export default function SpacingControl({ isVisible, block, blockIndex, onUpdate, onClose }) {
  const [spacing, setSpacing] = useState({
    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '0',
    paddingTop: '0',
    paddingRight: '0',
    paddingBottom: '0',
    paddingLeft: '0'
  })
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef(null)

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  useEffect(() => {
    if (block?.data?.spacing) {
      setSpacing(block.data.spacing)
    } else {
      setSpacing({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0'
      })
    }
  }, [block])

  if (!isVisible) return null

  const handleMouseDown = (e) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleChange = (property, value) => {
    const newSpacing = { ...spacing, [property]: value }
    setSpacing(newSpacing)
    onUpdate?.(blockIndex, newSpacing)
  }

  const SpacingInput = ({ label, property, icon: Icon }) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{
        fontSize: '10px',
        color: '#8a8a8a',
        marginBottom: '4px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <input
        type="text"
        value={spacing[property]}
        onChange={(e) => handleChange(property, e.target.value)}
        placeholder="0px"
        style={{
          width: '100%',
          padding: '6px 8px',
          backgroundColor: '#1e1e1e',
          border: '1px solid #3a3a3a',
          borderRadius: '3px',
          color: '#e0e0e0',
          fontSize: '12px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = '#4a7ba7'}
        onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
      />
    </div>
  )

  const QuickPreset = ({ label, onClick }) => (
    <button
      onClick={onClick}
      style={{
        padding: '4px 8px',
        backgroundColor: '#3a3a3a',
        border: '1px solid #4a4a4a',
        borderRadius: '3px',
        color: '#e0e0e0',
        fontSize: '10px',
        cursor: 'pointer',
        flex: 1
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#4a4a4a'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#3a3a3a'}
    >
      {label}
    </button>
  )

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: '#2d2d2d',
        border: '1px solid #4a4a4a',
        borderRadius: '6px',
        padding: '16px',
        width: '280px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        zIndex: 9999,
        maxHeight: '80vh',
        overflowY: 'auto',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header - Draggable */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #3a3a3a',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <IconGripVertical size={14} style={{ color: '#7a7a7a' }} />
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#e0e0e0'
          }}>
            Spacing Controls
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#7a7a7a',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => e.target.style.color = '#e0e0e0'}
          onMouseLeave={(e) => e.target.style.color = '#7a7a7a'}
        >
          <IconX size={16} />
        </button>
      </div>

      {/* Margin Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#a0a0a0',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <IconBoxMargin size={14} />
          MARGIN
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <SpacingInput label="Top" property="marginTop" />
          <SpacingInput label="Right" property="marginRight" />
          <SpacingInput label="Bottom" property="marginBottom" />
          <SpacingInput label="Left" property="marginLeft" />
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          <QuickPreset
            label="None"
            onClick={() => {
              handleChange('marginTop', '0')
              handleChange('marginRight', '0')
              handleChange('marginBottom', '0')
              handleChange('marginLeft', '0')
            }}
          />
          <QuickPreset
            label="Small"
            onClick={() => {
              handleChange('marginTop', '8px')
              handleChange('marginRight', '8px')
              handleChange('marginBottom', '8px')
              handleChange('marginLeft', '8px')
            }}
          />
          <QuickPreset
            label="Medium"
            onClick={() => {
              handleChange('marginTop', '16px')
              handleChange('marginRight', '16px')
              handleChange('marginBottom', '16px')
              handleChange('marginLeft', '16px')
            }}
          />
          <QuickPreset
            label="Large"
            onClick={() => {
              handleChange('marginTop', '32px')
              handleChange('marginRight', '32px')
              handleChange('marginBottom', '32px')
              handleChange('marginLeft', '32px')
            }}
          />
        </div>
      </div>

      {/* Padding Section */}
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#a0a0a0',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <IconBoxPadding size={14} />
          PADDING
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <SpacingInput label="Top" property="paddingTop" />
          <SpacingInput label="Right" property="paddingRight" />
          <SpacingInput label="Bottom" property="paddingBottom" />
          <SpacingInput label="Left" property="paddingLeft" />
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          <QuickPreset
            label="None"
            onClick={() => {
              handleChange('paddingTop', '0')
              handleChange('paddingRight', '0')
              handleChange('paddingBottom', '0')
              handleChange('paddingLeft', '0')
            }}
          />
          <QuickPreset
            label="Small"
            onClick={() => {
              handleChange('paddingTop', '8px')
              handleChange('paddingRight', '8px')
              handleChange('paddingBottom', '8px')
              handleChange('paddingLeft', '8px')
            }}
          />
          <QuickPreset
            label="Medium"
            onClick={() => {
              handleChange('paddingTop', '16px')
              handleChange('paddingRight', '16px')
              handleChange('paddingBottom', '16px')
              handleChange('paddingLeft', '16px')
            }}
          />
          <QuickPreset
            label="Large"
            onClick={() => {
              handleChange('paddingTop', '32px')
              handleChange('paddingRight', '32px')
              handleChange('paddingBottom', '32px')
              handleChange('paddingLeft', '32px')
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
