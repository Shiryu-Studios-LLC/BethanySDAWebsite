import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconGripVertical, IconEdit, IconTrash, IconCopy } from '@tabler/icons-react'
import ColumnBlock from './ColumnBlock'
import InlineEditableText from './InlineEditableText'
import InlineRichTextEditor from './InlineRichTextEditor'

export default function BlockRenderer({ block, onEdit, onDelete, onDuplicate, isNested = false, onNestedBlocksChange, onUpdateBlock }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case 'hero':
        const bgType = block.content.backgroundType || 'color'
        const bgColor = block.content.backgroundColor || '#0054a6'
        const bgImage = block.content.backgroundImage || ''
        const bgVideo = block.content.backgroundVideo || ''

        return (
          <div
            className="text-white p-5 text-center rounded position-relative overflow-hidden"
            style={{
              backgroundColor: bgType === 'color' ? bgColor : '#000',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Background Video */}
            {bgType === 'video' && bgVideo && (
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0
                }}
              >
                <source src={bgVideo} type="video/mp4" />
              </video>
            )}

            {/* Background Image */}
            {bgType === 'image' && bgImage && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 0
                }}
              />
            )}

            {/* Dark overlay for better text readability */}
            {(bgType === 'video' || bgType === 'image') && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 1
                }}
              />
            )}

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {onUpdateBlock ? (
                <>
                  <InlineEditableText
                    value={block.content.title || ''}
                    onChange={(newTitle) => onUpdateBlock({ ...block, content: { ...block.content, title: newTitle } })}
                    tag="h1"
                    className="display-4 mb-3"
                    placeholder="Hero Title"
                  />
                  <InlineEditableText
                    value={block.content.subtitle || ''}
                    onChange={(newSubtitle) => onUpdateBlock({ ...block, content: { ...block.content, subtitle: newSubtitle } })}
                    tag="p"
                    className="lead mb-4"
                    placeholder="Hero subtitle goes here"
                  />
                </>
              ) : (
                <>
                  <h1 className="display-4 mb-3">{block.content.title || 'Hero Title'}</h1>
                  <p className="lead mb-4">{block.content.subtitle || 'Hero subtitle goes here'}</p>
                </>
              )}
              {block.content.buttonText && (
                <a href={block.content.buttonUrl || '#'} className="btn btn-light btn-lg">
                  {block.content.buttonText}
                </a>
              )}
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="p-4">
            {onUpdateBlock ? (
              <InlineRichTextEditor
                value={block.content.html || ''}
                onChange={(newHtml) => onUpdateBlock({ ...block, content: { ...block.content, html: newHtml } })}
                placeholder="Click to add text content..."
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: block.content.html || '<p>Text content goes here...</p>' }} />
            )}
          </div>
        )

      case 'heading':
        const HeadingTag = `h${block.content.level || 2}`
        return (
          <div className="p-4">
            {onUpdateBlock ? (
              <InlineEditableText
                value={block.content.text || ''}
                onChange={(newText) => onUpdateBlock({ ...block, content: { ...block.content, text: newText } })}
                tag={HeadingTag}
                style={{ textAlign: block.content.align || 'left' }}
                placeholder="Heading Text"
              />
            ) : (
              <HeadingTag style={{ textAlign: block.content.align || 'left' }}>
                {block.content.text || 'Heading Text'}
              </HeadingTag>
            )}
          </div>
        )

      case 'image':
        return (
          <div className="p-4 text-center">
            {block.content.url ? (
              <img
                src={block.content.url}
                alt={block.content.alt || ''}
                className="img-fluid rounded"
                style={{ maxHeight: '400px' }}
              />
            ) : (
              <div className="bg-light rounded p-5">
                <p className="text-muted">No image selected</p>
              </div>
            )}
            {block.content.caption && (
              <p className="text-muted mt-2">{block.content.caption}</p>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="p-4">
            {block.content.youtubeId ? (
              <div className="ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${block.content.youtubeId}`}
                  title="YouTube video"
                  allowFullScreen
                  style={{ border: 0 }}
                ></iframe>
              </div>
            ) : (
              <div className="bg-light rounded p-5 text-center">
                <p className="text-muted">No video selected</p>
              </div>
            )}
          </div>
        )

      case 'button':
        return (
          <div className="p-4 text-center">
            <a
              href={block.content.url || '#'}
              className={`btn btn-${block.content.style || 'primary'} btn-${block.content.size || 'md'}`}
            >
              {block.content.text || 'Button Text'}
            </a>
          </div>
        )

      case 'columns':
        const columnCount = block.content.columnCount || block.content.columns?.length || 2
        const colWidth = 12 / columnCount

        return (
          <div className="p-4">
            <div className="row g-3">
              {(block.content.columns || []).map((col, idx) => (
                <div key={idx} className={`col-md-${colWidth}`}>
                  {!isNested ? (
                    <ColumnBlock
                      columnIndex={`${block.id}-${idx}`}
                      blocks={col.blocks || []}
                      onBlocksChange={(newBlocks) => {
                        if (onNestedBlocksChange) {
                          const newColumns = [...block.content.columns]
                          newColumns[idx] = { ...newColumns[idx], blocks: newBlocks }
                          onNestedBlocksChange(block.id, newColumns)
                        }
                      }}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                    />
                  ) : (
                    <div className="border rounded p-3 bg-light">
                      <small className="text-muted">Nested columns not supported</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'spacer':
        return (
          <div style={{ height: `${block.content.height || 40}px` }} className="bg-light bg-opacity-25">
            <div className="text-center text-muted pt-2">
              <small>Spacer ({block.content.height || 40}px)</small>
            </div>
          </div>
        )

      case 'divider':
        return (
          <div className="p-4">
            <hr style={{ borderTop: `${block.content.thickness || 1}px solid ${block.content.color || '#dee2e6'}` }} />
          </div>
        )

      case 'card':
        return (
          <div className="p-4">
            <div className="card">
              <div className="card-body text-center">
                {block.content.icon && (
                  <div className="mb-3" style={{ fontSize: '3rem' }}>{block.content.icon}</div>
                )}
                <h3 className="card-title">{block.content.title || 'Card Title'}</h3>
                <p className="text-muted">{block.content.description || 'Card description'}</p>
                {block.content.linkText && (
                  <a href={block.content.linkUrl || '#'} className="btn btn-primary">
                    {block.content.linkText}
                  </a>
                )}
              </div>
            </div>
          </div>
        )

      case 'quote':
        return (
          <div className="p-4">
            <blockquote className="blockquote text-center">
              <p className="mb-3 fs-4">"{block.content.quote || 'Quote text'}"</p>
              <footer className="blockquote-footer">
                {block.content.author || 'Author Name'}
                {block.content.role && <cite className="ms-2">- {block.content.role}</cite>}
              </footer>
            </blockquote>
          </div>
        )

      case 'embed':
        return (
          <div className="p-4">
            {block.content.embedCode ? (
              <div
                style={{ height: `${block.content.height || 400}px` }}
                dangerouslySetInnerHTML={{ __html: block.content.embedCode }}
              />
            ) : (
              <div className="bg-light rounded p-5 text-center">
                <p className="text-muted">No embed code provided</p>
              </div>
            )}
          </div>
        )

      case 'callout':
        const calloutStyle = block.content.style || 'info'
        return (
          <div className="p-4">
            <div className={`alert alert-${calloutStyle}`} role="alert">
              <h4 className="alert-title">{block.content.title || 'Notice'}</h4>
              <div className="text-muted">{block.content.message || 'Message'}</div>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 bg-light">
            <p className="text-muted">Unknown block type: {block.type}</p>
          </div>
        )
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="block-item mb-3">
      <div className="card">
        {/* Block Toolbar */}
        <div className="block-toolbar d-flex align-items-center gap-2 p-2 bg-light border-bottom">
          <button
            className="btn btn-sm btn-ghost-secondary"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
          >
            <IconGripVertical size={16} />
          </button>
          <span className="badge bg-secondary-lt">{block.type}</span>
          <div className="ms-auto d-flex gap-1">
            <button
              className="btn btn-sm btn-ghost-secondary"
              onClick={() => onEdit(block)}
              title="Edit block"
            >
              <IconEdit size={16} />
            </button>
            <button
              className="btn btn-sm btn-ghost-secondary"
              onClick={() => onDuplicate(block)}
              title="Duplicate block"
            >
              <IconCopy size={16} />
            </button>
            <button
              className="btn btn-sm btn-ghost-danger"
              onClick={() => onDelete(block.id)}
              title="Delete block"
            >
              <IconTrash size={16} />
            </button>
          </div>
        </div>

        {/* Block Content */}
        <div className="block-content">
          {renderBlockContent()}
        </div>
      </div>
    </div>
  )
}
