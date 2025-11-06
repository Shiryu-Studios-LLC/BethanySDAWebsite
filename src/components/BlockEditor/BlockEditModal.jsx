import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function BlockEditModal({ block, isOpen, onSave, onCancel }) {
  const [editedBlock, setEditedBlock] = useState(block)

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedBlock?.content?.html || '',
    onUpdate: ({ editor }) => {
      if (editedBlock?.type === 'text' || (editedBlock?.type === 'columns')) {
        setEditedBlock(prev => ({
          ...prev,
          content: { ...prev.content, html: editor.getHTML() }
        }))
      }
    },
  })

  useEffect(() => {
    setEditedBlock(block)
    if (editor && block?.content?.html) {
      editor.commands.setContent(block.content.html)
    }
  }, [block, editor])

  if (!isOpen || !editedBlock) return null

  const handleSave = () => {
    onSave(editedBlock)
  }

  const updateContent = (field, value) => {
    setEditedBlock(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }))
  }

  const renderEditor = () => {
    switch (editedBlock.type) {
      case 'hero':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subtitle</label>
              <textarea
                className="form-control"
                rows="2"
                value={editedBlock.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Button Text (optional)</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Button URL</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.buttonUrl || ''}
                onChange={(e) => updateContent('buttonUrl', e.target.value)}
                placeholder="/page-url"
              />
            </div>

            <hr className="my-4" />
            <h6 className="mb-3">Background</h6>

            <div className="mb-3">
              <label className="form-label">Background Type</label>
              <select
                className="form-select"
                value={editedBlock.content.backgroundType || 'color'}
                onChange={(e) => updateContent('backgroundType', e.target.value)}
              >
                <option value="color">Solid Color</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {editedBlock.content.backgroundType === 'color' && (
              <div className="mb-3">
                <label className="form-label">Background Color</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={editedBlock.content.backgroundColor || '#0054a6'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                />
              </div>
            )}

            {editedBlock.content.backgroundType === 'image' && (
              <div className="mb-3">
                <label className="form-label">Background Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={editedBlock.content.backgroundImage || ''}
                  onChange={(e) => updateContent('backgroundImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {editedBlock.content.backgroundType === 'video' && (
              <div className="mb-3">
                <label className="form-label">Background Video URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={editedBlock.content.backgroundVideo || ''}
                  onChange={(e) => updateContent('backgroundVideo', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
                <small className="form-hint">Supports .mp4, .webm video files</small>
              </div>
            )}
          </>
        )

      case 'heading':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Heading Text</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Heading Level</label>
              <select
                className="form-select"
                value={editedBlock.content.level || 2}
                onChange={(e) => updateContent('level', parseInt(e.target.value))}
              >
                <option value="1">H1 - Largest</option>
                <option value="2">H2 - Large</option>
                <option value="3">H3 - Medium</option>
                <option value="4">H4 - Small</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Alignment</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${editedBlock.content.align === 'left' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => updateContent('align', 'left')}
                >
                  Left
                </button>
                <button
                  type="button"
                  className={`btn ${editedBlock.content.align === 'center' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => updateContent('align', 'center')}
                >
                  Center
                </button>
                <button
                  type="button"
                  className={`btn ${editedBlock.content.align === 'right' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => updateContent('align', 'right')}
                >
                  Right
                </button>
              </div>
            </div>
          </>
        )

      case 'text':
        return (
          <div className="mb-3">
            <label className="form-label">Content</label>
            <div className="border rounded p-2 mb-2">
              <div className="btn-group mb-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`btn btn-sm ${editor?.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`btn btn-sm ${editor?.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`btn btn-sm ${editor?.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  List
                </button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>
        )

      case 'image':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-control"
                value={editedBlock.content.url || ''}
                onChange={(e) => updateContent('url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Alt Text (for accessibility)</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Caption (optional)</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.caption || ''}
                onChange={(e) => updateContent('caption', e.target.value)}
              />
            </div>
          </>
        )

      case 'video':
        return (
          <div className="mb-3">
            <label className="form-label">YouTube Video ID or URL</label>
            <input
              type="text"
              className="form-control"
              value={editedBlock.content.youtubeId || ''}
              onChange={(e) => {
                let value = e.target.value
                // Extract ID from URL if full URL provided
                const match = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
                if (match) value = match[1]
                updateContent('youtubeId', value)
              }}
              placeholder="dQw4w9WgXcQ or full YouTube URL"
            />
            <small className="form-hint">Paste the video ID or full YouTube URL</small>
          </div>
        )

      case 'button':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Button Text</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Button URL</label>
              <input
                type="text"
                className="form-control"
                value={editedBlock.content.url || ''}
                onChange={(e) => updateContent('url', e.target.value)}
                placeholder="/page-url or https://..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Style</label>
              <select
                className="form-select"
                value={editedBlock.content.style || 'primary'}
                onChange={(e) => updateContent('style', e.target.value)}
              >
                <option value="primary">Primary (Blue)</option>
                <option value="secondary">Secondary (Gray)</option>
                <option value="success">Success (Green)</option>
                <option value="danger">Danger (Red)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Size</label>
              <select
                className="form-select"
                value={editedBlock.content.size || 'md'}
                onChange={(e) => updateContent('size', e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </>
        )

      case 'spacer':
        return (
          <div className="mb-3">
            <label className="form-label">Height (pixels)</label>
            <input
              type="number"
              className="form-control"
              value={editedBlock.content.height || 40}
              onChange={(e) => updateContent('height', parseInt(e.target.value))}
              min="10"
              max="200"
            />
          </div>
        )

      case 'divider':
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Thickness (pixels)</label>
              <input
                type="number"
                className="form-control"
                value={editedBlock.content.thickness || 1}
                onChange={(e) => updateContent('thickness', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Color</label>
              <input
                type="color"
                className="form-control"
                value={editedBlock.content.color || '#dee2e6'}
                onChange={(e) => updateContent('color', e.target.value)}
              />
            </div>
          </>
        )

      default:
        return <p className="text-muted">No editor available for this block type.</p>
    }
  }

  return (
    <>
      <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit {editedBlock.type} Block</h5>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              {renderEditor()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-link link-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}
