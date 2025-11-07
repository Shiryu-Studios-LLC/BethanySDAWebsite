import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Border, Square } from 'lucide-react';
import ColorPicker from './ColorPicker';

const BorderControls = ({
  value = {
    style: 'none',
    width: 0,
    color: '#666666',
    radius: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
    sides: { top: true, right: true, bottom: true, left: true }
  },
  onChange = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [allSides, setAllSides] = useState(true);
  const [allCorners, setAllCorners] = useState(true);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
    // Check if all sides are the same
    const sides = value.sides || { top: true, right: true, bottom: true, left: true };
    setAllSides(sides.top && sides.right && sides.bottom && sides.left);

    // Check if all corners are the same
    const radius = value.radius || { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
    const firstRadius = radius.topLeft;
    setAllCorners(
      radius.topRight === firstRadius &&
      radius.bottomRight === firstRadius &&
      radius.bottomLeft === firstRadius
    );
  }, [value]);

  const handleChange = (updates) => {
    const newValue = { ...localValue, ...updates };
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleStyleChange = (style) => {
    handleChange({ style });
  };

  const handleWidthChange = (width) => {
    handleChange({ width: parseFloat(width) || 0 });
  };

  const handleColorChange = (color) => {
    handleChange({ color });
  };

  const handleRadiusChange = (corner, value) => {
    if (allCorners) {
      handleChange({
        radius: {
          topLeft: parseFloat(value) || 0,
          topRight: parseFloat(value) || 0,
          bottomRight: parseFloat(value) || 0,
          bottomLeft: parseFloat(value) || 0
        }
      });
    } else {
      handleChange({
        radius: {
          ...localValue.radius,
          [corner]: parseFloat(value) || 0
        }
      });
    }
  };

  const handleSideToggle = (side) => {
    if (allSides) {
      const newState = !localValue.sides[side];
      handleChange({
        sides: {
          top: newState,
          right: newState,
          bottom: newState,
          left: newState
        }
      });
    } else {
      handleChange({
        sides: {
          ...localValue.sides,
          [side]: !localValue.sides[side]
        }
      });
    }
  };

  const applyPreset = (preset) => {
    switch (preset) {
      case 'none':
        handleChange({ style: 'none', width: 0 });
        break;
      case 'thin':
        handleChange({ style: 'solid', width: 1 });
        break;
      case 'medium':
        handleChange({ style: 'solid', width: 2 });
        break;
      case 'thick':
        handleChange({ style: 'solid', width: 4 });
        break;
    }
  };

  const applyRadiusPreset = (preset) => {
    let radiusValue;
    switch (preset) {
      case 'none':
        radiusValue = 0;
        break;
      case 'small':
        radiusValue = 4;
        break;
      case 'medium':
        radiusValue = 8;
        break;
      case 'large':
        radiusValue = 16;
        break;
      case 'circle':
        radiusValue = '50%';
        break;
      default:
        radiusValue = 0;
    }

    handleChange({
      radius: {
        topLeft: radiusValue,
        topRight: radiusValue,
        bottomRight: radiusValue,
        bottomLeft: radiusValue
      }
    });
  };

  const toggleAllSides = () => {
    const newState = !allSides;
    setAllSides(newState);
    if (newState) {
      handleChange({
        sides: {
          top: true,
          right: true,
          bottom: true,
          left: true
        }
      });
    }
  };

  const toggleAllCorners = () => {
    const newState = !allCorners;
    setAllCorners(newState);
    if (newState) {
      const currentRadius = localValue.radius.topLeft || 0;
      handleChange({
        radius: {
          topLeft: currentRadius,
          topRight: currentRadius,
          bottomRight: currentRadius,
          bottomLeft: currentRadius
        }
      });
    }
  };

  const getPreviewStyle = () => {
    const { style, width, color, radius, sides } = localValue;

    const borderStyle = style === 'none' ? 'none' : style;
    const borderWidth = style === 'none' ? 0 : width;

    return {
      borderTopStyle: sides.top ? borderStyle : 'none',
      borderRightStyle: sides.right ? borderStyle : 'none',
      borderBottomStyle: sides.bottom ? borderStyle : 'none',
      borderLeftStyle: sides.left ? borderStyle : 'none',
      borderTopWidth: sides.top ? `${borderWidth}px` : 0,
      borderRightWidth: sides.right ? `${borderWidth}px` : 0,
      borderBottomWidth: sides.bottom ? `${borderWidth}px` : 0,
      borderLeftWidth: sides.left ? `${borderWidth}px` : 0,
      borderColor: color,
      borderTopLeftRadius: typeof radius.topLeft === 'string' ? radius.topLeft : `${radius.topLeft}px`,
      borderTopRightRadius: typeof radius.topRight === 'string' ? radius.topRight : `${radius.topRight}px`,
      borderBottomRightRadius: typeof radius.bottomRight === 'string' ? radius.bottomRight : `${radius.bottomRight}px`,
      borderBottomLeftRadius: typeof radius.bottomLeft === 'string' ? radius.bottomLeft : `${radius.bottomLeft}px`,
    };
  };

  const borderStyles = ['none', 'solid', 'dashed', 'dotted', 'double'];

  return (
    <div className="border-controls" style={{
      backgroundColor: '#2d2d2d',
      borderRadius: '4px',
      marginBottom: '12px',
      border: '1px solid #3a3a3a'
    }}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: isExpanded ? '1px solid #3a3a3a' : 'none'
        }}
      >
        {isExpanded ?
          <ChevronDown size={16} style={{ color: '#999' }} /> :
          <ChevronRight size={16} style={{ color: '#999' }} />
        }
        <Border size={16} style={{ color: '#999' }} />
        <span style={{ color: '#e0e0e0', fontSize: '13px', fontWeight: '500' }}>
          Border
        </span>
        {!isExpanded && localValue.style !== 'none' && (
          <span style={{
            marginLeft: 'auto',
            color: '#999',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{localValue.style}</span>
            <span>{localValue.width}px</span>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: localValue.color,
              borderRadius: '2px',
              border: '1px solid #444'
            }} />
          </span>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '12px' }}>
          {/* Preview Box */}
          <div style={{
            backgroundColor: '#252525',
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#1a1a1a',
              ...getPreviewStyle()
            }} />
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#999',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Quick Presets
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['none', 'thin', 'medium', 'thick'].map(preset => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#252525',
                    border: '1px solid #3a3a3a',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#333';
                    e.target.style.borderColor = '#4a4a4a';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#252525';
                    e.target.style.borderColor = '#3a3a3a';
                  }}
                >
                  {preset === 'none' ? 'None' :
                   preset === 'thin' ? 'Thin (1px)' :
                   preset === 'medium' ? 'Medium (2px)' : 'Thick (4px)'}
                </button>
              ))}
            </div>
          </div>

          {/* Border Style */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#999',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Style
            </label>
            <select
              value={localValue.style}
              onChange={(e) => handleStyleChange(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                backgroundColor: '#252525',
                border: '1px solid #3a3a3a',
                borderRadius: '4px',
                color: '#e0e0e0',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {borderStyles.map(style => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Border Width */}
          {localValue.style !== 'none' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#999',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Width
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={localValue.width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: '#252525',
                    borderRadius: '2px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={localValue.width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  style={{
                    width: '60px',
                    padding: '4px 8px',
                    backgroundColor: '#252525',
                    border: '1px solid #3a3a3a',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <span style={{ color: '#666', fontSize: '12px' }}>px</span>
              </div>
            </div>
          )}

          {/* Border Color */}
          {localValue.style !== 'none' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#999',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Color
              </label>
              <ColorPicker
                value={localValue.color}
                onChange={handleColorChange}
              />
            </div>
          )}

          {/* Individual Sides */}
          {localValue.style !== 'none' && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <label style={{
                  color: '#999',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Sides
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#999',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={allSides}
                    onChange={toggleAllSides}
                    style={{ cursor: 'pointer' }}
                  />
                  All sides
                </label>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                {['top', 'right', 'bottom', 'left'].map(side => (
                  <label key={side} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    backgroundColor: '#252525',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: '1px solid #3a3a3a'
                  }}>
                    <input
                      type="checkbox"
                      checked={localValue.sides[side]}
                      onChange={() => handleSideToggle(side)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{
                      color: '#e0e0e0',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {side}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Border Radius */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <label style={{
                color: '#999',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Border Radius
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#999',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={allCorners}
                  onChange={toggleAllCorners}
                  style={{ cursor: 'pointer' }}
                />
                All corners
              </label>
            </div>

            {/* Radius Presets */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['none', 'small', 'medium', 'large', 'circle'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => applyRadiusPreset(preset)}
                    style={{
                      padding: '3px 10px',
                      backgroundColor: '#252525',
                      border: '1px solid #3a3a3a',
                      borderRadius: '3px',
                      color: '#e0e0e0',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#333';
                      e.target.style.borderColor = '#4a4a4a';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#252525';
                      e.target.style.borderColor = '#3a3a3a';
                    }}
                  >
                    {preset === 'none' ? '0' :
                     preset === 'small' ? '4px' :
                     preset === 'medium' ? '8px' :
                     preset === 'large' ? '16px' : '50%'}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Inputs */}
            {allCorners ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  value={localValue.radius.topLeft}
                  onChange={(e) => handleRadiusChange('topLeft', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    backgroundColor: '#252525',
                    border: '1px solid #3a3a3a',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  placeholder="All corners"
                />
                <span style={{ color: '#666', fontSize: '12px' }}>px</span>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                {[
                  { key: 'topLeft', label: 'Top Left' },
                  { key: 'topRight', label: 'Top Right' },
                  { key: 'bottomLeft', label: 'Bottom Left' },
                  { key: 'bottomRight', label: 'Bottom Right' }
                ].map(corner => (
                  <div key={corner.key}>
                    <label style={{
                      display: 'block',
                      marginBottom: '4px',
                      color: '#888',
                      fontSize: '11px'
                    }}>
                      {corner.label}
                    </label>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={localValue.radius[corner.key]}
                        onChange={(e) => handleRadiusChange(corner.key, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '4px 6px',
                          backgroundColor: '#252525',
                          border: '1px solid #3a3a3a',
                          borderRadius: '4px',
                          color: '#e0e0e0',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <span style={{ color: '#666', fontSize: '11px' }}>px</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BorderControls;