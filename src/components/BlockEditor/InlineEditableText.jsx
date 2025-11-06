import { useState, useRef, useEffect } from 'react'

export default function InlineEditableText({ value, onChange, tag = 'p', className = '', style = {}, placeholder = 'Click to edit...' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const editRef = useRef(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

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

  const handleBlur = () => {
    setIsEditing(false)
    const newValue = editRef.current?.innerText || ''
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  const Tag = tag

  if (isEditing) {
    return (
      <Tag
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        style={{
          ...style,
          outline: '2px solid #4a9eff',
          outlineOffset: '2px',
          minWidth: '50px',
          minHeight: '1em'
        }}
      >
        {localValue || placeholder}
      </Tag>
    )
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={className}
      style={{
        ...style,
        cursor: 'text',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(74, 158, 255, 0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {localValue || <span style={{ color: '#999', fontStyle: 'italic' }}>{placeholder}</span>}
    </Tag>
  )
}
