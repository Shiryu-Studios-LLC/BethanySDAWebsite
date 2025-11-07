import { useState } from 'react'
import {
  IconChevronDown,
  IconChevronRight,
  IconBoxPadding,
  IconBorderOuter,
  IconPalette,
  IconDimensions,
  IconTypography,
  IconSettings
} from '@tabler/icons-react'
import ColorPicker from './ColorPicker'

export default function PropertiesPanel({ block, blockIndex, onUpdate, isVisible }) {
  const [expandedSections, setExpandedSections] = useState({
    spacing: true,
    border: true,
    background: true,
    dimensions: false,
    typography: false
  })

  if (!isVisible || !block) {
    return null
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
    <div style={{
      backgroundColor: '#252525',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1px solid #3a3a3a'
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #3a3a3a',
        backgroundColor: '#2d2d2d'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <IconSettings size={16} style={{ color: '#4a7ba7' }} />
          <h3 style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: '600',
            color: '#e0e0e0'
          }}>
            {block.type?.toUpperCase()} Properties
          </h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div>
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
      borderBottom: '1px solid #3a3a3a'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.15s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d2d2d'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {isExpanded ? (
          <IconChevronDown size={16} style={{ color: '#999' }} />
        ) : (
          <IconChevronRight size={16} style={{ color: '#999' }} />
        )}
        <Icon size={16} style={{ color: '#999' }} />
        <span style={{ color: '#e0e0e0', fontSize: '13px', fontWeight: '500' }}>
          {title}
        </span>
      </button>
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Spacing Controls
function SpacingControls({ spacing, onUpdate }) {
  const SpacingInput = ({ label, property }) => (
    <div style={{ marginBottom: '12px' }}>
      <label style={{
        display: 'block',
        fontSize: '11px',
        color: '#a0a0a0',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
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
          padding: '6px 8px',
          backgroundColor: '#1e1e1e',
          border: '1px solid #3a3a3a',
          borderRadius: '3px',
          color: '#e0e0e0',
          fontSize: '12px'
        }}
      />
    </div>
  )

  return (
    <div>
      <div style={{
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #3a3a3a'
      }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '12px',
          color: '#7a7a7a',
          fontWeight: '500'
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
          color: '#7a7a7a',
          fontWeight: '500'
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
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Style
        </label>
        <select
          value={border.style || 'none'}
          onChange={(e) => onUpdate('style', e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
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
              color: '#a0a0a0',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span>Width</span>
              <span>{border.width || 1}px</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={border.width || 1}
              onChange={(e) => onUpdate('width', parseInt(e.target.value))}
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
              fontSize: '11px',
              color: '#a0a0a0',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
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
              color: '#a0a0a0',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <span>Radius</span>
              <span>{border.radius || 0}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={border.radius || 0}
              onChange={(e) => onUpdate('radius', parseInt(e.target.value))}
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

// Background Controls
function BackgroundControls({ blockData, onUpdate }) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Background Color
        </label>
        <ColorPicker
          color={blockData.backgroundColor || 'transparent'}
          onChange={(color) => onUpdate('backgroundColor', color)}
        />
      </div>
      <div>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Background Image URL
        </label>
        <input
          type="text"
          value={blockData.backgroundImage || ''}
          onChange={(e) => onUpdate('backgroundImage', e.target.value)}
          placeholder="https://..."
          style={{
            width: '100%',
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
          }}
        />
      </div>
    </div>
  )
}

// Dimension Controls
function DimensionControls({ blockData, onUpdate }) {
  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
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
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
          }}
        />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
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
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
          }}
        />
      </div>
      <div>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
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
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
          }}
        />
      </div>
    </div>
  )
}

// Typography Controls
function TypographyControls({ blockData, onUpdate }) {
  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
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
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
          }}
        />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          fontSize: '11px',
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Font Weight
        </label>
        <select
          value={blockData.fontWeight || 'normal'}
          onChange={(e) => onUpdate('fontWeight', e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            color: '#e0e0e0',
            fontSize: '12px'
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
          color: '#a0a0a0',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
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
