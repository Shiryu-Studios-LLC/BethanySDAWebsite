import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: #2d2d2d;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  padding: 12px;
  width: 320px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
`;

const Label = styled.div`
  color: #b0b0b0;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PreviewSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const ColorPreview = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid #3a3a3a;
  border-radius: 4px;
  background: ${props => props.color || '#000000'};
  background-image:
    linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
    linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
    linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.color || '#000000'};
    border-radius: 2px;
  }
`;

const InputSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HexInput = styled.input`
  background: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 3px;
  color: #e0e0e0;
  padding: 6px 8px;
  font-size: 13px;
  font-family: 'Consolas', 'Monaco', monospace;
  outline: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: #4a4a4a;
  }

  &:focus {
    border-color: #4a7ba7;
    background: #222;
  }

  &::placeholder {
    color: #666;
  }
`;

const SwatchSection = styled.div`
  margin-bottom: 16px;
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24px, 1fr));
  gap: 6px;
  margin-top: 8px;
`;

const Swatch = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #3a3a3a;
  border-radius: 3px;
  background: ${props => props.color};
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.15s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #5a5a5a;
  }

  ${props => props.selected && `
    border: 2px solid #4a7ba7;
    box-shadow: 0 0 0 1px #2d2d2d, 0 0 0 3px #4a7ba740;
  `}

  &:active {
    transform: scale(0.95);
  }
`;

const SliderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SliderLabel = styled.div`
  color: #888;
  font-size: 11px;
  font-weight: 600;
  width: 20px;
  text-align: center;
`;

const SliderTrack = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: #e0e0e0;
    border: 1px solid #3a3a3a;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #fff;
      border-color: #4a7ba7;
    }
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #e0e0e0;
    border: 1px solid #3a3a3a;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #fff;
      border-color: #4a7ba7;
    }
  }
`;

const SliderValue = styled.div`
  color: #b0b0b0;
  font-size: 11px;
  font-family: 'Consolas', 'Monaco', monospace;
  width: 30px;
  text-align: right;
`;

const SectionLabel = styled.div`
  color: #888;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ColorPicker = ({ value = '#000000', onChange, label }) => {
  const [hexValue, setHexValue] = useState(value);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });

  // Color presets
  const grayscaleColors = [
    '#ffffff', '#f0f0f0', '#cccccc', '#999999', '#666666', '#333333', '#000000'
  ];

  const primaryColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
  ];

  const churchColors = [
    '#0054a6', '#4a7ba7', '#5a9b5a'
  ];

  // Convert hex to RGB
  const hexToRgb = useCallback((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  // Convert RGB to hex
  const rgbToHex = useCallback((r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }, []);

  // Update RGB when value changes
  useEffect(() => {
    setHexValue(value);
    setRgb(hexToRgb(value));
  }, [value, hexToRgb]);

  // Handle hex input change
  const handleHexChange = (e) => {
    const input = e.target.value;
    setHexValue(input);

    // Validate and update if valid hex
    if (/^#[0-9A-F]{6}$/i.test(input)) {
      onChange(input);
      setRgb(hexToRgb(input));
    }
  };

  // Handle hex input blur - format and validate
  const handleHexBlur = () => {
    let formatted = hexValue.trim();

    // Add # if missing
    if (!formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }

    // Validate format
    if (/^#[0-9A-F]{6}$/i.test(formatted)) {
      setHexValue(formatted);
      onChange(formatted);
    } else {
      // Revert to current value if invalid
      setHexValue(value);
    }
  };

  // Handle RGB slider changes
  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: parseInt(value) };
    setRgb(newRgb);

    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexValue(newHex);
    onChange(newHex);
  };

  // Handle swatch click
  const handleSwatchClick = (color) => {
    setHexValue(color);
    onChange(color);
    setRgb(hexToRgb(color));
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}

      <PreviewSection>
        <ColorPreview color={hexValue} />
        <InputSection>
          <HexInput
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            onBlur={handleHexBlur}
            placeholder="#000000"
            maxLength={7}
          />
        </InputSection>
      </PreviewSection>

      <SwatchSection>
        <SectionLabel>Grayscale</SectionLabel>
        <SwatchGrid>
          {grayscaleColors.map(color => (
            <Swatch
              key={color}
              color={color}
              selected={value.toLowerCase() === color.toLowerCase()}
              onClick={() => handleSwatchClick(color)}
              title={color}
            />
          ))}
        </SwatchGrid>
      </SwatchSection>

      <SwatchSection>
        <SectionLabel>Primary Colors</SectionLabel>
        <SwatchGrid>
          {primaryColors.map(color => (
            <Swatch
              key={color}
              color={color}
              selected={value.toLowerCase() === color.toLowerCase()}
              onClick={() => handleSwatchClick(color)}
              title={color}
            />
          ))}
        </SwatchGrid>
      </SwatchSection>

      <SwatchSection>
        <SectionLabel>Church Theme</SectionLabel>
        <SwatchGrid>
          {churchColors.map(color => (
            <Swatch
              key={color}
              color={color}
              selected={value.toLowerCase() === color.toLowerCase()}
              onClick={() => handleSwatchClick(color)}
              title={color}
            />
          ))}
        </SwatchGrid>
      </SwatchSection>

      <SliderSection>
        <SectionLabel>RGB Values</SectionLabel>

        <SliderRow>
          <SliderLabel>R</SliderLabel>
          <SliderTrack
            type="range"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => handleRgbChange('r', e.target.value)}
            style={{
              background: `linear-gradient(to right, #000, #ff0000)`
            }}
          />
          <SliderValue>{rgb.r}</SliderValue>
        </SliderRow>

        <SliderRow>
          <SliderLabel>G</SliderLabel>
          <SliderTrack
            type="range"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => handleRgbChange('g', e.target.value)}
            style={{
              background: `linear-gradient(to right, #000, #00ff00)`
            }}
          />
          <SliderValue>{rgb.g}</SliderValue>
        </SliderRow>

        <SliderRow>
          <SliderLabel>B</SliderLabel>
          <SliderTrack
            type="range"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => handleRgbChange('b', e.target.value)}
            style={{
              background: `linear-gradient(to right, #000, #0000ff)`
            }}
          />
          <SliderValue>{rgb.b}</SliderValue>
        </SliderRow>
      </SliderSection>
    </Container>
  );
};

export default ColorPicker;