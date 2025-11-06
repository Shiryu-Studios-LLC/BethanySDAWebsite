import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BlockRenderer from './BlockRenderer'
import BlockLibrary from './BlockLibrary'
import BlockEditModal from './BlockEditModal'
import { IconEye, IconCode } from '@tabler/icons-react'

export default function VisualBuilder({ blocks, onChange }) {
  const [editingBlock, setEditingBlock] = useState(null)
  const [viewMode, setViewMode] = useState('visual') // 'visual' or 'preview'

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      onChange(newBlocks)
    }
  }

  const addBlock = (template) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...template
    }
    onChange([...blocks, newBlock])
  }

  const deleteBlock = (blockId) => {
    onChange(blocks.filter(b => b.id !== blockId))
  }

  const duplicateBlock = (block) => {
    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    const index = blocks.findIndex(b => b.id === block.id)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    onChange(newBlocks)
  }

  const saveBlockEdit = (editedBlock) => {
    onChange(blocks.map(b => b.id === editedBlock.id ? editedBlock : b))
    setEditingBlock(null)
  }

  const handleNestedBlocksChange = (columnBlockId, newColumns) => {
    onChange(blocks.map(b => {
      if (b.id === columnBlockId && b.type === 'columns') {
        return {
          ...b,
          content: {
            ...b.content,
            columns: newColumns
          }
        }
      }
      return b
    }))
  }

  const renderPreview = () => {
    return (
      <div className="preview-mode">
        {blocks.map(block => (
          <div key={block.id} className="mb-4">
            {renderBlockPreview(block)}
          </div>
        ))}
      </div>
    )
  }

  const renderBlockPreview = (block) => {
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
              <h1 className="display-4 mb-3">{block.content.title}</h1>
              <p className="lead mb-4">{block.content.subtitle}</p>
              {block.content.buttonText && (
                <a href={block.content.buttonUrl} className="btn btn-light btn-lg">
                  {block.content.buttonText}
                </a>
              )}
            </div>
          </div>
        )

      case 'heading':
        const HeadingTag = `h${block.content.level || 2}`
        return (
          <HeadingTag style={{ textAlign: block.content.align }}>
            {block.content.text}
          </HeadingTag>
        )

      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: block.content.html }} />

      case 'image':
        return (
          <div className="text-center">
            <img src={block.content.url} alt={block.content.alt} className="img-fluid rounded" />
            {block.content.caption && <p className="text-muted mt-2">{block.content.caption}</p>}
          </div>
        )

      case 'video':
        return (
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.youtube.com/embed/${block.content.youtubeId}`}
              allowFullScreen
              style={{ border: 0 }}
            ></iframe>
          </div>
        )

      case 'button':
        return (
          <div className="text-center">
            <a href={block.content.url} className={`btn btn-${block.content.style} btn-${block.content.size}`}>
              {block.content.text}
            </a>
          </div>
        )

      case 'columns':
        return (
          <div className="row g-3">
            {block.content.columns.map((col, idx) => (
              <div key={idx} className={`col-md-${12 / block.content.columns.length}`}>
                <div dangerouslySetInnerHTML={{ __html: col.html }} />
              </div>
            ))}
          </div>
        )

      case 'spacer':
        return <div style={{ height: `${block.content.height}px` }} />

      case 'divider':
        return <hr style={{ borderTop: `${block.content.thickness}px solid ${block.content.color}` }} />

      default:
        return null
    }
  }

  return (
    <div className="visual-builder">
      <div className="row g-0">
        {/* Left Sidebar - Block Library */}
        <div className="col-md-3 border-end" style={{ height: '70vh', overflowY: 'auto' }}>
          <BlockLibrary onAddBlock={addBlock} />
        </div>

        {/* Main Canvas */}
        <div className="col-md-9">
          {/* Toolbar */}
          <div className="d-flex gap-2 p-3 border-bottom bg-light">
            <div className="btn-group">
              <button
                className={`btn btn-sm ${viewMode === 'visual' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('visual')}
              >
                <IconCode size={16} className="me-1" />
                Edit
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'preview' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('preview')}
              >
                <IconEye size={16} className="me-1" />
                Preview
              </button>
            </div>
            <div className="ms-auto">
              <span className="badge bg-secondary-lt">{blocks.length} blocks</span>
            </div>
          </div>

          {/* Canvas Content */}
          <div className="p-4" style={{ minHeight: '60vh', maxHeight: '60vh', overflowY: 'auto' }}>
            {blocks.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No blocks yet</h4>
                <p className="text-muted">Add blocks from the left sidebar to start building your page</p>
              </div>
            ) : viewMode === 'visual' ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map(block => (
                    <BlockRenderer
                      key={block.id}
                      block={block}
                      onEdit={setEditingBlock}
                      onDelete={deleteBlock}
                      onDuplicate={duplicateBlock}
                      onNestedBlocksChange={handleNestedBlocksChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              renderPreview()
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <BlockEditModal
        block={editingBlock}
        isOpen={!!editingBlock}
        onSave={saveBlockEdit}
        onCancel={() => setEditingBlock(null)}
      />
    </div>
  )
}
