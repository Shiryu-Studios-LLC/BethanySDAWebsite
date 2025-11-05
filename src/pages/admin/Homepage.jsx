import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconVideo, IconPhoto, IconMessageCircle } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'

export default function Homepage() {
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [settings, setSettings] = useState({
    heroVideoUrl: '/videos/hero.mp4',
    heroImageUrl: '',
    welcomeMessage: 'Join us in worship, fellowship, and service as we grow together in faith',
    liveStreamUrl: '',
    showLiveStream: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('homepageSettings')
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading homepage settings:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const extractYouTubeId = (url) => {
    if (!url) return null
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/live\/([^&\n?#]+)/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate YouTube URL if live stream is enabled
      if (settings.showLiveStream && settings.liveStreamUrl) {
        const videoId = extractYouTubeId(settings.liveStreamUrl)
        if (!videoId) {
          setAlert({ message: 'Please enter a valid YouTube URL', type: 'error' })
          setSaving(false)
          return
        }
      }

      // TODO: Save to API once backend is ready
      localStorage.setItem('homepageSettings', JSON.stringify(settings))

      setAlert({ message: 'Homepage settings saved successfully!', type: 'success' })

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

  const youtubeId = extractYouTubeId(settings.liveStreamUrl)

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
              <h2 className="page-title">Homepage Settings</h2>
              <p className="text-muted mt-1">Configure homepage hero section and live stream</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Live Stream Settings */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconVideo className="me-2" size={20} />
                Live Stream Settings
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="showLiveStream"
                      checked={settings.showLiveStream}
                      onChange={handleInputChange}
                    />
                    <span className="form-check-label">Enable Live Stream</span>
                    <small className="form-hint">When enabled, live stream will replace the hero video</small>
                  </label>
                </div>

                {settings.showLiveStream && (
                  <>
                    <div className="col-12 mb-3">
                      <label className="form-label">YouTube Live Stream URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="liveStreamUrl"
                        value={settings.liveStreamUrl}
                        onChange={handleInputChange}
                        placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                      />
                      <small className="form-hint">
                        Enter your YouTube live stream URL. Visitors will see a muted preview and can click to watch with full controls.
                      </small>
                    </div>

                    {youtubeId && (
                      <div className="col-12 mb-3">
                        <label className="form-label">Preview</label>
                        <div className="card">
                          <div className="card-body p-0">
                            <div className="ratio ratio-16x9">
                              <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1`}
                                title="YouTube Live Preview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        </div>
                        <small className="text-muted">
                          This is a preview. On the homepage, it will play muted in the background with a "LIVE NOW" badge.
                        </small>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Hero Section Settings */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconPhoto className="me-2" size={20} />
                Hero Section
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Hero Video URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="heroVideoUrl"
                    value={settings.heroVideoUrl}
                    onChange={handleInputChange}
                    placeholder="/videos/hero.mp4"
                  />
                  <small className="form-hint">Background video for the hero section (when not live streaming)</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Hero Image URL (Fallback)</label>
                  <input
                    type="url"
                    className="form-control"
                    name="heroImageUrl"
                    value={settings.heroImageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <small className="form-hint">Image to display if video fails to load</small>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Welcome Message</label>
                  <textarea
                    className="form-control"
                    name="welcomeMessage"
                    rows="3"
                    value={settings.welcomeMessage}
                    onChange={handleInputChange}
                    placeholder="Welcome message to display on homepage hero section..."
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
