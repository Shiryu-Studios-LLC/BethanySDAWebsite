import React, { useState, useEffect } from 'react';
import {
  IconDeviceDesktop,
  IconDeviceTablet,
  IconDeviceMobile,
  IconRotate
} from '@tabler/icons-react';

const ResponsivePreview = ({
  currentBreakpoint = 'desktop',
  onBreakpointChange,
  children
}) => {
  const [orientation, setOrientation] = useState('portrait');
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Breakpoint configurations
  const breakpoints = {
    desktop: {
      name: 'Desktop',
      portrait: { width: 1200, height: 800 },
      landscape: { width: 1200, height: 800 }, // Desktop doesn't rotate
      icon: IconDeviceDesktop,
      supportsRotation: false
    },
    tablet: {
      name: 'Tablet',
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1024, height: 768 },
      icon: IconDeviceTablet,
      supportsRotation: true
    },
    mobile: {
      name: 'Mobile',
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 },
      icon: IconDeviceMobile,
      supportsRotation: true
    }
  };

  // Update dimensions when breakpoint or orientation changes
  useEffect(() => {
    const breakpoint = breakpoints[currentBreakpoint];
    const newDimensions = breakpoint[orientation];

    // Trigger transition animation
    setIsTransitioning(true);
    setDimensions(newDimensions);

    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentBreakpoint, orientation]);

  // Reset orientation when switching to/from desktop
  useEffect(() => {
    if (currentBreakpoint === 'desktop' && orientation === 'landscape') {
      setOrientation('portrait');
    }
  }, [currentBreakpoint]);

  const handleBreakpointClick = (breakpoint) => {
    if (breakpoint !== currentBreakpoint) {
      onBreakpointChange(breakpoint);
      // Reset to portrait when changing breakpoints
      if (breakpoint !== 'desktop') {
        setOrientation('portrait');
      }
    }
  };

  const handleRotate = () => {
    if (breakpoints[currentBreakpoint].supportsRotation) {
      setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
    }
  };

  return (
    <div className="responsive-preview-container" style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.buttonGroup}>
          {Object.entries(breakpoints).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = currentBreakpoint === key;

            return (
              <button
                key={key}
                onClick={() => handleBreakpointClick(key)}
                style={{
                  ...styles.button,
                  ...(isActive ? styles.activeButton : styles.inactiveButton)
                }}
                title={config.name}
              >
                <Icon
                  size={18}
                  style={styles.icon}
                />
                <span style={styles.buttonLabel}>{config.name}</span>
              </button>
            );
          })}

          {/* Rotate button */}
          {breakpoints[currentBreakpoint].supportsRotation && (
            <button
              onClick={handleRotate}
              style={{
                ...styles.button,
                ...styles.rotateButton,
                ...(orientation === 'landscape' ? styles.rotateActive : {})
              }}
              title={`Switch to ${orientation === 'portrait' ? 'Landscape' : 'Portrait'}`}
            >
              <IconRotate
                size={18}
                style={{
                  ...styles.icon,
                  transform: orientation === 'landscape' ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
          )}
        </div>

        {/* Dimensions display */}
        <div style={styles.dimensions}>
          <span style={styles.dimensionsText}>
            {dimensions.width} × {dimensions.height}
          </span>
          {orientation === 'landscape' && currentBreakpoint !== 'desktop' && (
            <span style={styles.orientationBadge}>Landscape</span>
          )}
        </div>
      </div>

      {/* Preview viewport */}
      <div style={styles.viewportContainer}>
        <div
          style={{
            ...styles.viewport,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transition: isTransitioning ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#1a1a1a',
    position: 'relative'
  },

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '48px',
    backgroundColor: '#252525',
    borderBottom: '1px solid #3a3a3a',
    padding: '0 16px',
    flexShrink: 0
  },

  buttonGroup: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  },

  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '32px',
    padding: '0 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    color: '#e0e0e0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  activeButton: {
    backgroundColor: '#4a7ba7',
    color: '#ffffff'
  },

  inactiveButton: {
    backgroundColor: '#3a3a3a',
    color: '#9a9a9a'
  },

  rotateButton: {
    marginLeft: '12px',
    backgroundColor: '#3a3a3a',
    color: '#9a9a9a',
    padding: '0 10px'
  },

  rotateActive: {
    backgroundColor: '#5a5a5a',
    color: '#e0e0e0'
  },

  icon: {
    flexShrink: 0
  },

  buttonLabel: {
    whiteSpace: 'nowrap'
  },

  dimensions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  dimensionsText: {
    color: '#8a8a8a',
    fontSize: '13px',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    letterSpacing: '0.5px'
  },

  orientationBadge: {
    backgroundColor: '#3a3a3a',
    color: '#9a9a9a',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  viewportContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    padding: '32px',
    backgroundColor: '#1a1a1a',
    backgroundImage: `
      linear-gradient(45deg, #202020 25%, transparent 25%),
      linear-gradient(-45deg, #202020 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #202020 75%),
      linear-gradient(-45deg, transparent 75%, #202020 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  },

  viewport: {
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    willChange: 'width, height',
    transformOrigin: 'center center'
  }
};

export default ResponsivePreview;