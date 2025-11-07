import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

const GridOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 0.2s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
`;

const GridCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const RulerContainer = styled.div`
  position: absolute;
  background: #252525;
  color: #ffffff;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 10px;
  user-select: none;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const TopRuler = styled(RulerContainer)`
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  border-bottom: 1px solid #1a1a1a;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const LeftRuler = styled(RulerContainer)`
  top: 0;
  left: 0;
  bottom: 0;
  width: 24px;
  border-right: 1px solid #1a1a1a;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const CornerBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  background: #1a1a1a;
  border-right: 1px solid #0a0a0a;
  border-bottom: 1px solid #0a0a0a;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const SmartGuide = styled.div`
  position: absolute;
  background: #ff00ff;
  pointer-events: none;
  z-index: 10000;
  opacity: ${props => props.$active ? 0.8 : 0};
  transition: opacity 0.1s ease;

  &.horizontal {
    height: 1px;
    left: 0;
    right: 0;
  }

  &.vertical {
    width: 1px;
    top: 0;
    bottom: 0;
  }
`;

const SnapIndicator = styled.div`
  position: fixed;
  padding: 4px 8px;
  background: rgba(74, 123, 167, 0.9);
  color: white;
  font-size: 11px;
  font-family: 'SF Mono', Monaco, monospace;
  border-radius: 3px;
  pointer-events: none;
  z-index: 10001;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const GridSettings = styled.div`
  position: fixed;
  top: 32px;
  right: 16px;
  background: rgba(37, 37, 37, 0.95);
  padding: 8px;
  border-radius: 4px;
  display: ${props => props.$show ? 'flex' : 'none'};
  flex-direction: column;
  gap: 8px;
  z-index: 10002;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
`;

const SettingRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e0e0e0;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;

  &:hover {
    background: rgba(74, 123, 167, 0.2);
  }

  input, select {
    background: #1a1a1a;
    color: white;
    border: 1px solid #3a3a3a;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 11px;
  }

  select {
    cursor: pointer;
  }
