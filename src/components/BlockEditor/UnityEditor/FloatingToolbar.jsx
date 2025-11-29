import { IconCopy, IconTrash, IconArrowUp, IconArrowDown, IconEye, IconEyeOff, IconLock, IconLockOpen, IconSettings } from '@tabler/icons-react'

export default function FloatingToolbar({
  selectedBlock,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  position
}) {
  if (!selectedBlock || !position) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-100%) translateY(-8px)',
        backgroundColor: '#383838',
        border: '1px solid #1a1a1a',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        gap: '2px',
        padding: '4px',
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
    >
      {/* Move Up */}
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        style={{
          background: 'transparent',
          border: 'none',
          color: canMoveUp ? '#cbcbcb' : '#4a4a4a',
          cursor: canMoveUp ? 'pointer' : 'not-allowed',
          padding: '6px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '11px'
        }}
        onMouseEnter={(e) => {
          if (canMoveUp) e.currentTarget.style.backgroundColor = '#4a4a4a'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        title="Move Up"
      >
        <IconArrowUp size={14} />
      </button>

      {/* Move Down */}
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        style={{
          background: 'transparent',
          border: 'none',
          color: canMoveDown ? '#cbcbcb' : '#4a4a4a',
          cursor: canMoveDown ? 'pointer' : 'not-allowed',
          padding: '6px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '11px'
        }}
        onMouseEnter={(e) => {
          if (canMoveDown) e.currentTarget.style.backgroundColor = '#4a4a4a'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        title="Move Down"
      >
        <IconArrowDown size={14} />
      </button>

      {/* Divider */}
      <div style={{ width: '1px', backgroundColor: '#2b2b2b', margin: '4px 2px' }}></div>

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#cbcbcb',
          cursor: 'pointer',
          padding: '6px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '11px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a4a4a'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        title="Duplicate (Ctrl+D)"
      >
        <IconCopy size={14} />
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#dc2626',
          cursor: 'pointer',
          padding: '6px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '11px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4a4a4a'
          e.currentTarget.style.color = '#ef4444'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#dc2626'
        }}
        title="Delete (Del)"
      >
        <IconTrash size={14} />
      </button>
    </div>
  )
}
