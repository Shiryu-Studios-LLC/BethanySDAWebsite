import { IconEye, IconCode, IconPlayerPlay, IconLayout2 } from '@tabler/icons-react'

export default function UnityToolbar({ viewMode, setViewMode, blockCount }) {
  return (
    <div
      className="unity-toolbar"
      style={{
        height: '42px',
        backgroundColor: '#383838',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '8px',
        color: '#cbcbcb'
      }}
    >
      {/* View Mode Toggle */}
      <div className="btn-group btn-group-sm">
        <button
          className={`btn btn-sm ${viewMode === 'visual' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setViewMode('visual')}
          style={{
            backgroundColor: viewMode === 'visual' ? '#5a5a5a' : 'transparent',
            border: '1px solid #2b2b2b',
            color: '#cbcbcb',
            padding: '4px 12px',
            fontSize: '12px'
          }}
          title="Edit Mode"
        >
          <IconCode size={14} className="me-1" />
          Edit
        </button>
        <button
          className={`btn btn-sm ${viewMode === 'preview' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setViewMode('preview')}
          style={{
            backgroundColor: viewMode === 'preview' ? '#5a5a5a' : 'transparent',
            border: '1px solid #2b2b2b',
            color: '#cbcbcb',
            padding: '4px 12px',
            fontSize: '12px'
          }}
          title="Preview Mode"
        >
          <IconEye size={14} className="me-1" />
          Preview
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#2b2b2b' }}></div>

      {/* Layout Controls */}
      <button
        className="btn btn-sm"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #2b2b2b',
          color: '#cbcbcb',
          padding: '4px 12px',
          fontSize: '12px'
        }}
        title="Layout"
      >
        <IconLayout2 size={14} className="me-1" />
        Layout
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }}></div>

      {/* Info Badge */}
      <div
        style={{
          backgroundColor: '#2b2b2b',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#8a8a8a'
        }}
      >
        {blockCount} {blockCount === 1 ? 'block' : 'blocks'}
      </div>
    </div>
  )
}
