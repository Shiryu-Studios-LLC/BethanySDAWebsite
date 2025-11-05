import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconTrash, IconLink, IconPhoto, IconVideo } from '@tabler/icons-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Youtube from '@tiptap/extension-youtube'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'
import PromptModal from '../../components/PromptModal'
import '../../tiptap.css'

export default function PageEditor() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isNewPage = slug === 'new'

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNewPage)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [promptModal, setPromptModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    defaultValue: '',
    placeholder: '',
    onConfirm: null
  })
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: true,
    show_in_nav: false,
    nav_order: 999
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary',
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'img-fluid rounded',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Youtube.configure({
        width: 640,
        height: 360,
      }),
    ],
    content: pageData.content,
    onUpdate: ({ editor }) => {
      setPageData(prev => ({ ...prev, content: editor.getHTML() }))
    },
  })

  // Helper functions for editor actions
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    setPromptModal({
      isOpen: true,
      title: 'Add Link',
      message: 'Enter the URL for the link:',
      defaultValue: previousUrl || '',
      placeholder: 'https://example.com',
      onConfirm: (url) => {
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }
        setPromptModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }, [editor])

  const addImage = useCallback(() => {
    setPromptModal({
      isOpen: true,
      title: 'Add Image',
      message: 'Enter the image URL:',
      defaultValue: '',
      placeholder: 'https://example.com/image.jpg',
      onConfirm: (url) => {
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
        setPromptModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }, [editor])

  const addYouTubeVideo = useCallback(() => {
    setPromptModal({
      isOpen: true,
      title: 'Embed YouTube Video',
      message: 'Enter the YouTube video URL:',
      defaultValue: '',
      placeholder: 'https://www.youtube.com/watch?v=...',
      onConfirm: (url) => {
        if (url) {
          editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
        setPromptModal(prev => ({ ...prev, isOpen: false }))
      }
    })
  }, [editor])

  const addButton = useCallback(() => {
    setPromptModal({
      isOpen: true,
      title: 'Create Button',
      message: 'Enter button text:',
      defaultValue: 'Click Here',
      placeholder: 'Button text',
      onConfirm: (text) => {
        if (text) {
          // Ask for URL in a second prompt
          setPromptModal({
            isOpen: true,
            title: 'Button URL',
            message: 'Enter the button URL:',
            defaultValue: '/',
            placeholder: '/page-url or https://...',
            onConfirm: (url) => {
              if (url) {
                editor.chain().focus().insertContent(
                  `<p><a href="${url}" class="btn btn-primary">${text}</a></p>`
                ).run()
              }
              setPromptModal(prev => ({ ...prev, isOpen: false }))
            }
          })
        } else {
          setPromptModal(prev => ({ ...prev, isOpen: false }))
        }
      }
    })
  }, [editor])

  useEffect(() => {
    if (!isNewPage) {
      loadPage()
    }
  }, [slug])

  useEffect(() => {
    if (editor && pageData.content && editor.getHTML() !== pageData.content) {
      editor.commands.setContent(pageData.content)
    }
  }, [pageData.content, editor])

  const loadPage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pages/${slug}`)

      if (response.ok) {
        const data = await response.json()
        setPageData({
          ...data,
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

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
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

          {/* Content Editor */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">Page Content</h3>
            </div>
            <div className="card-body">
              <div className="tiptap-editor-toolbar mb-3 p-2 bg-light rounded">
                {/* Text Formatting */}
                <div className="mb-2">
                  <small className="text-muted d-block mb-1">Text Formatting</small>
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`btn btn-sm ${editor?.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`btn btn-sm ${editor?.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      className={`btn btn-sm ${editor?.isActive('underline') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Underline"
                    >
                      <u>U</u>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleStrike().run()}
                      className={`btn btn-sm ${editor?.isActive('strike') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Strikethrough"
                    >
                      <s>S</s>
                    </button>
                  </div>

                  {/* Headings */}
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`btn btn-sm ${editor?.isActive('heading', { level: 1 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`btn btn-sm ${editor?.isActive('heading', { level: 2 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`btn btn-sm ${editor?.isActive('heading', { level: 3 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Heading 3"
                    >
                      H3
                    </button>
                  </div>

                  {/* Text Color */}
                  <div className="btn-group" role="group">
                    <input
                      type="color"
                      className="form-control form-control-sm"
                      style={{ width: '50px', height: '31px' }}
                      onInput={event => editor?.chain().focus().setColor(event.target.value).run()}
                      value={editor?.getAttributes('textStyle').color || '#000000'}
                      title="Text Color"
                    />
                  </div>
                </div>

                {/* Alignment & Lists */}
                <div className="mb-2">
                  <small className="text-muted d-block mb-1">Alignment & Lists</small>
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: 'left' }) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Align Left"
                    >
                      ⬅
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: 'center' }) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Align Center"
                    >
                      ↔
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                      className={`btn btn-sm ${editor?.isActive({ textAlign: 'right' }) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Align Right"
                    >
                      ➡
                    </button>
                  </div>

                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`btn btn-sm ${editor?.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`btn btn-sm ${editor?.isActive('orderedList') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Numbered List"
                    >
                      1. List
                    </button>
                  </div>

                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      className={`btn btn-sm ${editor?.isActive('blockquote') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Quote"
                    >
                      " Quote
                    </button>
                  </div>
                </div>

                {/* Links & Media */}
                <div>
                  <small className="text-muted d-block mb-1">Links & Media</small>
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={setLink}
                      className={`btn btn-sm ${editor?.isActive('link') ? 'btn-primary' : 'btn-outline-secondary'}`}
                      title="Add Link"
                    >
                      <IconLink size={16} className="me-1" />
                      Link
                    </button>
                    {editor?.isActive('link') && (
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="btn btn-sm btn-outline-danger"
                        title="Remove Link"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={addImage}
                      className="btn btn-sm btn-outline-secondary"
                      title="Add Image"
                    >
                      <IconPhoto size={16} className="me-1" />
                      Image
                    </button>
                  </div>

                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      onClick={addYouTubeVideo}
                      className="btn btn-sm btn-outline-secondary"
                      title="Embed YouTube Video"
                    >
                      <IconVideo size={16} className="me-1" />
                      YouTube
                    </button>
                  </div>

                  {/* Button Creator */}
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      onClick={addButton}
                      className="btn btn-sm btn-outline-secondary"
                      title="Add Button"
                    >
                      🔘 Button
                    </button>
                  </div>
                </div>
              </div>
              <div className="tiptap-editor border rounded p-3" style={{ minHeight: '300px' }}>
                <EditorContent editor={editor} />
              </div>
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

      {/* Prompt Modal */}
      <PromptModal
        isOpen={promptModal.isOpen}
        title={promptModal.title}
        message={promptModal.message}
        defaultValue={promptModal.defaultValue}
        placeholder={promptModal.placeholder}
        onConfirm={promptModal.onConfirm || (() => {})}
        onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
