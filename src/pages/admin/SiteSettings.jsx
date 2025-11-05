import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconSettings, IconBuildingChurch, IconMail, IconPhone, IconMapPin, IconBrandFacebook, IconBrandYoutube, IconBrandInstagram, IconBrandTwitter, IconClock, IconCheck } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'

export default function SiteSettings() {
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [settings, setSettings] = useState({
    // Church Information
    churchName: 'Bethany SDA Church',
    tagline: 'A community of faith, hope, and love',
    description: '',

    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Service Times
    sabbathSchool: '',
    worshipService: '',
    prayerMeeting: '',

    // Social Media
    facebook: '',
    youtube: '',
    instagram: '',
    twitter: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      // Load from localStorage
      const stored = localStorage.getItem('siteSettings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // TODO: Save to API once backend is ready
      localStorage.setItem('siteSettings', JSON.stringify(settings))

      setAlert({ message: 'Settings saved successfully!', type: 'success' })

      // Hide success message after 3 seconds
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
                <Link to="/admin" className="text-muted text-decoration-none">
                  <IconArrowLeft className="me-1" size={16} />
                  Back to Admin Portal
                </Link>
              </div>
              <h2 className="page-title">Site Settings</h2>
              <p className="text-muted mt-1">Configure church information and website settings</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Site Settings Section */}
          <div className="mt-4">
            <h3 className="mb-3">
              <IconSettings className="me-2" size={24} />
              General Site Settings
            </h3>
            <p className="text-muted mb-4">Configure site-wide information that appears across all pages</p>
          </div>

          {/* Church Information */}
          <div className="card mt-3">
            <div className="card-header">
              <h3 className="card-title">
                <IconBuildingChurch className="me-2" size={20} />
                Church Information
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Church Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="churchName"
                    value={settings.churchName}
                    onChange={handleInputChange}
                    placeholder="e.g., Bethany SDA Church"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tagline</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tagline"
                    value={settings.tagline}
                    onChange={handleInputChange}
                    placeholder="e.g., A community of faith"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Church Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={settings.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your church..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card mt-3">
            <div className="card-header">
              <h3 className="card-title">
                <IconMail className="me-2" size={20} />
                Contact Information
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <IconMail size={16} className="me-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    placeholder="info@bethanysda.org"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <IconPhone size={16} className="me-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">
                    <IconMapPin size={16} className="me-1" />
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={settings.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={settings.state}
                    onChange={handleInputChange}
                    placeholder="ST"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipCode"
                    value={settings.zipCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Times */}
          <div className="card mt-3">
            <div className="card-header">
              <h3 className="card-title">
                <IconClock className="me-2" size={20} />
                Service Times
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Sabbath School</label>
                  <input
                    type="text"
                    className="form-control"
                    name="sabbathSchool"
                    value={settings.sabbathSchool}
                    onChange={handleInputChange}
                    placeholder="e.g., Saturday 9:30 AM"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Worship Service</label>
                  <input
                    type="text"
                    className="form-control"
                    name="worshipService"
                    value={settings.worshipService}
                    onChange={handleInputChange}
                    placeholder="e.g., Saturday 11:00 AM"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Prayer Meeting</label>
                  <input
                    type="text"
                    className="form-control"
                    name="prayerMeeting"
                    value={settings.prayerMeeting}
                    onChange={handleInputChange}
                    placeholder="e.g., Wednesday 7:00 PM"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card mt-3">
            <div className="card-header">
              <h3 className="card-title">
                <IconBrandFacebook className="me-2" size={20} />
                Social Media Links
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <IconBrandFacebook size={16} className="me-1" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="facebook"
                    value={settings.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/yourchurch"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <IconBrandYoutube size={16} className="me-1" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="youtube"
                    value={settings.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/@yourchurch"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <IconBrandInstagram size={16} className="me-1" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="instagram"
                    value={settings.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourchurch"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <IconBrandTwitter size={16} className="me-1" />
                    Twitter / X
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="twitter"
                    value={settings.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/yourchurch"
                  />
                </div>
              </div>
            </div>
          </div>         

          {/* Save Button */}
          <div className="card mt-4">
            <div className="card-footer d-flex justify-content-end gap-2">
              <Link to="/admin" className="btn btn-outline-secondary">
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
