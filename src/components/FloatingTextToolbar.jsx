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
  IconListNumbers,
  IconChevronDown
} from '@tabler/icons-react'

const FONT_FAMILIES = [
  { name: 'Arial', value: 'Arial, sans-serif', category: 'web' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif', category: 'web' },
  { name: 'Times New Roman', value: '"Times New Roman", serif', category: 'web' },
  { name: 'Georgia', value: 'Georgia, serif', category: 'web' },
  { name: 'Courier New', value: '"Courier New", monospace', category: 'web' },
  { name: 'Verdana', value: 'Verdana, sans-serif', category: 'web' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif', category: 'web' },
  { name: 'Roboto', value: 'Roboto, sans-serif', category: 'google' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif', category: 'google' },
  { name: 'Lato', value: 'Lato, sans-serif', category: 'google' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'google' },
  { name: 'Playfair Display', value: '"Playfair Display", serif', category: 'google' }
]

const FONT_SIZES = [
  '10px', '12px', '14px', '16px', '18px', '20px',
  '24px', '28px', '32px', '36px', '48px', '64px'
]

export default function FloatingTextToolbar({ isVisible, position, onFormat }) {
  const toolbarRef = useRef(null)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const [showFontFamily, setShowFontFamily] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)
  const [selectedFont, setSelectedFont] = useState('Arial')
  const [selectedSize, setSelectedSize] = useState('16px')
  const [customSize, setCustomSize] = useState('')
  const fontFamilyRef = useRef(null)
  const fontSizeRef = useRef(null)

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontFamilyRef.current && !fontFamilyRef.current.contains(event.target)) {
        setShowFontFamily(false)
      }
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) {
        setShowFontSize(false)
      }
    }

    if (showFontFamily || showFontSize) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFontFamily, showFontSize])

  const handleFontFamilyChange = (font) => {
    setSelectedFont(font.name)
    setShowFontFamily(false)
    onFormat?.('fontFamily', font.value)
  }

  const handleFontSizeChange = (size) => {
    setSelectedSize(size)
    setShowFontSize(false)
    setCustomSize('')
    onFormat?.('fontSize', size)
  }

  const handleCustomSizeSubmit = (e) => {
    e.preventDefault()
    if (customSize && /^\d+$/.test(customSize)) {
      const size = `${customSize}px`
      setSelectedSize(size)
      setShowFontSize(false)
      onFormat?.('fontSize', size)
      setCustomSize('')
    }
  }

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

  const FontFamilyDropdown = () => (
    <div ref={fontFamilyRef} style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowFontFamily(!showFontFamily)
          setShowFontSize(false)
        }}
        onMouseDown={(e) => e.preventDefault()}
        title="Font Family"
        style={{
          background: showFontFamily ? '#4a7ba7' : '#3a3a3a',
          border: '1px solid #4a4a4a',
          borderRadius: '3px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#e0e0e0',
          fontSize: '12px',
          minWidth: '100px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (!showFontFamily) e.target.style.backgroundColor = '#4a4a4a'
        }}
        onMouseLeave={(e) => {
          if (!showFontFamily) e.target.style.backgroundColor = '#3a3a3a'
        }}
      >
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedFont}
        </span>
        <IconChevronDown size={14} />
      </button>

      {showFontFamily && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            backgroundColor: '#2d2d2d',
            border: '1px solid #4a7ba7',
            borderRadius: '4px',
            minWidth: '180px',
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            zIndex: 10001,
            animation: 'dropdownFadeIn 0.15s ease'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Web Fonts Section */}
          <div style={{ padding: '4px 0' }}>
            <div style={{
              padding: '4px 12px',
              fontSize: '10px',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Web Fonts
            </div>
            {FONT_FAMILIES.filter(f => f.category === 'web').map((font) => (
              <div
                key={font.name}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleFontFamilyChange(font)
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#e0e0e0',
                  fontSize: '13px',
                  fontFamily: font.value,
                  backgroundColor: selectedFont === font.name ? '#4a7ba7' : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedFont !== font.name) e.target.style.backgroundColor = '#3a3a3a'
                }}
                onMouseLeave={(e) => {
                  if (selectedFont !== font.name) e.target.style.backgroundColor = 'transparent'
                }}
              >
                {font.name}
              </div>
            ))}
          </div>

          {/* Google Fonts Section */}
          <div style={{ borderTop: '1px solid #4a4a4a', padding: '4px 0' }}>
            <div style={{
              padding: '4px 12px',
              fontSize: '10px',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Google Fonts
            </div>
            {FONT_FAMILIES.filter(f => f.category === 'google').map((font) => (
              <div
                key={font.name}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleFontFamilyChange(font)
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#e0e0e0',
                  fontSize: '13px',
                  fontFamily: font.value,
                  backgroundColor: selectedFont === font.name ? '#4a7ba7' : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedFont !== font.name) e.target.style.backgroundColor = '#3a3a3a'
                }}
                onMouseLeave={(e) => {
                  if (selectedFont !== font.name) e.target.style.backgroundColor = 'transparent'
                }}
              >
                {font.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const FontSizeDropdown = () => (
    <div ref={fontSizeRef} style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowFontSize(!showFontSize)
          setShowFontFamily(false)
        }}
        onMouseDown={(e) => e.preventDefault()}
        title="Font Size"
        style={{
          background: showFontSize ? '#4a7ba7' : '#3a3a3a',
          border: '1px solid #4a4a4a',
          borderRadius: '3px',
          padding: '6px 8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#e0e0e0',
          fontSize: '12px',
          minWidth: '60px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (!showFontSize) e.target.style.backgroundColor = '#4a4a4a'
        }}
        onMouseLeave={(e) => {
          if (!showFontSize) e.target.style.backgroundColor = '#3a3a3a'
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{selectedSize}</span>
        <IconChevronDown size={14} />
      </button>

      {showFontSize && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            backgroundColor: '#2d2d2d',
            border: '1px solid #4a7ba7',
            borderRadius: '4px',
            minWidth: '120px',
            maxHeight: '280px',
            overflowY: 'auto',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            zIndex: 10001,
            animation: 'dropdownFadeIn 0.15s ease'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Preset Sizes */}
          <div style={{ padding: '4px 0' }}>
            <div style={{
              padding: '4px 12px',
              fontSize: '10px',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Preset Sizes
            </div>
            {FONT_SIZES.map((size) => (
              <div
                key={size}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleFontSizeChange(size)
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#e0e0e0',
                  fontSize: '13px',
                  backgroundColor: selectedSize === size ? '#4a7ba7' : 'transparent',
                  transition: 'background-color 0.15s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (selectedSize !== size) e.target.style.backgroundColor = '#3a3a3a'
                }}
                onMouseLeave={(e) => {
                  if (selectedSize !== size) e.target.style.backgroundColor = 'transparent'
                }}
              >
                <span>{size}</span>
                <span style={{ fontSize: size, lineHeight: '1', color: '#888' }}>Aa</span>
              </div>
            ))}
          </div>

          {/* Custom Size Input */}
          <div style={{ borderTop: '1px solid #4a4a4a', padding: '8px 12px' }}>
            <div style={{
              fontSize: '10px',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px'
            }}>
              Custom Size
            </div>
            <form onSubmit={handleCustomSizeSubmit} style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="px"
                style={{
                  flex: 1,
                  background: '#1a1a1a',
                  border: '1px solid #4a4a4a',
                  borderRadius: '3px',
                  padding: '4px 6px',
                  color: '#e0e0e0',
                  fontSize: '12px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4a7ba7'}
                onBlur={(e) => e.target.style.borderColor = '#4a4a4a'}
              />
              <button
                type="submit"
                style={{
                  background: '#4a7ba7',
                  border: '1px solid #4a7ba7',
                  borderRadius: '3px',
                  padding: '4px 8px',
                  color: '#e0e0e0',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a8bb7'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4a7ba7'}
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
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
      {/* Font Family & Size */}
      <FontFamilyDropdown />
      <FontSizeDropdown />

      <Divider />

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
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
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
