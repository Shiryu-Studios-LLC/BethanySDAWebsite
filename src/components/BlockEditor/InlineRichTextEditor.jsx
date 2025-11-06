import { useState, useRef, useEffect } from 'react'
import { IconBold, IconItalic, IconUnderline, IconAlignLeft, IconAlignCenter, IconAlignRight, IconH1, IconH2, IconH3, IconList, IconListNumbers, IconLink } from '@tabler/icons-react'

export default function InlineRichTextEditor({ value, onChange, placeholder = 'Click to edit...' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const editRef = useRef(null)
  const toolbarRef = useRef(null)

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus()
      // Place cursor at end
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editRef.current)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [isEditing])

  const handleBlur = (e) => {
    // Don't blur if clicking on toolbar
    if (toolbarRef.current && toolbarRef.current.contains(e.relatedTarget)) {
      return
    }
    setIsEditing(false)
    setShowToolbar(false)
    const newValue = editRef.current?.innerHTML || ''
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const handleFocus = () => {
    setShowToolbar(true)
    updateToolbarPosition()
  }

  const updateToolbarPosition = () => {
    if (editRef.current) {
      const rect = editRef.current.getBoundingClientRect()
      setToolbarPosition({
        top: rect.top - 50,
        left: rect.left + rect.width / 2
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (editRef.current) {
        editRef.current.innerHTML = value
      }
      setIsEditing(false)
      setShowToolbar(false)
    }
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editRef.current?.focus()
  }

  const insertHeading = (level) => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString() || 'Heading'
      const heading = document.createElement(`h${level}`)
      heading.textContent = selectedText
      range.deleteContents()
      range.insertNode(heading)
      range.selectNodeContents(heading)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    editRef.current?.focus()
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="inline-rich-text-preview"
        style={{
          cursor: 'pointer',
          minHeight: '50px',
          padding: '12px',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(74, 158, 255, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        dangerouslySetInnerHTML={{
          __html: value || `<p style="color: #999; font-style: italic;">${placeholder}</p>`
        }}
      />
    )
  }

  return (
    <>
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          style={{
            position: 'fixed',
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#2b2b2b',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 10000,
            flexWrap: 'wrap',
            maxWidth: '500px'
          }}
        >
          {/* Text Formatting */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('bold') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Bold (Ctrl+B)"
          >
            <IconBold size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('italic') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Italic (Ctrl+I)"
          >
            <IconItalic size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('underline') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Underline (Ctrl+U)"
          >
            <IconUnderline size={16} />
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 4px' }} />

          {/* Headings */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertHeading(1) }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Heading 1"
          >
            <IconH1 size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertHeading(2) }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Heading 2"
          >
            <IconH2 size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertHeading(3) }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Heading 3"
          >
            <IconH3 size={16} />
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 4px' }} />

          {/* Alignment */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Align Left"
          >
            <IconAlignLeft size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Align Center"
          >
            <IconAlignCenter size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('justifyRight') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Align Right"
          >
            <IconAlignRight size={16} />
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 4px' }} />

          {/* Lists */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Bullet List"
          >
            <IconList size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList') }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Numbered List"
          >
            <IconListNumbers size={16} />
          </button>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#555', margin: '0 4px' }} />

          {/* Link */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertLink() }}
            className="btn btn-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px'
            }}
            title="Insert Link"
          >
            <IconLink size={16} />
          </button>

          {/* Font Size */}
          <select
            onMouseDown={(e) => e.preventDefault()}
            onChange={(e) => { execCommand('fontSize', e.target.value); e.target.value = '3' }}
            defaultValue="3"
            className="form-select form-select-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '12px',
              width: 'auto'
            }}
            title="Font Size"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>

          {/* Text Color */}
          <input
            type="color"
            onMouseDown={(e) => e.preventDefault()}
            onChange={(e) => execCommand('foreColor', e.target.value)}
            className="form-control form-control-sm"
            style={{
              backgroundColor: '#3a3a3a',
              border: 'none',
              padding: '2px 4px',
              width: '40px',
              height: '32px',
              cursor: 'pointer'
            }}
            title="Text Color"
          />
        </div>
      )}

      {/* Editable Content */}
      <div
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        style={{
          outline: '2px solid #4a9eff',
          outlineOffset: '2px',
          minHeight: '50px',
          padding: '12px',
          borderRadius: '4px',
          cursor: 'text'
        }}
      />
    </>
  )
}
