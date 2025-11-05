import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconPlus, IconEdit, IconTrash, IconFileText, IconCalendar, IconDownload, IconEye } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'

export default function Bulletins() {
  const [bulletins, setBulletins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBulletin, setEditingBulletin] = useState(null)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    fileUrl: '',
    category: 'bulletin'
  })

  const categories = [
    { value: 'bulletin', label: 'Weekly Bulletin' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'announcement', label: 'Special Announcement' },
    { value: 'program', label: 'Event Program' }
  ]

  useEffect(() => {
    loadBulletins()
  }, [])

  const loadBulletins = async () => {
    try {
      setLoading(true)
      // TODO: Fetch from API once backend is ready
      // For now, load from localStorage
      const stored = localStorage.getItem('bulletins')
      if (stored) {
        setBulletins(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading bulletins:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveBulletins = (updatedBulletins) => {
    // TODO: Save to API once backend is ready
    localStorage.setItem('bulletins', JSON.stringify(updatedBulletins))
    setBulletins(updatedBulletins)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.fileUrl) {
      setAlert({ message: 'Please fill in required fields', type: 'error' })
      return
    }

    if (editingBulletin) {
      // Update existing bulletin
      const updatedBulletins = bulletins.map(b =>
        b.id === editingBulletin.id ? { ...formData, id: b.id } : b
      )
      saveBulletins(updatedBulletins)
      setAlert({ message: 'Bulletin updated successfully!', type: 'success' })
    } else {
      // Add new bulletin
      const newBulletin = {
        ...formData,
        id: Date.now().toString()
      }
      saveBulletins([newBulletin, ...bulletins])
      setAlert({ message: 'Bulletin added successfully!', type: 'success' })
    }

    resetForm()
  }

  const handleEdit = (bulletin) => {
    setEditingBulletin(bulletin)
    setFormData(bulletin)
    setShowForm(true)
  }

  const handleDeleteClick = (bulletin) => {
    setConfirmDelete(bulletin)
  }

  const deleteBulletin = () => {
    if (!confirmDelete) return

    const updatedBulletins = bulletins.filter(b => b.id !== confirmDelete.id)
    saveBulletins(updatedBulletins)
    setAlert({ message: `"${confirmDelete.title}" deleted successfully!`, type: 'success' })
    setConfirmDelete(null)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      description: '',
      fileUrl: '',
      category: 'bulletin'
    })
    setEditingBulletin(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue)
    return category ? category.label : categoryValue
  }

  const getCategoryColor = (categoryValue) => {
    const colors = {
      bulletin: 'primary',
      newsletter: 'success',
      announcement: 'warning',
      program: 'info'
    }
    return colors[categoryValue] || 'secondary'
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
              <h2 className="page-title">Bulletin Management</h2>
              <p className="text-muted mt-1">Manage weekly bulletins, newsletters, and announcements</p>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <IconPlus size={20} className="me-1" />
                {showForm ? 'Cancel' : 'Add Document'}
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconFileText className="me-2" size={20} />
                {editingBulletin ? 'Edit Document' : 'Add New Document'}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label required">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="e.g., Weekly Bulletin - December 21, 2024"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
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
                  <div className="col-md-8 mb-3">
                    <label className="form-label required">File URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="fileUrl"
                      placeholder="https://example.com/bulletin.pdf"
                      value={formData.fileUrl}
                      onChange={handleInputChange}
                      required
                    />
                    <small className="form-hint">Full URL to PDF or document file from Media Library</small>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="2"
                      placeholder="Optional description or notes"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingBulletin ? 'Update Document' : 'Add Document'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulletins List */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <IconFileText className="me-2" size={20} />
              Document Archive ({bulletins.length})
            </h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Loading documents...</p>
              </div>
            ) : bulletins.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <IconFileText size={64} className="text-muted" />
                </div>
                <p className="empty-title h3">No documents yet</p>
                <p className="empty-subtitle text-muted">
                  Add your first bulletin or newsletter to get started
                </p>
              </div>
            ) : (
              <div className="row row-cards">
                {bulletins.map((bulletin) => (
                  <div key={bulletin.id} className="col-md-6 col-lg-4">
                    <div className="card card-sm shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-start mb-2">
                          <div className={`avatar avatar-md bg-${getCategoryColor(bulletin.category)}-lt me-3`}>
                            <IconFileText size={24} />
                          </div>
                          <div className="flex-grow-1">
                            <span className={`badge bg-${getCategoryColor(bulletin.category)}-lt mb-2`}>
                              {getCategoryLabel(bulletin.category)}
                            </span>
                            <h4 className="card-title mb-1">{bulletin.title}</h4>
                            <div className="text-muted small mb-2">
                              <IconCalendar size={16} className="me-1" />
                              {formatDate(bulletin.date)}
                            </div>
                            {bulletin.description && (
                              <p className="text-muted small mb-3">{bulletin.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="d-flex gap-2 mb-2">
                          <a
                            href={bulletin.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary w-100"
                          >
                            <IconEye size={16} className="me-1" />
                            View
                          </a>
                          <a
                            href={bulletin.fileUrl}
                            download
                            className="btn btn-sm btn-outline-primary w-100"
                          >
                            <IconDownload size={16} className="me-1" />
                            Download
                          </a>
                        </div>
                        <div className="btn-list">
                          <button
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={() => handleEdit(bulletin)}
                          >
                            <IconEdit size={16} className="me-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => handleDeleteClick(bulletin)}
                          >
                            <IconTrash size={16} className="me-1" />
                            Delete
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
          title="Delete Document"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          onConfirm={deleteBulletin}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
