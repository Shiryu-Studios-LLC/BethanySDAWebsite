import React, { useEffect, useState, useCallback, useRef } from 'react';

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
  const [hoveredSetting, setHoveredSetting] = useState(null);

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
      {/* Grid Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.2s ease',
        opacity: localVisible ? 1 : 0
      }}>
        {/* Grid Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />

        {localShowRulers && (
          <>
            {/* Top Ruler */}
            <div style={{
              position: 'absolute',
              background: '#252525',
              color: '#ffffff',
              fontFamily: "'SF Mono', Monaco, 'Cascadia Code', monospace",
              fontSize: '10px',
              userSelect: 'none',
              pointerEvents: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              top: 0,
              left: 0,
              right: 0,
              height: '24px',
              borderBottom: '1px solid #1a1a1a',
              display: localShowRulers && localVisible ? 'block' : 'none'
            }}>
              <canvas ref={topRulerRef} style={{ width: '100%', height: '24px' }} />
            </div>

            {/* Left Ruler */}
            <div style={{
              position: 'absolute',
              background: '#252525',
              color: '#ffffff',
              fontFamily: "'SF Mono', Monaco, 'Cascadia Code', monospace",
              fontSize: '10px',
              userSelect: 'none',
              pointerEvents: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              top: 0,
              left: 0,
              bottom: 0,
              width: '24px',
              borderRight: '1px solid #1a1a1a',
              display: localShowRulers && localVisible ? 'block' : 'none'
            }}>
              <canvas ref={leftRulerRef} style={{ width: '24px', height: '100%' }} />
            </div>

            {/* Corner Box */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '24px',
              height: '24px',
              background: '#1a1a1a',
              borderRight: '1px solid #0a0a0a',
              borderBottom: '1px solid #0a0a0a',
              display: localShowRulers && localVisible ? 'block' : 'none'
            }} />
          </>
        )}

        {/* Smart Guides - Horizontal */}
        {localShowSmartGuides && smartGuidePositions.horizontal.map((y, i) => (
          <div
            key={`h-${i}-${y}`}
            style={{
              position: 'absolute',
              background: '#ff00ff',
              pointerEvents: 'none',
              zIndex: 10000,
              opacity: 0.8,
              transition: 'opacity 0.1s ease',
              height: '1px',
              left: 0,
              right: 0,
              top: `${y}px`
            }}
          />
        ))}

        {/* Smart Guides - Vertical */}
        {localShowSmartGuides && smartGuidePositions.vertical.map((x, i) => (
          <div
            key={`v-${i}-${x}`}
            style={{
              position: 'absolute',
              background: '#ff00ff',
              pointerEvents: 'none',
              zIndex: 10000,
              opacity: 0.8,
              transition: 'opacity 0.1s ease',
              width: '1px',
              top: 0,
              bottom: 0,
              left: `${x}px`
            }}
          />
        ))}
      </div>

      {/* Snap Indicator */}
      <div style={{
        position: 'fixed',
        padding: '4px 8px',
        background: 'rgba(74, 123, 167, 0.9)',
        color: 'white',
        fontSize: '11px',
        fontFamily: "'SF Mono', Monaco, monospace",
        borderRadius: '3px',
        pointerEvents: 'none',
        zIndex: 10001,
        opacity: snapIndicator.show ? 1 : 0,
        transition: 'opacity 0.15s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        left: `${snapIndicator.x + 10}px`,
        top: `${snapIndicator.y - 30}px`
      }}>
        {snapIndicator.text}
      </div>

      {/* Grid Settings */}
      <div style={{
        position: 'fixed',
        top: '32px',
        right: '16px',
        background: 'rgba(37, 37, 37, 0.95)',
        padding: '8px',
        borderRadius: '4px',
        display: showSettings && localVisible ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 10002,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Show Rulers Setting */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e0e0e0',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '3px',
            background: hoveredSetting === 'rulers' ? 'rgba(74, 123, 167, 0.2)' : 'transparent'
          }}
          onMouseEnter={() => setHoveredSetting('rulers')}
          onMouseLeave={() => setHoveredSetting(null)}
        >
          <input
            type="checkbox"
            checked={localShowRulers}
            onChange={(e) => {
              setLocalShowRulers(e.target.checked);
              onRulersToggle?.(e.target.checked);
            }}
            style={{
              background: '#1a1a1a',
              color: 'white',
              border: '1px solid #3a3a3a',
              borderRadius: '2px'
            }}
          />
          Show Rulers (Ctrl+R)
        </label>

        {/* Snap to Grid Setting */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e0e0e0',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '3px',
            background: hoveredSetting === 'snap' ? 'rgba(74, 123, 167, 0.2)' : 'transparent'
          }}
          onMouseEnter={() => setHoveredSetting('snap')}
          onMouseLeave={() => setHoveredSetting(null)}
        >
          <input
            type="checkbox"
            checked={localSnapToGrid}
            onChange={(e) => {
              setLocalSnapToGrid(e.target.checked);
              onSnapToggle?.(e.target.checked);
            }}
            style={{
              background: '#1a1a1a',
              color: 'white',
              border: '1px solid #3a3a3a',
              borderRadius: '2px'
            }}
          />
          Snap to Grid
        </label>

        {/* Smart Guides Setting */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e0e0e0',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '3px',
            background: hoveredSetting === 'guides' ? 'rgba(74, 123, 167, 0.2)' : 'transparent'
          }}
          onMouseEnter={() => setHoveredSetting('guides')}
          onMouseLeave={() => setHoveredSetting(null)}
        >
          <input
            type="checkbox"
            checked={localShowSmartGuides}
            onChange={(e) => {
              setLocalShowSmartGuides(e.target.checked);
              onSmartGuidesToggle?.(e.target.checked);
            }}
            style={{
              background: '#1a1a1a',
              color: 'white',
              border: '1px solid #3a3a3a',
              borderRadius: '2px'
            }}
          />
          Smart Guides
        </label>

        {/* Grid Size Setting */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e0e0e0',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '3px',
            background: hoveredSetting === 'size' ? 'rgba(74, 123, 167, 0.2)' : 'transparent'
          }}
          onMouseEnter={() => setHoveredSetting('size')}
          onMouseLeave={() => setHoveredSetting(null)}
        >
          Grid Size:
          <select
            value={localGridSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setLocalGridSize(newSize);
              onGridSizeChange?.(newSize);
            }}
            style={{
              background: '#1a1a1a',
              color: 'white',
              border: '1px solid #3a3a3a',
              padding: '2px 4px',
              borderRadius: '2px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <option value="8">8px</option>
            <option value="16">16px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
          </select>
        </label>
      </div>
    </>
  );
};

export default GridGuides;
