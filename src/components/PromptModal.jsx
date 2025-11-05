import { useState, useEffect } from 'react'

export default function PromptModal({ isOpen, title, message, defaultValue = '', onConfirm, onCancel, placeholder = '' }) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(value)
    setValue('')
  }

  const handleCancel = () => {
    onCancel()
    setValue('')
  }

  return (
    <>
      <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                {message && <p className="mb-3">{message}</p>}
                <input
                  type="text"
                  className="form-control"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-link link-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary ms-auto">
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}
