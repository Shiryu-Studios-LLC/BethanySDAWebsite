import { IconCircleFilled, IconRefresh, IconHome, IconLock } from '@tabler/icons-react'

export default function BrowserFrame({ children, url = 'bethany-sda-church.pages.dev' }) {
  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Browser Top Bar */}
      <div style={{
        backgroundColor: '#252525',
        borderBottom: '1px solid #3a3a3a',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Traffic Lights */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <IconCircleFilled size={12} style={{ color: '#ff5f56' }} />
          <IconCircleFilled size={12} style={{ color: '#ffbd2e' }} />
          <IconCircleFilled size={12} style={{ color: '#27c93f' }} />
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '8px' }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#7a7a7a',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <IconRefresh size={16} />
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#7a7a7a',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <IconHome size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <div style={{
          flex: 1,
          backgroundColor: '#1e1e1e',
          border: '1px solid #3a3a3a',
          borderRadius: '6px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <IconLock size={14} style={{ color: '#5a9b5a' }} />
          <span style={{
            fontSize: '12px',
            color: '#a0a0a0'
          }}>
            {url}
          </span>
        </div>
      </div>

      {/* Browser Content */}
      <div style={{
        backgroundColor: '#ffffff',
        minHeight: '400px',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  )
}
