import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconPlus, IconEdit, IconTrash, IconMicrophone, IconVideo, IconCalendar, IconUser } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'

export default function Sermons() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSermon, setEditingSermon] = useState(null)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    description: '',
    videoUrl: '',
    audioUrl: '',
    duration: '',
    series: ''
  })

  useEffect(() => {
    loadSermons()
  }, [])

  const loadSermons = async () => {
    try {
      setLoading(true)
      // TODO: Fetch from API once backend is ready
      // For now, load from localStorage
      const stored = localStorage.getItem('sermons')
      if (stored) {
        setSermons(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading sermons:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSermons = (updatedSermons) => {
    // TODO: Save to API once backend is ready
    localStorage.setItem('sermons', JSON.stringify(updatedSermons))
    setSermons(updatedSermons)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.speaker || !formData.date) {
      setAlert({ message: 'Please fill in required fields', type: 'error' })
      return
    }

    if (editingSermon) {
      // Update existing sermon
      const updatedSermons = sermons.map(s =>
        s.id === editingSermon.id ? { ...formData, id: s.id } : s
      )
      saveSermons(updatedSermons)
      setAlert({ message: 'Sermon updated successfully!', type: 'success' })
    } else {
      // Add new sermon
      const newSermon = {
        ...formData,
        id: Date.now().toString()
      }
      saveSermons([newSermon, ...sermons])
      setAlert({ message: 'Sermon added successfully!', type: 'success' })
    }

    resetForm()
  }

  const handleEdit = (sermon) => {
    setEditingSermon(sermon)
    setFormData(sermon)
    setShowForm(true)
  }

  const handleDeleteClick = (sermon) => {
    setConfirmDelete(sermon)
  }

  const deleteSermon = () => {
    if (!confirmDelete) return

    const updatedSermons = sermons.filter(s => s.id !== confirmDelete.id)
    saveSermons(updatedSermons)
    setAlert({ message: `"${confirmDelete.title}" deleted successfully!`, type: 'success' })
    setConfirmDelete(null)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      speaker: '',
      date: '',
      description: '',
      videoUrl: '',
      audioUrl: '',
      duration: '',
      series: ''
    })
    setEditingSermon(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
              <h2 className="page-title">Sermon Management</h2>
              <p className="text-muted mt-1">Manage sermon recordings and archives</p>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <IconPlus size={20} className="me-1" />
                {showForm ? 'Cancel' : 'Add Sermon'}
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconMicrophone className="me-2" size={20} />
                {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label required">Speaker</label>
                    <input
                      type="text"
                      className="form-control"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      name="duration"
                      placeholder="e.g., 45 minutes"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Series</label>
                    <input
                      type="text"
                      className="form-control"
                      name="series"
                      placeholder="e.g., Gospel of John"
                      value={formData.series}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Video URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="videoUrl"
                      placeholder="https://example.com/video.mp4"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                    />
                    <small className="form-hint">Full URL to video file or YouTube link</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Audio URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="audioUrl"
                      placeholder="https://example.com/audio.mp3"
                      value={formData.audioUrl}
                      onChange={handleInputChange}
                    />
                    <small className="form-hint">Full URL to audio file</small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingSermon ? 'Update Sermon' : 'Add Sermon'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sermons List */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <IconMicrophone className="me-2" size={20} />
              Sermon Archive ({sermons.length})
            </h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Loading sermons...</p>
              </div>
            ) : sermons.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <IconMicrophone size={64} className="text-muted" />
                </div>
                <p className="empty-title h3">No sermons yet</p>
                <p className="empty-subtitle text-muted">
                  Add your first sermon to get started
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {sermons.map((sermon) => (
                  <div key={sermon.id} className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col">
                        <h4 className="mb-1">{sermon.title}</h4>
                        <div className="text-muted small">
                          <span className="me-3">
                            <IconUser size={16} className="me-1" />
                            {sermon.speaker}
                          </span>
                          <span className="me-3">
                            <IconCalendar size={16} className="me-1" />
                            {formatDate(sermon.date)}
                          </span>
                          {sermon.duration && (
                            <span className="me-3">
                              Duration: {sermon.duration}
                            </span>
                          )}
                          {sermon.series && (
                            <span className="badge bg-primary-lt">
                              {sermon.series}
                            </span>
                          )}
                        </div>
                        {sermon.description && (
                          <p className="text-muted mb-2 mt-2">{sermon.description}</p>
                        )}
                        <div className="d-flex gap-2">
                          {sermon.videoUrl && (
                            <a
                              href={sermon.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              <IconVideo size={16} className="me-1" />
                              Watch Video
                            </a>
                          )}
                          {sermon.audioUrl && (
                            <a
                              href={sermon.audioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success"
                            >
                              <IconMicrophone size={16} className="me-1" />
                              Listen Audio
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="btn-list">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(sermon)}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(sermon)}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Sermon"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          onConfirm={deleteSermon}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
