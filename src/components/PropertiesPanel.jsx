import { useState, useRef, useEffect } from 'react'
import {
  IconChevronDown,
  IconChevronRight,
  IconBoxPadding,
  IconBorderOuter,
  IconPalette,
  IconDimensions,
  IconTypography,
  IconSettings,
  IconGripVertical,
  IconX
} from '@tabler/icons-react'
import ColorPicker from './ColorPicker'
import GradientPicker from './GradientPicker'

export default function PropertiesPanel({ block, blockIndex, onUpdate, isVisible }) {
  const [expandedSections, setExpandedSections] = useState({
    spacing: true,
    border: false,
    background: true,
    dimensions: false,
    typography: false
  })
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 })
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

  if (!isVisible || !block) {
    return null
  }

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const blockData = block.data || {}
  const spacing = blockData.spacing || {}
  const border = blockData.border || { style: 'none', width: 1, color: '#dee2e6', radius: 0 }

  const updateSpacing = (property, value) => {
    const newSpacing = { ...spacing, [property]: value }
    onUpdate(blockIndex, {
      ...blockData,
      spacing: newSpacing
    })
  }

  const updateBorder = (property, value) => {
    const newBorder = { ...border, [property]: value }
    onUpdate(blockIndex, {
      ...blockData,
      border: newBorder
    })
  }

  const updateBackground = (property, value) => {
    onUpdate(blockIndex, {
      ...blockData,
      [property]: value
    })
  }

  const updateDimension = (property, value) => {
    onUpdate(blockIndex, {
      ...blockData,
      [property]: value
    })
  }

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '340px',
        maxHeight: '80vh',
        backgroundColor: '#161b22',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #30363d',
        boxShadow: '0 16px 70px rgba(1, 4, 9, 0.8)',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Panel Header - Draggable */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #30363d',
          backgroundColor: '#1c2128',
          cursor: 'grab',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <IconGripVertical size={16} style={{ color: '#7d8590', opacity: 0.6 }} />
          <IconSettings size={18} style={{ color: '#58a6ff' }} />
          <h3 style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '600',
            color: '#e6edf3'
          }}>
            {block.type?.toUpperCase()} Properties
          </h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{
        maxHeight: 'calc(80vh - 56px)',
        overflowY: 'auto',
        backgroundColor: '#161b22'
      }}>
        {/* Spacing Section */}
        <CollapsibleSection
          title="Spacing"
          icon={IconBoxPadding}
          isExpanded={expandedSections.spacing}
          onToggle={() => toggleSection('spacing')}
        >
          <SpacingControls spacing={spacing} onUpdate={updateSpacing} />
        </CollapsibleSection>

        {/* Border Section */}
        <CollapsibleSection
          title="Border"
          icon={IconBorderOuter}
          isExpanded={expandedSections.border}
          onToggle={() => toggleSection('border')}
        >
          <BorderControls border={border} onUpdate={updateBorder} />
        </CollapsibleSection>

        {/* Background Section */}
        <CollapsibleSection
          title="Background"
          icon={IconPalette}
          isExpanded={expandedSections.background}
          onToggle={() => toggleSection('background')}
        >
          <BackgroundControls blockData={blockData} onUpdate={updateBackground} />
        </CollapsibleSection>

        {/* Dimensions Section */}
        <CollapsibleSection
          title="Dimensions"
          icon={IconDimensions}
          isExpanded={expandedSections.dimensions}
          onToggle={() => toggleSection('dimensions')}
        >
          <DimensionControls blockData={blockData} onUpdate={updateDimension} />
        </CollapsibleSection>

        {/* Typography Section - only for text blocks */}
        {(block.type === 'text' || block.type === 'heading' || block.type === 'hero') && (
          <CollapsibleSection
            title="Typography"
            icon={IconTypography}
            isExpanded={expandedSections.typography}
            onToggle={() => toggleSection('typography')}
          >
            <TypographyControls blockData={blockData} onUpdate={updateBackground} />
          </CollapsibleSection>
        )}
      </div>
    </div>
  )
}

