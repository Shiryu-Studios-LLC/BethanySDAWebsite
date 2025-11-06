import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconTrash } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'
import VisualBuilder from '../../components/BlockEditor/VisualBuilder'

export default function PageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNewPage = slug === 'new'

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNewPage)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    content: [],
    meta_description: '',
    is_published: true,
    show_in_nav: false,
    nav_order: 999
  })

  const handleBlocksChange = (newBlocks) => {
    setPageData(prev => ({ ...prev, content: newBlocks }))
  }

  useEffect(() => {
    if (!isNewPage) {
      loadPage()
    }
  }, [slug])

  const loadPage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pages/${slug}`)

      if (response.ok) {
        const data = await response.json()

        // Parse content from JSON string to blocks array
        let content = []
        if (data.content) {
          try {
            content = JSON.parse(data.content)
            // Ensure content is an array
            if (!Array.isArray(content)) {
              content = []
            }
          } catch (e) {
            console.warn('Failed to parse content as JSON, using empty array')
            content = []
          }
        }

        setPageData({
          ...data,
          content,
          is_published: Boolean(data.is_published),
          show_in_nav: Boolean(data.show_in_nav)
        })
      } else {
        setAlert({ message: 'Failed to load page', type: 'error' })
      }
    } catch (error) {
      console.error('Error loading page:', error)
      setAlert({ message: 'Error loading page', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setPageData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNewPage ? '/api/pages' : `/api/pages/${pageData.id}`
      const method = isNewPage ? 'POST' : 'PUT'

      // Convert blocks array to JSON string for storage
      const dataToSave = {
        ...pageData,
        content: JSON.stringify(pageData.content)
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      })

      if (response.ok) {
        const result = await response.json()
        setAlert({ message: `Page ${isNewPage ? 'created' : 'updated'} successfully!`, type: 'success' })

        if (isNewPage && result.slug) {
          setTimeout(() => navigate(`/admin/page-editor/${result.slug}`), 1500)
        }
      } else {
        const error = await response.json()
        setAlert({ message: error.error || 'Failed to save page', type: 'error' })
      }
    } catch (error) {
      console.error('Error saving page:', error)
      setAlert({ message: 'Error saving page', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/pages/${pageData.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAlert({ message: 'Page deleted successfully!', type: 'success' })
        setTimeout(() => navigate('/admin/pages'), 1500)
      } else {
        setAlert({ message: 'Failed to delete page', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      setAlert({ message: 'Error deleting page', type: 'error' })
    }
    setConfirmDelete(false)
  }

  if (loading) {
    return (
      <div className="page-body">
        <div className="container-xl d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle">
                <Link to="/admin/pages" className="text-muted text-decoration-none">
                  <IconArrowLeft className="me-1" size={16} />
                  Back to Pages
                </Link>
              </div>
              <h2 className="page-title">{isNewPage ? 'Create New Page' : 'Edit Page'}</h2>
            </div>
            {!isNewPage && (
              <div className="col-auto">
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="btn btn-outline-danger"
                >
                  <IconTrash size={16} className="me-1" />
                  Delete Page
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Page Information</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label required">Page Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={pageData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Ministries, Youth Programs, Contact Us"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    className="form-control"
                    name="slug"
                    value={pageData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated"
                    disabled={!isNewPage}
                  />
                  <small className="form-hint">
                    {isNewPage ? 'Leave empty to auto-generate from title' : 'Cannot be changed after creation'}
                  </small>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Meta Description (SEO)</label>
                  <textarea
                    className="form-control"
                    name="meta_description"
                    rows="2"
                    value={pageData.meta_description}
                    onChange={handleInputChange}
                    placeholder="Brief description for search engines..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visual Page Builder */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Page Content</h3>
            </div>
            <div className="card-body p-0">
              <VisualBuilder blocks={pageData.content} onChange={handleBlocksChange} />
            </div>
          </div>

          {/* Settings */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Page Settings</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="is_published"
                      checked={pageData.is_published}
                      onChange={handleInputChange}
                    />
                    <span className="form-check-label">Published</span>
                  </label>
                  <small className="form-hint">Page is visible to visitors</small>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="show_in_nav"
                      checked={pageData.show_in_nav}
                      onChange={handleInputChange}
                    />
                    <span className="form-check-label">Show in Navigation</span>
                  </label>
                  <small className="form-hint">Add to main menu</small>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Navigation Order</label>
                  <input
                    type="number"
                    className="form-control"
                    name="nav_order"
                    value={pageData.nav_order}
                    onChange={handleInputChange}
                    min="0"
                  />
                  <small className="form-hint">Lower numbers appear first</small>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="card mt-4">
            <div className="card-footer d-flex justify-content-end gap-2">
              <Link to="/admin/pages" className="btn btn-outline-secondary">
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
                    {isNewPage ? 'Create Page' : 'Save Changes'}
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

      {/* Confirm Delete Modal - Only for existing pages */}
      {!isNewPage && (
        <ConfirmModal
          isOpen={confirmDelete}
          title="Delete Page"
          message={`Are you sure you want to delete "${pageData.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
