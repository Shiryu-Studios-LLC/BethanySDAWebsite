import { IconEye, IconCode, IconDeviceFloppy, IconArrowBackUp, IconArrowForwardUp, IconCopy, IconTrash, IconSettings, IconSearch, IconLayoutGrid, IconZoomIn, IconZoomOut } from '@tabler/icons-react'

export default function UnityToolbar({
  viewMode,
  setViewMode,
  blockCount,
  onUndo,
  onRedo,
  onSave,
  canUndo = false,
  canRedo = false,
  onCopy,
  onDelete,
  hasSelection = false,
  zoom = 100,
  onZoomChange
}) {
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
        gap: '12px',
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
          title="Edit Mode (Ctrl+E)"
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
          title="Preview Mode (Ctrl+P)"
        >
          <IconEye size={14} className="me-1" />
          Preview
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#2b2b2b' }}></div>

      {/* Undo/Redo */}
      <div className="btn-group btn-group-sm">
        <button
          className="btn btn-sm"
          onClick={onUndo}
          disabled={!canUndo}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #2b2b2b',
            color: canUndo ? '#cbcbcb' : '#4a4a4a',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: canUndo ? 'pointer' : 'not-allowed'
          }}
          title="Undo (Ctrl+Z)"
        >
          <IconArrowBackUp size={14} />
        </button>
        <button
          className="btn btn-sm"
          onClick={onRedo}
          disabled={!canRedo}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #2b2b2b',
            color: canRedo ? '#cbcbcb' : '#4a4a4a',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: canRedo ? 'pointer' : 'not-allowed'
          }}
          title="Redo (Ctrl+Y)"
        >
          <IconArrowForwardUp size={14} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#2b2b2b' }}></div>

      {/* Selection Actions */}
      <div className="btn-group btn-group-sm">
        <button
          className="btn btn-sm"
          onClick={onCopy}
          disabled={!hasSelection}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #2b2b2b',
            color: hasSelection ? '#cbcbcb' : '#4a4a4a',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed'
          }}
          title="Duplicate (Ctrl+D)"
        >
          <IconCopy size={14} />
        </button>
        <button
          className="btn btn-sm"
          onClick={onDelete}
          disabled={!hasSelection}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #2b2b2b',
            color: hasSelection ? '#dc2626' : '#4a4a4a',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: hasSelection ? 'pointer' : 'not-allowed'
          }}
          title="Delete (Del)"
        >
          <IconTrash size={14} />
        </button>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }}></div>

      {/* Zoom Controls */}
      {zoom !== undefined && onZoomChange && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="btn btn-sm"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #2b2b2b',
                color: '#cbcbcb',
                padding: '4px 6px',
                fontSize: '12px'
              }}
              title="Zoom Out"
            >
              <IconZoomOut size={12} />
            </button>
            <span style={{
              fontSize: '11px',
              minWidth: '45px',
              textAlign: 'center',
              color: '#8a8a8a'
            }}>
              {zoom}%
            </span>
            <button
              className="btn btn-sm"
              onClick={() => onZoomChange(Math.min(200, zoom + 10))}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #2b2b2b',
                color: '#cbcbcb',
                padding: '4px 6px',
                fontSize: '12px'
              }}
              title="Zoom In"
            >
              <IconZoomIn size={12} />
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#2b2b2b' }}></div>
        </>
      )}

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

      {/* Save Button */}
      {onSave && (
        <button
          className="btn btn-sm"
          onClick={onSave}
          style={{
            backgroundColor: '#4a90e2',
            border: '1px solid #3a7bc8',
            color: '#fff',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '600'
          }}
          title="Save Changes (Ctrl+S)"
        >
          <IconDeviceFloppy size={14} className="me-1" />
          Save
        </button>
      )}
    </div>
  )
}