// Collapsible Section Component
function CollapsibleSection({ title, icon: Icon, isExpanded, onToggle, children }) {
  return (
    <div style={{
      borderBottom: '1px solid #21262d'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'background-color 0.15s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1c2128'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {isExpanded ? (
          <IconChevronDown size={16} style={{ color: '#7d8590' }} />
        ) : (
          <IconChevronRight size={16} style={{ color: '#7d8590' }} />
        )}
        <Icon size={16} style={{ color: '#58a6ff' }} />
        <span style={{ color: '#e6edf3', fontSize: '13px', fontWeight: '500', flex: 1, textAlign: 'left' }}>
          {title}
        </span>
      </button>
      {isExpanded && (
        <div style={{ padding: '16px', paddingTop: '8px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Spacing Controls
function SpacingControls({ spacing, onUpdate }) {
  const SpacingInput = ({ label, property }) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{
        display: 'block',
        fontSize: '11px',
        color: '#7d8590',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '500'
      }}>
        {label}
      </label>
      <input
        type="text"
        value={spacing[property] || '0'}
        onChange={(e) => onUpdate(property, e.target.value)}
        placeholder="0px"
        style={{
          width: '100%',
          padding: '8px 10px',
          backgroundColor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '6px',
          color: '#e6edf3',
          fontSize: '13px',
          outline: 'none',
          transition: 'border-color 0.15s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
        onBlur={(e) => e.target.style.borderColor = '#30363d'}
      />
    </div>
  )

  return (
    <div>
      <div style={{
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #21262d'
      }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '12px',
          color: '#7d8590',
          fontWeight: '600'
        }}>
          Margin
        </h4>
        <SpacingInput label="Top" property="marginTop" />
        <SpacingInput label="Right" property="marginRight" />
        <SpacingInput label="Bottom" property="marginBottom" />
        <SpacingInput label="Left" property="marginLeft" />
      </div>
      <div>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '12px',
          color: '#7d8590',
          fontWeight: '600'
        }}>
          Padding
        </h4>
        <SpacingInput label="Top" property="paddingTop" />
        <SpacingInput label="Right" property="paddingRight" />
        <SpacingInput label="Bottom" property="paddingBottom" />
        <SpacingInput label="Left" property="paddingLeft" />
      </div>
    </div>
  )
}

// Border Controls
function BorderControls({ border, onUpdate }) {
  return (
    <div>
      {/* Border Style */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Style
        </label>
        <select
          value={border.style || 'none'}
          onChange={(e) => onUpdate('style', e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
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
              fontSize: '11px',
              color: '#7d8590',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '500'
            }}>
              <span>Width</span>
              <span style={{ color: '#e6edf3', fontWeight: '600' }}>{border.width || 1}px</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={border.width || 1}
              onChange={(e) => onUpdate('width', parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#58a6ff'
              }}
            />
          </div>

          {/* Border Color */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: '#7d8590',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '500'
            }}>
              Color
            </label>
            <ColorPicker
              color={border.color || '#dee2e6'}
              onChange={(color) => onUpdate('color', color)}
            />
          </div>

          {/* Border Radius */}
          <div>
            <label style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#7d8590',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '500'
            }}>
              <span>Radius</span>
              <span style={{ color: '#e6edf3', fontWeight: '600' }}>{border.radius || 0}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={border.radius || 0}
              onChange={(e) => onUpdate('radius', parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#58a6ff'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

// Background Controls
function BackgroundControls({ blockData, onUpdate }) {
  const [backgroundType, setBackgroundType] = useState(() => {
    // Detect if current background is a gradient
    const bg = blockData.backgroundColor || blockData.backgroundImage || ''
    if (bg.includes('gradient')) {
      return 'gradient'
    }
    return 'color'
  })

  const handleBackgroundChange = (value) => {
    if (backgroundType === 'gradient') {
      onUpdate('backgroundImage', value)
      onUpdate('backgroundColor', 'transparent')
    } else {
      onUpdate('backgroundColor', value)
      onUpdate('backgroundImage', '')
    }
  }

  return (
    <div>
      {/* Background Type Toggle */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Type
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setBackgroundType('color')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: backgroundType === 'color' ? '#58a6ff' : '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: backgroundType === 'color' ? '#ffffff' : '#e6edf3',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Solid
          </button>
          <button
            onClick={() => setBackgroundType('gradient')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: backgroundType === 'gradient' ? '#58a6ff' : '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: backgroundType === 'gradient' ? '#ffffff' : '#e6edf3',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Color or Gradient Picker */}
      {backgroundType === 'color' ? (
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            color: '#7d8590',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}>
            Color
          </label>
          <ColorPicker
            color={blockData.backgroundColor || 'transparent'}
            onChange={handleBackgroundChange}
          />
        </div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <GradientPicker
            value={blockData.backgroundImage || 'linear-gradient(90deg, #4a7ba7 0%, #7ba74a 100%)'}
            onChange={handleBackgroundChange}
          />
        </div>
      )}

      {/* Background Image URL (for actual images) */}
      {backgroundType === 'color' && (
        <div>
          <label style={{
            display: 'block',
            fontSize: '11px',
            color: '#7d8590',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}>
            Image URL
          </label>
          <input
            type="text"
            value={blockData.backgroundImage || ''}
            onChange={(e) => onUpdate('backgroundImage', e.target.value)}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '8px 10px',
              backgroundColor: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#e6edf3',
              fontSize: '12px',
              outline: 'none',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              transition: 'border-color 0.15s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
            onBlur={(e) => e.target.style.borderColor = '#30363d'}
          />
        </div>
      )}
    </div>
  )
}

// Dimension Controls
function DimensionControls({ blockData, onUpdate }) {
  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Width
        </label>
        <input
          type="text"
          value={blockData.width || 'auto'}
          onChange={(e) => onUpdate('width', e.target.value)}
          placeholder="auto"
          style={{
            width: '100%',
            padding: '8px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.15s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
      </div>
      <div style={{ marginBottom: '14px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Height
        </label>
        <input
          type="text"
          value={blockData.height || 'auto'}
          onChange={(e) => onUpdate('height', e.target.value)}
          placeholder="auto"
          style={{
            width: '100%',
            padding: '8px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.15s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
      </div>
      <div>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Max Width
        </label>
        <input
          type="text"
          value={blockData.maxWidth || 'none'}
          onChange={(e) => onUpdate('maxWidth', e.target.value)}
          placeholder="none"
          style={{
            width: '100%',
            padding: '8px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.15s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
      </div>
    </div>
  )
}

// Typography Controls
function TypographyControls({ blockData, onUpdate }) {
  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Font Size
        </label>
        <input
          type="text"
          value={blockData.fontSize || 'inherit'}
          onChange={(e) => onUpdate('fontSize', e.target.value)}
          placeholder="16px"
          style={{
            width: '100%',
            padding: '8px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.15s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.target.style.borderColor = '#30363d'}
        />
      </div>
      <div style={{ marginBottom: '14px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Font Weight
        </label>
        <select
          value={blockData.fontWeight || 'normal'}
          onChange={(e) => onUpdate('fontWeight', e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            backgroundColor: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            color: '#e6edf3',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi-Bold</option>
          <option value="700">Bold</option>
        </select>
      </div>
      <div>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#7d8590',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500'
        }}>
          Text Color
        </label>
        <ColorPicker
          color={blockData.color || '#e0e0e0'}
          onChange={(color) => onUpdate('color', color)}
        />
      </div>
    </div>
  )
}
