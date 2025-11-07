import React, { useState, useEffect, useCallback, useRef } from 'react';

const ResizeHandles = ({ isVisible, elementRef, onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const startDataRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
    aspectRatio: 1,
    isShiftPressed: false
  });

  // Handle definitions with positions and cursor styles
  const handles = [
    { position: 'top-left', cursor: 'nw-resize', style: { top: -4, left: -4 } },
    { position: 'top', cursor: 'n-resize', style: { top: -4, left: '50%', transform: 'translateX(-50%)' } },
    { position: 'top-right', cursor: 'ne-resize', style: { top: -4, right: -4 } },
    { position: 'right', cursor: 'e-resize', style: { top: '50%', right: -4, transform: 'translateY(-50%)' } },
    { position: 'bottom-right', cursor: 'se-resize', style: { bottom: -4, right: -4 } },
    { position: 'bottom', cursor: 's-resize', style: { bottom: -4, left: '50%', transform: 'translateX(-50%)' } },
    { position: 'bottom-left', cursor: 'sw-resize', style: { bottom: -4, left: -4 } },
    { position: 'left', cursor: 'w-resize', style: { top: '50%', left: -4, transform: 'translateY(-50%)' } }
  ];

  // Update dimensions when element changes
  useEffect(() => {
    if (elementRef?.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, [elementRef]);

  // Track shift key state
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        startDataRef.current.isShiftPressed = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        startDataRef.current.isShiftPressed = false;
      }
    };

    if (isResizing) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isResizing]);

  const handleMouseDown = useCallback((e, handle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!elementRef?.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    startDataRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: element.offsetLeft,
      startTop: element.offsetTop,
      aspectRatio: rect.width / rect.height,
      isShiftPressed: e.shiftKey
    };

    setIsResizing(true);
    setActiveHandle(handle);
    setShowTooltip(true);
    setTooltipPosition({ x: e.clientX, y: e.clientY });

    // Add global mouse event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [elementRef]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !elementRef?.current) return;

    const element = elementRef.current;
    const data = startDataRef.current;
    const deltaX = e.clientX - data.startX;
    const deltaY = e.clientY - data.startY;

    let newWidth = data.startWidth;
    let newHeight = data.startHeight;
    let newLeft = data.startLeft;
    let newTop = data.startTop;

    const maintainAspectRatio = e.shiftKey || data.isShiftPressed;

    // Calculate new dimensions based on active handle
    switch (activeHandle) {
      case 'top-left':
        if (maintainAspectRatio) {
          const avgDelta = (deltaX + deltaY) / 2;
          newWidth = Math.max(50, data.startWidth - avgDelta);
          newHeight = newWidth / data.aspectRatio;
          newLeft = data.startLeft + (data.startWidth - newWidth);
          newTop = data.startTop + (data.startHeight - newHeight);
        } else {
          newWidth = Math.max(50, data.startWidth - deltaX);
          newHeight = Math.max(50, data.startHeight - deltaY);
          newLeft = data.startLeft + deltaX;
          newTop = data.startTop + deltaY;
        }
        break;

      case 'top':
        newHeight = Math.max(50, data.startHeight - deltaY);
        newTop = data.startTop + deltaY;
        if (maintainAspectRatio) {
          newWidth = newHeight * data.aspectRatio;
          newLeft = data.startLeft - (newWidth - data.startWidth) / 2;
        }
        break;

      case 'top-right':
        if (maintainAspectRatio) {
          const avgDelta = (deltaX - deltaY) / 2;
          newWidth = Math.max(50, data.startWidth + avgDelta);
          newHeight = newWidth / data.aspectRatio;
          newTop = data.startTop + (data.startHeight - newHeight);
        } else {
          newWidth = Math.max(50, data.startWidth + deltaX);
          newHeight = Math.max(50, data.startHeight - deltaY);
          newTop = data.startTop + deltaY;
        }
        break;

      case 'right':
        newWidth = Math.max(50, data.startWidth + deltaX);
        if (maintainAspectRatio) {
          newHeight = newWidth / data.aspectRatio;
          newTop = data.startTop - (newHeight - data.startHeight) / 2;
        }
        break;

      case 'bottom-right':
        if (maintainAspectRatio) {
          const avgDelta = (deltaX + deltaY) / 2;
          newWidth = Math.max(50, data.startWidth + avgDelta);
          newHeight = newWidth / data.aspectRatio;
        } else {
          newWidth = Math.max(50, data.startWidth + deltaX);
          newHeight = Math.max(50, data.startHeight + deltaY);
        }
        break;

      case 'bottom':
        newHeight = Math.max(50, data.startHeight + deltaY);
        if (maintainAspectRatio) {
          newWidth = newHeight * data.aspectRatio;
          newLeft = data.startLeft - (newWidth - data.startWidth) / 2;
        }
        break;

      case 'bottom-left':
        if (maintainAspectRatio) {
          const avgDelta = (-deltaX + deltaY) / 2;
          newWidth = Math.max(50, data.startWidth + avgDelta);
          newHeight = newWidth / data.aspectRatio;
          newLeft = data.startLeft - (newWidth - data.startWidth);
        } else {
          newWidth = Math.max(50, data.startWidth - deltaX);
          newHeight = Math.max(50, data.startHeight + deltaY);
          newLeft = data.startLeft + deltaX;
        }
        break;

      case 'left':
        newWidth = Math.max(50, data.startWidth - deltaX);
        newLeft = data.startLeft + deltaX;
        if (maintainAspectRatio) {
          newHeight = newWidth / data.aspectRatio;
          newTop = data.startTop - (newHeight - data.startHeight) / 2;
        }
        break;

      default:
        break;
    }

    // Apply new dimensions and position
    element.style.width = `${Math.round(newWidth)}px`;
    element.style.height = `${Math.round(newHeight)}px`;
    element.style.left = `${Math.round(newLeft)}px`;
    element.style.top = `${Math.round(newTop)}px`;

    // Update state
    setDimensions({ width: Math.round(newWidth), height: Math.round(newHeight) });
    setTooltipPosition({ x: e.clientX, y: e.clientY });

    // Notify parent
    if (onResize) {
      onResize(Math.round(newWidth), Math.round(newHeight));
    }
  }, [isResizing, activeHandle, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setActiveHandle(null);
    setShowTooltip(false);

    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  if (!isVisible || !elementRef?.current) {
    return null;
  }

  return (
    <>
      {/* Resize handles */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      >
        {handles.map((handle) => (
          <div
            key={handle.position}
            onMouseDown={(e) => handleMouseDown(e, handle.position)}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: activeHandle === handle.position ? '#4a7ba7' : '#3a3a3a',
              border: '1px solid #4a7ba7',
              borderRadius: '1px',
              cursor: handle.cursor,
              pointerEvents: 'auto',
              transition: 'background-color 0.1s ease',
              boxSizing: 'border-box',
              ...handle.style
            }}
            onMouseEnter={(e) => {
              if (!isResizing) {
                e.target.style.backgroundColor = '#4a7ba7';
              }
            }}
            onMouseLeave={(e) => {
              if (!isResizing && activeHandle !== handle.position) {
                e.target.style.backgroundColor = '#3a3a3a';
              }
            }}
          />
        ))}
      </div>

      {/* Dimension tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y - 30}px`,
            backgroundColor: '#2d2d2d',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '12px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            zIndex: 10000,
            pointerEvents: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            border: '1px solid #4a7ba7'
          }}
        >
          {dimensions.width} × {dimensions.height}
        </div>
      )}

      {/* Optional edge indicators when resizing */}
      {isResizing && (
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            border: '1px dashed #4a7ba7',
            pointerEvents: 'none',
            zIndex: 9998
          }}
        />
      )}
    </>
  );
};

export default ResizeHandles;