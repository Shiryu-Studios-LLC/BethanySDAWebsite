import { IconCheck, IconAlertCircle, IconX } from '@tabler/icons-react'

export default function AlertModal({ message, type = 'info', onClose }) {
  if (!message) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IconCheck size={24} className="text-success" />
      case 'error':
        return <IconAlertCircle size={24} className="text-danger" />
      default:
        return <IconAlertCircle size={24} className="text-info" />
    }
  }

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'border-success'
      case 'error':
        return 'border-danger'
      default:
        return 'border-info'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`modal-content border-start border-4 ${getColorClass()}`}>
            <div className="modal-body">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  {getIcon()}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">{message}</p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={onClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
