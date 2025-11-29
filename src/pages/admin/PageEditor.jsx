import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconTrash } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'
import UnityEditor from '../../components/BlockEditor/UnityEditor'

export default function PageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNewPage = slug === 'new'
  const isCorePages = ['home', 'visit', 'about'].includes(slug)

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNewPage)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(false)
  // Default starter blocks for new pages
  const defaultBlocks = [
    {
      id: `block-${Date.now()}-1`,
      type: 'hero',
      content: {
        title: 'Page Title',
        subtitle: 'Add your page description here',
        buttonText: '',
        buttonUrl: '',
        backgroundType: 'color',
        backgroundColor: '#0054a6',
        backgroundImage: '',
        backgroundVideo: ''
      }
    },
    {
      id: `block-${Date.now()}-2`,
      type: 'text',
      content: {
        html: '<p>Start writing your content here...</p>'
      }
    }
  ]

  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    content: isNewPage ? defaultBlocks : [],
    meta_description: '',
    is_published: true,
    show_in_nav: false,
    nav_order: 999,
    show_page_header: true
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
          show_in_nav: Boolean(data.show_in_nav),
          show_page_header: data.show_page_header !== undefined ? Boolean(data.show_page_header) : true
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
            {!isNewPage && !isCorePages && (
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
          {/* Unity-Style Page Builder */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Page Content</h3>
            </div>
            <div className="card-body p-0">
              <UnityEditor
                blocks={pageData.content}
                onChange={handleBlocksChange}
                pageTitle={pageData.title}
                pageSubtitle={pageData.meta_description}
                showPageHeader={pageData.show_page_header}
                onSave={handleSubmit}
              />
            </div>
          </div>

          {/* Compact Page Info & Settings */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="row g-3">
                {/* Page Info */}
                <div className="col-md-6">
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
                <div className="col-md-3">
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
                </div>
                <div className="col-md-3">
                  <label className="form-label">Nav Order</label>
                  <input
                    type="number"
                    className="form-control"
                    name="nav_order"
                    value={pageData.nav_order}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="col-md-12">
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

                {/* Settings - Inline */}
                <div className="col-12">
                  <div className="d-flex gap-4 flex-wrap">
                    <label className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_published"
                        checked={pageData.is_published}
                        onChange={handleInputChange}
                      />
                      <span className="form-check-label">Published</span>
                    </label>
                    <label className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="show_in_nav"
                        checked={pageData.show_in_nav}
                        onChange={handleInputChange}
                      />
                      <span className="form-check-label">Show in Nav</span>
                    </label>
                    <label className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="show_page_header"
                        checked={pageData.show_page_header}
                        onChange={handleInputChange}
                      />
                      <span className="form-check-label">Show Page Header</span>
                    </label>
                  </div>
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

      {/* Confirm Delete Modal - Only for custom pages (not core pages) */}
      {!isNewPage && !isCorePages && (
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