`;

const GridGuides = ({
  isVisible = false,
  gridSize = 16,
  showRulers = true,
  snapToGrid = true,
  showSmartGuides = true,
  onToggle,
  onGridSizeChange,
  onRulersToggle,
  onSnapToggle,
  onSmartGuidesToggle
}) => {
  const [localVisible, setLocalVisible] = useState(isVisible);
  const [localGridSize, setLocalGridSize] = useState(gridSize);
  const [localShowRulers, setLocalShowRulers] = useState(showRulers);
  const [localSnapToGrid, setLocalSnapToGrid] = useState(snapToGrid);
  const [localShowSmartGuides, setLocalShowSmartGuides] = useState(showSmartGuides);
  const [showSettings, setShowSettings] = useState(false);
  const [smartGuidePositions, setSmartGuidePositions] = useState({ horizontal: [], vertical: [] });
  const [snapIndicator, setSnapIndicator] = useState({ show: false, x: 0, y: 0, text: '' });

  const canvasRef = useRef(null);
  const topRulerRef = useRef(null);
  const leftRulerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Draw grid lines
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (!localVisible) return;

    // Set grid line style
    ctx.strokeStyle = 'rgba(74, 123, 167, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]); // Dashed lines

    // Draw vertical lines
    for (let x = localShowRulers ? 24 : 0; x < window.innerWidth; x += localGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, localShowRulers ? 24 : 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = localShowRulers ? 24 : 0; y < window.innerHeight; y += localGridSize) {
      ctx.beginPath();
      ctx.moveTo(localShowRulers ? 24 : 0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }

    // Highlight every 8th line for major grid lines
    ctx.strokeStyle = 'rgba(74, 123, 167, 0.35)';
    ctx.setLineDash([4, 4]);

    const majorGridSize = localGridSize * 8;

    // Major vertical lines
    for (let x = localShowRulers ? 24 : 0; x < window.innerWidth; x += majorGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, localShowRulers ? 24 : 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }

    // Major horizontal lines
    for (let y = localShowRulers ? 24 : 0; y < window.innerHeight; y += majorGridSize) {
      ctx.beginPath();
      ctx.moveTo(localShowRulers ? 24 : 0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }
  }, [localVisible, localGridSize, localShowRulers]);

  // Draw rulers
  const drawRulers = useCallback(() => {
    if (!localShowRulers || !localVisible) return;

    // Draw top ruler
    const topCanvas = topRulerRef.current;
    if (topCanvas) {
      const ctx = topCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      topCanvas.width = window.innerWidth * dpr;
      topCanvas.height = 24 * dpr;
      topCanvas.style.width = `${window.innerWidth}px`;
      topCanvas.style.height = '24px';

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, window.innerWidth, 24);

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#666666';
      ctx.font = '10px "SF Mono", Monaco, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw tick marks and numbers
      for (let x = 0; x < window.innerWidth; x += 10) {
        const isHundred = x % 100 === 0;
        const isFifty = x % 50 === 0;

        ctx.beginPath();
        ctx.moveTo(x + 24, 24);
        ctx.lineTo(x + 24, isHundred ? 12 : (isFifty ? 16 : 20));
        ctx.stroke();

        if (isHundred && x > 0) {
          ctx.fillText(x.toString(), x + 24, 8);
        }
      }
    }

    // Draw left ruler
    const leftCanvas = leftRulerRef.current;
    if (leftCanvas) {
      const ctx = leftCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      leftCanvas.width = 24 * dpr;
      leftCanvas.height = window.innerHeight * dpr;
      leftCanvas.style.width = '24px';
      leftCanvas.style.height = `${window.innerHeight}px`;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, 24, window.innerHeight);

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#666666';
      ctx.font = '10px "SF Mono", Monaco, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw tick marks and numbers
      for (let y = 0; y < window.innerHeight; y += 10) {
        const isHundred = y % 100 === 0;
        const isFifty = y % 50 === 0;

        ctx.beginPath();
        ctx.moveTo(24, y + 24);
        ctx.lineTo(isHundred ? 12 : (isFifty ? 16 : 20), y + 24);
        ctx.stroke();

        if (isHundred && y > 0) {
          ctx.save();
          ctx.translate(12, y + 24);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(y.toString(), 0, 0);
          ctx.restore();
        }
      }
    }
  }, [localVisible, localShowRulers]);

  // Snap to grid helper
  const snapToGridValue = useCallback((value, gridSize, threshold = 5) => {
    if (!localSnapToGrid) return { snapped: value, didSnap: false };

    const remainder = value % gridSize;
    const halfGrid = gridSize / 2;

    if (remainder < threshold) {
      return { snapped: value - remainder, didSnap: true };
    } else if (remainder > gridSize - threshold) {
      return { snapped: value - remainder + gridSize, didSnap: true };
    } else if (Math.abs(remainder - halfGrid) < threshold) {
      return { snapped: value - remainder + halfGrid, didSnap: true };
    }

    return { snapped: value, didSnap: false };
  }, [localSnapToGrid]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + ' to toggle grid
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault();
        const newVisible = !localVisible;
        setLocalVisible(newVisible);
        onToggle?.(newVisible);
      }

      // Ctrl + Shift + ' to toggle settings
      if (e.ctrlKey && e.shiftKey && e.key === '"') {
        e.preventDefault();
        setShowSettings(prev => !prev);
      }

      // Ctrl + R to toggle rulers
      if (e.ctrlKey && e.key === 'r' && !e.shiftKey) {
        e.preventDefault();
        const newShowRulers = !localShowRulers;
        setLocalShowRulers(newShowRulers);
        onRulersToggle?.(newShowRulers);
      }

      // Ctrl + G to cycle grid sizes
      if (e.ctrlKey && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        const sizes = [8, 16, 24, 32];
        const currentIndex = sizes.indexOf(localGridSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        const newSize = sizes[nextIndex];
        setLocalGridSize(newSize);
        onGridSizeChange?.(newSize);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localVisible, localShowRulers, localGridSize, onToggle, onRulersToggle, onGridSizeChange]);

  // Redraw on resize or settings change
  useEffect(() => {
    const redraw = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        drawGrid();
        drawRulers();
      });
    };

    redraw();

    window.addEventListener('resize', redraw);
    return () => {
      window.removeEventListener('resize', redraw);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawGrid, drawRulers]);

  // Expose snap function for parent components
  useEffect(() => {
    if (window.gridGuides) return;

    window.gridGuides = {
      snapToGrid: (x, y) => {
        const snappedX = snapToGridValue(x, localGridSize);
        const snappedY = snapToGridValue(y, localGridSize);

        if (snappedX.didSnap || snappedY.didSnap) {
          setSnapIndicator({
            show: true,
            x: snappedX.snapped,
            y: snappedY.snapped,
            text: `${snappedX.snapped}, ${snappedY.snapped}`
          });

          setTimeout(() => {
            setSnapIndicator(prev => ({ ...prev, show: false }));
          }, 1000);
        }

        return {
          x: snappedX.snapped,
          y: snappedY.snapped,
          didSnap: snappedX.didSnap || snappedY.didSnap
        };
      },

      showSmartGuide: (position, axis) => {
        if (!localShowSmartGuides) return;

        setSmartGuidePositions(prev => ({
          ...prev,
          [axis]: [...prev[axis], position]
        }));

        setTimeout(() => {
          setSmartGuidePositions(prev => ({
            ...prev,
            [axis]: prev[axis].filter(p => p !== position)
          }));
        }, 2000);
      },

      isSnapEnabled: () => localSnapToGrid,
      getGridSize: () => localGridSize
    };

    return () => {
      delete window.gridGuides;
    };
  }, [localSnapToGrid, localGridSize, localShowSmartGuides, snapToGridValue]);

  return (
    <>
      <GridOverlay $isVisible={localVisible}>
        <GridCanvas ref={canvasRef} />

        {localShowRulers && (
          <>
            <TopRuler $show={localShowRulers && localVisible}>
              <canvas ref={topRulerRef} style={{ width: '100%', height: '24px' }} />
            </TopRuler>

            <LeftRuler $show={localShowRulers && localVisible}>
              <canvas ref={leftRulerRef} style={{ width: '24px', height: '100%' }} />
            </LeftRuler>

            <CornerBox $show={localShowRulers && localVisible} />
          </>
        )}

        {localShowSmartGuides && smartGuidePositions.horizontal.map((y, i) => (
          <SmartGuide
            key={`h-${i}-${y}`}
            className="horizontal"
            style={{ top: `${y}px` }}
            $active={true}
          />
        ))}

        {localShowSmartGuides && smartGuidePositions.vertical.map((x, i) => (
          <SmartGuide
            key={`v-${i}-${x}`}
            className="vertical"
            style={{ left: `${x}px` }}
            $active={true}
          />
        ))}
      </GridOverlay>

      <SnapIndicator
        $show={snapIndicator.show}
        style={{
          left: `${snapIndicator.x + 10}px`,
          top: `${snapIndicator.y - 30}px`
        }}
      >
        {snapIndicator.text}
      </SnapIndicator>

      <GridSettings $show={showSettings && localVisible}>
        <SettingRow>
          <input
            type="checkbox"
            checked={localShowRulers}
            onChange={(e) => {
              setLocalShowRulers(e.target.checked);
              onRulersToggle?.(e.target.checked);
            }}
          />
          Show Rulers (Ctrl+R)
        </SettingRow>

        <SettingRow>
          <input
            type="checkbox"
            checked={localSnapToGrid}
            onChange={(e) => {
              setLocalSnapToGrid(e.target.checked);
              onSnapToggle?.(e.target.checked);
            }}
          />
          Snap to Grid
        </SettingRow>

        <SettingRow>
          <input
            type="checkbox"
            checked={localShowSmartGuides}
            onChange={(e) => {
              setLocalShowSmartGuides(e.target.checked);
              onSmartGuidesToggle?.(e.target.checked);
            }}
          />
          Smart Guides
        </SettingRow>

        <SettingRow>
          Grid Size:
          <select
            value={localGridSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setLocalGridSize(newSize);
              onGridSizeChange?.(newSize);
            }}
          >
            <option value="8">8px</option>
            <option value="16">16px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
          </select>
        </SettingRow>
      </GridSettings>
    </>
  );
};

export default GridGuides;