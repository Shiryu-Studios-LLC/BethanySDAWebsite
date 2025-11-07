import { useState, useEffect, useRef } from 'react'
import { IconBorderOuter, IconX, IconGripVertical } from '@tabler/icons-react'
import ColorPicker from './ColorPicker'

export default function BorderControlPanel({ isVisible, block, blockIndex, onUpdate, onClose }) {
  const [border, setBorder] = useState({
    style: 'none',
    width: 1,
    color: '#dee2e6',
    radius: 0
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
    if (block?.data?.border) {
      setBorder(block.data.border)
    } else {
      setBorder({
        style: 'none',
        width: 1,
        color: '#dee2e6',
        radius: 0
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
    const newBorder = { ...border, [property]: value }
    setBorder(newBorder)
    onUpdate?.(blockIndex, { border: newBorder })
  }

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
            Border Controls
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

      {/* Border Style */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '10px',
          color: '#8a8a8a',
          marginBottom: '6px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          Style
        </label>
        <select
          value={border.style || 'none'}
          onChange={(e) => handleChange('style', e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4a7ba7'}
          onBlur={(e) => e.target.style.borderColor = '#3a3a3a'}
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
        </select>
      </div>

      {border.style !== 'none' && (
        <>
          {/* Border Width */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#8a8a8a',
              marginBottom: '6px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              <span>Width</span>
              <span>{border.width || 1}px</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={border.width || 1}
              onChange={(e) => handleChange('width', parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#4a7ba7'
              }}
            />
          </div>

          {/* Border Color */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#8a8a8a',
              marginBottom: '6px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              Color
            </label>
            <ColorPicker
              color={border.color || '#dee2e6'}
              onChange={(color) => handleChange('color', color)}
            />
          </div>

          {/* Border Radius */}
          <div>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#8a8a8a',
              marginBottom: '6px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              <span>Radius</span>
              <span>{border.radius || 0}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={border.radius || 0}
              onChange={(e) => handleChange('radius', parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#4a7ba7'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
