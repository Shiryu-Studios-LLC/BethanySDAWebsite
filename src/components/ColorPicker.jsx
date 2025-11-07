import { useState, useEffect, useCallback } from 'react'

export default function ColorPicker({ color = '#000000', onChange, label }) {
  const [hexValue, setHexValue] = useState(color)
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 })
  const [hoveredSwatch, setHoveredSwatch] = useState(null)
  const [focusedInput, setFocusedInput] = useState(false)

  // Color presets
  const grayscaleColors = [
    '#ffffff', '#f0f0f0', '#cccccc', '#999999', '#666666', '#333333', '#000000'
  ]

  const primaryColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
  ]

  const churchColors = [
    '#0054a6', '#4a7ba7', '#5a9b5a'
  ]

  // Convert hex to RGB
  const hexToRgb = useCallback((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }, [])

  // Convert RGB to hex
  const rgbToHex = useCallback((r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }, [])

  // Update RGB when color changes
  useEffect(() => {
    setHexValue(color)
    setRgb(hexToRgb(color))
  }, [color, hexToRgb])

  // Handle hex input change
  const handleHexChange = (e) => {
    const input = e.target.value
    setHexValue(input)

    // Validate and update if valid hex
    if (/^#[0-9A-F]{6}$/i.test(input)) {
      onChange?.(input)
      setRgb(hexToRgb(input))
    }
  }

  // Handle hex input blur - format and validate
  const handleHexBlur = () => {
    let formatted = hexValue.trim()

    // Add # if missing
    if (!formatted.startsWith('#')) {
      formatted = '#' + formatted
    }

    // Validate format
    if (/^#[0-9A-F]{6}$/i.test(formatted)) {
      setHexValue(formatted)
      onChange?.(formatted)
    } else {
      // Revert to current color if invalid
      setHexValue(color)
    }
  }

  // Handle RGB slider changes
  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: parseInt(value) }
    setRgb(newRgb)

    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHexValue(newHex)
    onChange?.(newHex)
  }

  // Handle swatch click
  const handleSwatchClick = (clickedColor) => {
    setHexValue(clickedColor)
    onChange?.(clickedColor)
    setRgb(hexToRgb(clickedColor))
  }

  return (
    <div style={{
      background: '#2d2d2d',
      border: '1px solid #3a3a3a',
      borderRadius: '4px',
      padding: '12px',
      width: '320px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
    }}>
      {label && (
        <div style={{
          color: '#b0b0b0',
          fontSize: '12px',
          fontWeight: '500',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </div>
      )}

      {/* Preview and Hex Input */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Color Preview with checkered background */}
        <div style={{
          width: '60px',
          height: '60px',
          border: '2px solid #3a3a3a',
          borderRadius: '4px',
          backgroundImage: `
            linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
            linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
          `,
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: hexValue,
            borderRadius: '2px'
          }} />
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
            placeholder="#000000"
            maxLength={7}
            style={{
              background: focusedInput ? '#222' : '#1a1a1a',
              border: `1px solid ${focusedInput ? '#4a7ba7' : '#3a3a3a'}`,
              borderRadius: '3px',
              color: '#e0e0e0',
              padding: '6px 8px',
              fontSize: '13px',
              fontFamily: 'Consolas, Monaco, monospace',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>
      </div>

      {/* Grayscale Swatches */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          color: '#888',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Grayscale
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))',
          gap: '6px',
          marginTop: '8px'
        }}>
          {grayscaleColors.map(swatchColor => {
            const isSelected = color.toLowerCase() === swatchColor.toLowerCase()
            const isHovered = hoveredSwatch === swatchColor
            return (
              <button
                key={swatchColor}
                onClick={() => handleSwatchClick(swatchColor)}
                onMouseEnter={() => setHoveredSwatch(swatchColor)}
                onMouseLeave={() => setHoveredSwatch(null)}
                title={swatchColor}
                style={{
                  width: '24px',
                  height: '24px',
                  border: isSelected ? '2px solid #4a7ba7' : '1px solid #3a3a3a',
                  borderRadius: '3px',
                  background: swatchColor,
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 0 1px #2d2d2d, 0 0 0 3px rgba(74, 123, 167, 0.25)' : 'none'
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Primary Colors */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          color: '#888',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Primary Colors
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))',
          gap: '6px',
          marginTop: '8px'
        }}>
          {primaryColors.map(swatchColor => {
            const isSelected = color.toLowerCase() === swatchColor.toLowerCase()
            const isHovered = hoveredSwatch === swatchColor
            return (
              <button
                key={swatchColor}
                onClick={() => handleSwatchClick(swatchColor)}
                onMouseEnter={() => setHoveredSwatch(swatchColor)}
                onMouseLeave={() => setHoveredSwatch(null)}
                title={swatchColor}
                style={{
                  width: '24px',
                  height: '24px',
                  border: isSelected ? '2px solid #4a7ba7' : '1px solid #3a3a3a',
                  borderRadius: '3px',
                  background: swatchColor,
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 0 1px #2d2d2d, 0 0 0 3px rgba(74, 123, 167, 0.25)' : 'none'
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Church Theme Colors */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          color: '#888',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Church Theme
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))',
          gap: '6px',
          marginTop: '8px'
        }}>
          {churchColors.map(swatchColor => {
            const isSelected = color.toLowerCase() === swatchColor.toLowerCase()
            const isHovered = hoveredSwatch === swatchColor
            return (
              <button
                key={swatchColor}
                onClick={() => handleSwatchClick(swatchColor)}
                onMouseEnter={() => setHoveredSwatch(swatchColor)}
                onMouseLeave={() => setHoveredSwatch(null)}
                title={swatchColor}
                style={{
                  width: '24px',
                  height: '24px',
                  border: isSelected ? '2px solid #4a7ba7' : '1px solid #3a3a3a',
                  borderRadius: '3px',
                  background: swatchColor,
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 0 1px #2d2d2d, 0 0 0 3px rgba(74, 123, 167, 0.25)' : 'none'
                }}
              />
            )
          })}
        </div>
      </div>

      {/* RGB Sliders */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{
          color: '#888',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          RGB Values
        </div>

        {/* Red Slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            color: '#888',
            fontSize: '11px',
            fontWeight: '600',
            width: '20px',
            textAlign: 'center'
          }}>
            R
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => handleRgbChange('r', e.target.value)}
            style={{
              flex: 1,
              height: '4px',
              WebkitAppearance: 'none',
              appearance: 'none',
              background: 'linear-gradient(to right, #000, #ff0000)',
              border: '1px solid #3a3a3a',
              borderRadius: '2px',
              outline: 'none'
            }}
          />
          <div style={{
            color: '#b0b0b0',
            fontSize: '11px',
            fontFamily: 'Consolas, Monaco, monospace',
            width: '30px',
            textAlign: 'right'
          }}>
            {rgb.r}
          </div>
        </div>

        {/* Green Slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            color: '#888',
            fontSize: '11px',
            fontWeight: '600',
            width: '20px',
            textAlign: 'center'
          }}>
            G
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => handleRgbChange('g', e.target.value)}
            style={{
              flex: 1,
              height: '4px',
              WebkitAppearance: 'none',
              appearance: 'none',
              background: 'linear-gradient(to right, #000, #00ff00)',
              border: '1px solid #3a3a3a',
              borderRadius: '2px',
              outline: 'none'
            }}
          />
          <div style={{
            color: '#b0b0b0',
            fontSize: '11px',
            fontFamily: 'Consolas, Monaco, monospace',
            width: '30px',
            textAlign: 'right'
          }}>
            {rgb.g}
          </div>
        </div>

        {/* Blue Slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            color: '#888',
            fontSize: '11px',
            fontWeight: '600',
            width: '20px',
            textAlign: 'center'
          }}>
            B
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => handleRgbChange('b', e.target.value)}
            style={{
              flex: 1,
              height: '4px',
              WebkitAppearance: 'none',
              appearance: 'none',
              background: 'linear-gradient(to right, #000, #0000ff)',
              border: '1px solid #3a3a3a',
              borderRadius: '2px',
              outline: 'none'
            }}
          />
          <div style={{
            color: '#b0b0b0',
            fontSize: '11px',
            fontFamily: 'Consolas, Monaco, monospace',
            width: '30px',
            textAlign: 'right'
          }}>
            {rgb.b}
          </div>
        </div>
      </div>

      {/* CSS for range sliders */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #e0e0e0;
          border: 1px solid #3a3a3a;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #fff;
          border-color: #4a7ba7;
        }

        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #e0e0e0;
          border: 1px solid #3a3a3a;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          background: #fff;
          border-color: #4a7ba7;
        }
      `}</style>
    </div>
  )
}
