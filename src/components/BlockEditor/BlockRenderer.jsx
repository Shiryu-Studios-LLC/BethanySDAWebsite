import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconGripVertical, IconEdit, IconTrash, IconCopy } from '@tabler/icons-react'

export default function BlockRenderer({ block, onEdit, onDelete, onDuplicate }) {
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
        return (
          <div className="bg-primary text-white p-5 text-center rounded">
            <h1 className="display-4 mb-3">{block.content.title || 'Hero Title'}</h1>
            <p className="lead mb-4">{block.content.subtitle || 'Hero subtitle goes here'}</p>
            {block.content.buttonText && (
              <a href={block.content.buttonUrl || '#'} className="btn btn-light btn-lg">
                {block.content.buttonText}
              </a>
            )}
          </div>
        )

      case 'text':
        return (
          <div className="p-4">
            <div dangerouslySetInnerHTML={{ __html: block.content.html || '<p>Text content goes here...</p>' }} />
          </div>
        )

      case 'heading':
        const HeadingTag = `h${block.content.level || 2}`
        return (
          <div className="p-4">
            <HeadingTag style={{ textAlign: block.content.align || 'left' }}>
              {block.content.text || 'Heading Text'}
            </HeadingTag>
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
        return (
          <div className="p-4">
            <div className="row g-3">
              {(block.content.columns || [{ html: '' }, { html: '' }]).map((col, idx) => (
                <div key={idx} className={`col-md-${12 / block.content.columns.length}`}>
                  <div className="border rounded p-3" dangerouslySetInnerHTML={{ __html: col.html || `<p>Column ${idx + 1}</p>` }} />
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
