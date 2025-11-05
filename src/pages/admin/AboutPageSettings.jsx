import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconInfoCircle, IconFileText } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'

export default function AboutPageSettings() {
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [settings, setSettings] = useState({
    missionStatement: 'To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.',
    ourHistory: 'Bethany SDA Church is a vibrant community of believers in Houston, Texas, celebrating our Haitian heritage while welcoming all who seek to worship God.',
    ourBeliefs: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('aboutPageSettings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading about page settings:', error)
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
      localStorage.setItem('aboutPageSettings', JSON.stringify(settings))

      setAlert({ message: 'About page settings saved successfully!', type: 'success' })

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
              <h2 className="page-title">About Page Settings</h2>
              <p className="text-muted mt-1">Configure mission statement, church history, and beliefs</p>
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
                  <label className="form-label">Mission Statement</label>
                  <textarea
                    className="form-control"
                    name="missionStatement"
                    rows="3"
                    value={settings.missionStatement}
                    onChange={handleInputChange}
                    placeholder="Your church's mission statement..."
                  />
                  <small className="form-hint">The mission statement that guides your church</small>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Our History</label>
                  <textarea
                    className="form-control"
                    name="ourHistory"
                    rows="6"
                    value={settings.ourHistory}
                    onChange={handleInputChange}
                    placeholder="History of your church..."
                  />
                  <small className="form-hint">Tell the story of how your church began and grew. Use line breaks for paragraphs.</small>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Our Beliefs</label>
                  <textarea
                    className="form-control"
                    name="ourBeliefs"
                    rows="6"
                    value={settings.ourBeliefs}
                    onChange={handleInputChange}
                    placeholder="Core beliefs and values..."
                  />
                  <small className="form-hint">Additional beliefs and theological positions (optional)</small>
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
