import { IconCircleFilled, IconMinus, IconSquare, IconX } from '@tabler/icons-react'

export default function BrowserFrame({ children }) {
  return (
    <div
      style={{
        backgroundColor: '#e5e5e5',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Browser Chrome */}
      <div
        style={{
          height: '40px',
          backgroundColor: '#d5d5d5',
          borderBottom: '1px solid #c0c0c0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: '8px'
        }}
      >
        {/* Traffic Lights (macOS style) */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ff5f57'
            }}
            title="Close"
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ffbd2e'
            }}
            title="Minimize"
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#28ca42'
            }}
            title="Maximize"
          />
        </div>

        {/* Address Bar */}
        <div
          style={{
            flex: 1,
            height: '26px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            border: '1px solid #c0c0c0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            marginLeft: '8px',
            fontSize: '11px',
            color: '#666'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
            <path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z" fill="#888"/>
          </svg>
          https://yourchurch.org/preview
        </div>

        {/* Browser Controls */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: '#666'
            }}
          >
            ⋯
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div
        style={{
          backgroundColor: '#ffffff',
          minHeight: '400px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  )
}
