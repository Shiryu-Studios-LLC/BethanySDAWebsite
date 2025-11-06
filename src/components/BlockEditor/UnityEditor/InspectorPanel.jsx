import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { IconTrash, IconCopy } from '@tabler/icons-react'

export default function InspectorPanel({ selectedBlock, onUpdateBlock, onDeleteBlock, onDuplicateBlock, width }) {
  const [editedBlock, setEditedBlock] = useState(selectedBlock)

  const editor = useEditor({
    extensions: [StarterKit],
    content: editedBlock?.content?.html || '',
    onUpdate: ({ editor }) => {
      if (editedBlock?.type === 'text') {
        const updated = {
          ...editedBlock,
          content: { ...editedBlock.content, html: editor.getHTML() }
        }
        setEditedBlock(updated)
        onUpdateBlock(updated)
      }
    },
  })

  useEffect(() => {
    setEditedBlock(selectedBlock)
    if (editor && selectedBlock?.content?.html) {
      editor.commands.setContent(selectedBlock.content.html)
    }
  }, [selectedBlock, editor])

  const updateContent = (field, value) => {
    const updated = {
      ...editedBlock,
      content: { ...editedBlock.content, [field]: value }
    }
    setEditedBlock(updated)
    onUpdateBlock(updated)
  }

  const renderInspector = () => {
    if (!editedBlock) {
      return (
        <div style={{ padding: '20px', color: '#8a8a8a', fontSize: '12px', textAlign: 'center' }}>
          <p>Select a block to edit its properties</p>
        </div>
      )
    }

    switch (editedBlock.type) {
      case 'hero':
        return (
          <>
            <InspectorField label="Title">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Subtitle">
              <textarea
                className="unity-input"
                rows="2"
                value={editedBlock.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Button Text">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Optional"
              />
            </InspectorField>

            <InspectorField label="Button URL">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.buttonUrl || ''}
                onChange={(e) => updateContent('buttonUrl', e.target.value)}
                placeholder="/page-url"
              />
            </InspectorField>

            <div style={{ height: '1px', backgroundColor: '#404040', margin: '12px 0' }}></div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#8a8a8a', marginBottom: '8px', textTransform: 'uppercase' }}>
              Background
            </div>

            <InspectorField label="Type">
              <select
                className="unity-input"
                value={editedBlock.content.backgroundType || 'color'}
                onChange={(e) => updateContent('backgroundType', e.target.value)}
              >
                <option value="color">Solid Color</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </InspectorField>

            {editedBlock.content.backgroundType === 'color' && (
              <InspectorField label="Color">
                <input
                  type="color"
                  className="unity-input"
                  value={editedBlock.content.backgroundColor || '#0054a6'}
                  onChange={(e) => updateContent('backgroundColor', e.target.value)}
                  style={{ height: '32px', padding: '2px' }}
                />
              </InspectorField>
            )}

            {editedBlock.content.backgroundType === 'image' && (
              <InspectorField label="Image URL">
                <input
                  type="url"
                  className="unity-input"
                  value={editedBlock.content.backgroundImage || ''}
                  onChange={(e) => updateContent('backgroundImage', e.target.value)}
                  placeholder="https://..."
                />
              </InspectorField>
            )}

            {editedBlock.content.backgroundType === 'video' && (
              <InspectorField label="Video URL">
                <input
                  type="url"
                  className="unity-input"
                  value={editedBlock.content.backgroundVideo || ''}
                  onChange={(e) => updateContent('backgroundVideo', e.target.value)}
                  placeholder="https://...video.mp4"
                />
              </InspectorField>
            )}
          </>
        )

      case 'heading':
        return (
          <>
            <InspectorField label="Text">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Level">
              <select
                className="unity-input"
                value={editedBlock.content.level || 2}
                onChange={(e) => updateContent('level', parseInt(e.target.value))}
              >
                <option value="1">H1 - Largest</option>
                <option value="2">H2 - Large</option>
                <option value="3">H3 - Medium</option>
                <option value="4">H4 - Small</option>
              </select>
            </InspectorField>

            <InspectorField label="Alignment">
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className="unity-button"
                  style={{
                    backgroundColor: editedBlock.content.align === 'left' ? '#5a5a5a' : '#3a3a3a'
                  }}
                  onClick={() => updateContent('align', 'left')}
                >
                  Left
                </button>
                <button
                  type="button"
                  className="unity-button"
                  style={{
                    backgroundColor: editedBlock.content.align === 'center' ? '#5a5a5a' : '#3a3a3a'
                  }}
                  onClick={() => updateContent('align', 'center')}
                >
                  Center
                </button>
                <button
                  type="button"
                  className="unity-button"
                  style={{
                    backgroundColor: editedBlock.content.align === 'right' ? '#5a5a5a' : '#3a3a3a'
                  }}
                  onClick={() => updateContent('align', 'right')}
                >
                  Right
                </button>
              </div>
            </InspectorField>
          </>
        )

      case 'text':
        return (
          <InspectorField label="Content">
            <div style={{ backgroundColor: '#3a3a3a', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
              <div className="btn-group mb-2" style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className="unity-button"
                  style={{
                    backgroundColor: editor?.isActive('bold') ? '#5a5a5a' : '#3a3a3a',
                    fontSize: '11px',
                    padding: '4px 8px'
                  }}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className="unity-button"
                  style={{
                    backgroundColor: editor?.isActive('italic') ? '#5a5a5a' : '#3a3a3a',
                    fontSize: '11px',
                    padding: '4px 8px'
                  }}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className="unity-button"
                  style={{
                    backgroundColor: editor?.isActive('bulletList') ? '#5a5a5a' : '#3a3a3a',
                    fontSize: '11px',
                    padding: '4px 8px'
                  }}
                >
                  List
                </button>
              </div>
              <EditorContent editor={editor} style={{ color: '#cbcbcb', minHeight: '100px' }} />
            </div>
          </InspectorField>
        )

      case 'image':
        return (
          <>
            <InspectorField label="Image URL">
              <input
                type="url"
                className="unity-input"
                value={editedBlock.content.url || ''}
                onChange={(e) => updateContent('url', e.target.value)}
                placeholder="https://..."
              />
            </InspectorField>

            <InspectorField label="Alt Text">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
                placeholder="For accessibility"
              />
            </InspectorField>

            <InspectorField label="Caption">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.caption || ''}
                onChange={(e) => updateContent('caption', e.target.value)}
                placeholder="Optional"
              />
            </InspectorField>
          </>
        )

      case 'video':
        return (
          <InspectorField label="YouTube ID/URL">
            <input
              type="text"
              className="unity-input"
              value={editedBlock.content.youtubeId || ''}
              onChange={(e) => {
                let value = e.target.value
                const match = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
                if (match) value = match[1]
                updateContent('youtubeId', value)
              }}
              placeholder="Video ID or URL"
            />
          </InspectorField>
        )

      case 'button':
        return (
          <>
            <InspectorField label="Text">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="URL">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.url || ''}
                onChange={(e) => updateContent('url', e.target.value)}
                placeholder="/page or https://..."
              />
            </InspectorField>

            <InspectorField label="Style">
              <select
                className="unity-input"
                value={editedBlock.content.style || 'primary'}
                onChange={(e) => updateContent('style', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
                <option value="warning">Warning</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </InspectorField>

            <InspectorField label="Size">
              <select
                className="unity-input"
                value={editedBlock.content.size || 'md'}
                onChange={(e) => updateContent('size', e.target.value)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </InspectorField>
          </>
        )

      case 'spacer':
        return (
          <InspectorField label="Height (px)">
            <input
              type="number"
              className="unity-input"
              value={editedBlock.content.height || 40}
              onChange={(e) => updateContent('height', parseInt(e.target.value))}
              min="10"
              max="200"
            />
          </InspectorField>
        )

      case 'divider':
        return (
          <>
            <InspectorField label="Thickness (px)">
              <input
                type="number"
                className="unity-input"
                value={editedBlock.content.thickness || 1}
                onChange={(e) => updateContent('thickness', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </InspectorField>

            <InspectorField label="Color">
              <input
                type="color"
                className="unity-input"
                value={editedBlock.content.color || '#dee2e6'}
                onChange={(e) => updateContent('color', e.target.value)}
                style={{ height: '32px', padding: '2px' }}
              />
            </InspectorField>
          </>
        )

      case 'card':
        return (
          <>
            <InspectorField label="Icon/Emoji">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.icon || ''}
                onChange={(e) => updateContent('icon', e.target.value)}
                placeholder="🌟"
              />
            </InspectorField>

            <InspectorField label="Title">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Description">
              <textarea
                className="unity-input"
                rows="3"
                value={editedBlock.content.description || ''}
                onChange={(e) => updateContent('description', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Link Text">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.linkText || ''}
                onChange={(e) => updateContent('linkText', e.target.value)}
                placeholder="Optional"
              />
            </InspectorField>

            <InspectorField label="Link URL">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.linkUrl || ''}
                onChange={(e) => updateContent('linkUrl', e.target.value)}
                placeholder="/page or https://..."
              />
            </InspectorField>
          </>
        )

      case 'quote':
        return (
          <>
            <InspectorField label="Quote">
              <textarea
                className="unity-input"
                rows="3"
                value={editedBlock.content.quote || ''}
                onChange={(e) => updateContent('quote', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Author">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.author || ''}
                onChange={(e) => updateContent('author', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Role/Title">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.role || ''}
                onChange={(e) => updateContent('role', e.target.value)}
                placeholder="Optional"
              />
            </InspectorField>
          </>
        )

      case 'embed':
        return (
          <>
            <InspectorField label="Embed Code">
              <textarea
                className="unity-input"
                rows="4"
                value={editedBlock.content.embedCode || ''}
                onChange={(e) => updateContent('embedCode', e.target.value)}
                placeholder="Paste iframe code"
              />
            </InspectorField>

            <InspectorField label="Height (px)">
              <input
                type="number"
                className="unity-input"
                value={editedBlock.content.height || 400}
                onChange={(e) => updateContent('height', parseInt(e.target.value))}
                min="100"
                max="800"
              />
            </InspectorField>
          </>
        )

      case 'callout':
        return (
          <>
            <InspectorField label="Title">
              <input
                type="text"
                className="unity-input"
                value={editedBlock.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Message">
              <textarea
                className="unity-input"
                rows="3"
                value={editedBlock.content.message || ''}
                onChange={(e) => updateContent('message', e.target.value)}
              />
            </InspectorField>

            <InspectorField label="Style">
              <select
                className="unity-input"
                value={editedBlock.content.style || 'info'}
                onChange={(e) => updateContent('style', e.target.value)}
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="danger">Danger</option>
              </select>
            </InspectorField>
          </>
        )

      case 'columns':
        return (
          <div style={{ padding: '12px', color: '#8a8a8a', fontSize: '11px' }}>
            <p>Column container with {editedBlock.content.columnCount || editedBlock.content.columns?.length || 2} columns</p>
            <p>Use the "+" button in each column to add blocks</p>
          </div>
        )

      default:
        return (
          <div style={{ padding: '12px', color: '#8a8a8a', fontSize: '11px' }}>
            No inspector available for this block type.
          </div>
        )
    }
  }

  return (
    <div
      className="inspector-panel"
      style={{
        width: `${width}px`,
        backgroundColor: '#2b2b2b',
        borderLeft: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          height: '28px',
          backgroundColor: '#323232',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#cbcbcb'
        }}
      >
        Inspector
      </div>

      {/* Block Info */}
      {selectedBlock && (
        <div
          style={{
            padding: '12px',
            borderBottom: '1px solid #1a1a1a',
            backgroundColor: '#323232'
          }}
        >
          <div style={{ fontSize: '11px', color: '#8a8a8a', marginBottom: '4px', textTransform: 'uppercase' }}>
            Block Type
          </div>
          <div style={{ fontSize: '13px', color: '#cbcbcb', fontWeight: '500', marginBottom: '10px' }}>
            {selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onDuplicateBlock(selectedBlock)}
              className="unity-button"
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '11px',
                backgroundColor: '#3a3a3a',
                border: '1px solid #2a2a2a',
                color: '#cbcbcb',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              title="Duplicate block"
            >
              <IconCopy size={14} />
              Duplicate
            </button>
            <button
              onClick={() => onDeleteBlock(selectedBlock.id)}
              className="unity-button"
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '11px',
                backgroundColor: '#d32f2f',
                border: '1px solid #b71c1c',
                color: '#fff',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              title="Delete block"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Properties */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {renderInspector()}
      </div>

      {/* Custom Styles */}
      <style>{`
        .unity-input {
          width: 100%;
          background-color: #3a3a3a;
          border: 1px solid #2a2a2a;
          color: #cbcbcb;
          padding: 6px 8px;
          font-size: 12px;
          border-radius: 3px;
          font-family: inherit;
        }
        .unity-input:focus {
          outline: none;
          border-color: #4a9eff;
          background-color: #404040;
        }
        .unity-button {
          background-color: #3a3a3a;
          border: 1px solid #2a2a2a;
          color: #cbcbcb;
          padding: 6px 12px;
          font-size: 11px;
          border-radius: 3px;
          cursor: pointer;
          transition: background-color 0.1s;
        }
        .unity-button:hover {
          background-color: #4a4a4a;
        }
        .ProseMirror {
          min-height: 80px;
          max-height: 200px;
          overflow-y: auto;
          padding: 8px;
          background-color: #2a2a2a;
          border-radius: 3px;
          color: #cbcbcb;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p {
          margin: 0 0 8px 0;
        }
        .ProseMirror ul {
          padding-left: 20px;
        }
      `}</style>
    </div>
  )
}

function InspectorField({ label, children }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', fontSize: '11px', color: '#8a8a8a', marginBottom: '4px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
