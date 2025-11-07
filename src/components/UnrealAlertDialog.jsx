import { IconAlertTriangle, IconInfoCircle, IconCircleCheck } from '@tabler/icons-react'

export default function UnrealAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info', // 'info', 'warning', 'success', 'error'
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false
}) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'warning':
      case 'error':
        return <IconAlertTriangle size={48} style={{ color: '#ff6b6b' }} />
      case 'success':
        return <IconCircleCheck size={48} style={{ color: '#5a9b5a' }} />
      case 'info':
      default:
        return <IconInfoCircle size={48} style={{ color: '#4a7ba7' }} />
    }
  }

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }}
      >
        {/* Dialog */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #4a4a4a',
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            width: '480px',
            maxWidth: '90vw',
            overflow: 'hidden',
            animation: 'slideIn 0.2s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #3a3a3a',
              backgroundColor: '#252525'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              {getIcon()}
              <h2 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#e0e0e0'
              }}>
                {title}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div style={{
            padding: '24px',
            color: '#c0c0c0',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {message}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #3a3a3a',
              backgroundColor: '#252525',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            {showCancel && (
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#3a3a3a',
                  border: '1px solid #4a4a4a',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#4a4a4a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3a3a3a'}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              style={{
                padding: '8px 20px',
                backgroundColor: type === 'error' || type === 'warning' ? '#c74440' : '#4a7ba7',
                border: '1px solid ' + (type === 'error' || type === 'warning' ? '#d75450' : '#5a8bb7'),
                borderRadius: '3px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = type === 'error' || type === 'warning' ? '#d75450' : '#5a8bb7'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = type === 'error' || type === 'warning' ? '#c74440' : '#4a7ba7'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
