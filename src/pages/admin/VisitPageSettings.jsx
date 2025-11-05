import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconMapPin, IconFileText } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'

export default function VisitPageSettings() {
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [settings, setSettings] = useState({
    visitPageTitle: 'Plan Your Visit',
    visitPageDescription: 'We\'d love to meet you! Here\'s everything you need to know for your first visit to Bethany SDA Church.'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('visitPageSettings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading visit page settings:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // TODO: Save to API once backend is ready
      localStorage.setItem('visitPageSettings', JSON.stringify(settings))

      setAlert({ message: 'Visit page settings saved successfully!', type: 'success' })

      setTimeout(() => {
        setAlert({ message: '', type: '' })
      }, 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setAlert({ message: 'Error saving settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle">
                <Link to="/admin/settings" className="text-muted text-decoration-none">
                  <IconArrowLeft className="me-1" size={16} />
                  Back to Site Settings
                </Link>
              </div>
              <h2 className="page-title">Visit Page Settings</h2>
              <p className="text-muted mt-1">Configure visit page content and visitor information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Page Content */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconFileText className="me-2" size={20} />
                Page Content
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">Page Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="visitPageTitle"
                    value={settings.visitPageTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Plan Your Visit"
                  />
                  <small className="form-hint">Main heading displayed at the top of the visit page</small>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Page Description</label>
                  <textarea
                    className="form-control"
                    name="visitPageDescription"
                    rows="4"
                    value={settings.visitPageDescription}
                    onChange={handleInputChange}
                    placeholder="Description for the visit page..."
                  />
                  <small className="form-hint">Welcoming message shown below the title</small>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="card mt-4">
            <div className="card-footer d-flex justify-content-end gap-2">
              <Link to="/admin/settings" className="btn btn-outline-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <IconCheck size={20} className="me-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Alert Modal */}
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />
    </div>
  )
}
