import { IconAlertTriangle } from '@tabler/icons-react'

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  if (!message) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onCancel}
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
        onClick={onCancel}
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title d-flex align-items-center">
                <IconAlertTriangle size={24} className="text-warning me-2" />
                {title || 'Confirm Action'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
