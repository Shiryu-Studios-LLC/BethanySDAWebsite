import { useState } from 'react'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import ColorPicker from './ColorPicker'

export default function GradientPicker({ value, onChange }) {
  const [gradientType, setGradientType] = useState('linear')
  const [angle, setAngle] = useState(90)
  const [colorStops, setColorStops] = useState([
    { color: '#4a7ba7', position: 0 },
    { color: '#7ba74a', position: 100 }
  ])

  // Parse existing gradient value if provided
  useState(() => {
    if (value && value.startsWith('linear-gradient')) {
      const match = value.match(/linear-gradient\((\d+)deg,\s*(.+)\)/)
      if (match) {
        setAngle(parseInt(match[1]))
        const stopsStr = match[2]
        const stops = stopsStr.split(/,\s*(?![^()]*\))/).map(stop => {
          const parts = stop.trim().match(/^(.+?)\s+(\d+)%$/)
          if (parts) {
            return { color: parts[1], position: parseInt(parts[2]) }
          }
          return null
        }).filter(Boolean)
        if (stops.length > 0) {
          setColorStops(stops)
        }
      }
    } else if (value && value.startsWith('radial-gradient')) {
      setGradientType('radial')
      const match = value.match(/radial-gradient\(circle,\s*(.+)\)/)
      if (match) {
        const stopsStr = match[1]
        const stops = stopsStr.split(/,\s*(?![^()]*\))/).map(stop => {
          const parts = stop.trim().match(/^(.+?)\s+(\d+)%$/)
          if (parts) {
            return { color: parts[1], position: parseInt(parts[2]) }
          }
          return null
        }).filter(Boolean)
        if (stops.length > 0) {
          setColorStops(stops)
        }
      }
    }
  }, [value])

  const generateGradient = (type, stops, deg) => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')

    if (type === 'linear') {
      return `linear-gradient(${deg}deg, ${stopsStr})`
    } else {
      return `radial-gradient(circle, ${stopsStr})`
    }
  }

  const handleTypeChange = (type) => {
    setGradientType(type)
    onChange(generateGradient(type, colorStops, angle))
  }

  const handleAngleChange = (newAngle) => {
    setAngle(newAngle)
    onChange(generateGradient(gradientType, colorStops, newAngle))
  }

  const handleColorStopChange = (index, field, value) => {
    const newStops = [...colorStops]
    newStops[index][field] = value
    setColorStops(newStops)
    onChange(generateGradient(gradientType, newStops, angle))
  }

  const addColorStop = () => {
    const newStop = { color: '#ffffff', position: 50 }
    const newStops = [...colorStops, newStop]
    setColorStops(newStops)
    onChange(generateGradient(gradientType, newStops, angle))
  }

  const removeColorStop = (index) => {
    if (colorStops.length > 2) {
      const newStops = colorStops.filter((_, i) => i !== index)
      setColorStops(newStops)
      onChange(generateGradient(gradientType, newStops, angle))
    }
  }

  const currentGradient = generateGradient(gradientType, colorStops, angle)

  return (
    <div>
      {/* Gradient Preview */}
      <div style={{
        width: '100%',
        height: '60px',
        borderRadius: '4px',
        background: currentGradient,
        border: '1px solid #3a3a3a',
        marginBottom: '12px'
      }} />

      {/* Gradient Type */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          fontSize: '10px',
          color: '#8a8a8a',
          marginBottom: '6px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          Gradient Type
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleTypeChange('linear')}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: gradientType === 'linear' ? '#4a7ba7' : '#1e1e1e',
              border: '1px solid #3a3a3a',
              borderRadius: '3px',
              color: gradientType === 'linear' ? '#ffffff' : '#e0e0e0',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Linear
          </button>
          <button
            onClick={() => handleTypeChange('radial')}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: gradientType === 'radial' ? '#4a7ba7' : '#1e1e1e',
              border: '1px solid #3a3a3a',
              borderRadius: '3px',
              color: gradientType === 'radial' ? '#ffffff' : '#e0e0e0',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Radial
          </button>
        </div>
      </div>

      {/* Angle Control (Linear only) */}
      {gradientType === 'linear' && (
        <div style={{ marginBottom: '12px' }}>
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
            <span>Angle</span>
            <span>{angle}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => handleAngleChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#4a7ba7'
            }}
          />
        </div>
      )}

      {/* Color Stops */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <label style={{
            fontSize: '10px',
            color: '#8a8a8a',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            Color Stops
          </label>
          <button
            onClick={addColorStop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: '#1e1e1e',
              border: '1px solid #3a3a3a',
              borderRadius: '3px',
              color: '#4a7ba7',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <IconPlus size={12} />
            Add
          </button>
        </div>

        {colorStops.map((stop, index) => (
          <div key={index} style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '8px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <ColorPicker
                color={stop.color}
                onChange={(color) => handleColorStopChange(index, 'color', color)}
              />
            </div>
            <div style={{ width: '80px' }}>
              <input
                type="number"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => handleColorStopChange(index, 'position', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3a3a3a',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '11px'
                }}
              />
            </div>
            {colorStops.length > 2 && (
              <button
                onClick={() => removeColorStop(index)}
                style={{
                  padding: '6px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3a3a3a',
                  borderRadius: '3px',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <IconTrash size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
