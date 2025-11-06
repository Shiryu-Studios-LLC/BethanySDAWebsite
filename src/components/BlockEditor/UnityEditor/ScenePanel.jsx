import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BlockRenderer from '../BlockRenderer'
import BlockLibrary from '../BlockLibrary'
import { IconPlus } from '@tabler/icons-react'

// Preview rendering (same as VisualBuilder)
function renderBlockPreview(block, renderNestedBlocks) {
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
      const columnCount = block.content.columnCount || block.content.columns?.length || 2
      const colWidth = 12 / columnCount
      return (
        <div className="row g-3 mb-4">
          {block.content.columns.map((col, idx) => (
            <div key={idx} className={`col-md-${colWidth}`}>
              <div className="border rounded p-3 bg-light">
                {col.blocks && col.blocks.length > 0 ? (
                  renderNestedBlocks(col.blocks)
                ) : (
                  <p className="text-muted text-center mb-0">Empty column</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )

    case 'spacer':
      return <div style={{ height: `${block.content.height}px` }} />

    case 'divider':
      return <hr style={{ borderTop: `${block.content.thickness}px solid ${block.content.color}` }} />

    case 'card':
      return (
        <div className="card mb-4">
          <div className="card-body text-center">
            {block.content.icon && (
              <div className="mb-3" style={{ fontSize: '3rem' }}>{block.content.icon}</div>
            )}
            <h3 className="card-title">{block.content.title}</h3>
            <p className="text-muted">{block.content.description}</p>
            {block.content.linkText && (
              <a href={block.content.linkUrl} className="btn btn-primary">
                {block.content.linkText}
              </a>
            )}
          </div>
        </div>
      )

    case 'quote':
      return (
        <blockquote className="blockquote text-center mb-4">
          <p className="mb-3 fs-4">"{block.content.quote}"</p>
          <footer className="blockquote-footer">
            {block.content.author}
            {block.content.role && <cite className="ms-2">- {block.content.role}</cite>}
          </footer>
        </blockquote>
      )

    case 'embed':
      return (
        <div className="mb-4" style={{ height: `${block.content.height}px` }}>
          {block.content.embedCode ? (
            <div dangerouslySetInnerHTML={{ __html: block.content.embedCode }} />
          ) : (
            <div className="bg-light rounded p-5 text-center">
              <p className="text-muted">No embed code</p>
            </div>
          )}
        </div>
      )

    case 'callout':
      return (
        <div className={`alert alert-${block.content.style || 'info'} mb-4`}>
          <h4 className="alert-title">{block.content.title}</h4>
          <div className="text-muted">{block.content.message}</div>
        </div>
      )

    default:
      return null
  }
}

export default function ScenePanel({ blocks, onChange, selectedBlock, onSelectBlock, viewMode, pageTitle, pageSubtitle, showPageHeader }) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    const overId = over.id.toString()

    // Check if dropping into a column
    if (overId.startsWith('column-')) {
      const parts = overId.split('-')
      if (parts.length >= 3) {
        const columnBlockId = parts.slice(1, -1).join('-')
        const columnIndex = parseInt(parts[parts.length - 1])

        const columnBlock = blocks.find(b => b.id === columnBlockId && b.type === 'columns')

        if (columnBlock) {
          const draggedBlock = findBlockById(active.id)
          if (draggedBlock) {
            const newBlocks = removeBlockById(blocks, active.id)

            const updatedBlocks = newBlocks.map(b => {
              if (b.id === columnBlockId && b.type === 'columns') {
                const newColumns = [...b.content.columns]
                newColumns[columnIndex] = {
                  ...newColumns[columnIndex],
                  blocks: [...(newColumns[columnIndex].blocks || []), draggedBlock]
                }
                return {
                  ...b,
                  content: {
                    ...b.content,
                    columns: newColumns
                  }
                }
              }
              return b
            })

            onChange(updatedBlocks)
            return
          }
        }
      }
    }

    // Handle reordering top-level blocks
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex)
        onChange(newBlocks)
      }
    }
  }

  const findBlockById = (blockId) => {
    for (const block of blocks) {
      if (block.id === blockId) return block

      if (block.type === 'columns' && block.content.columns) {
        for (const column of block.content.columns) {
          const found = column.blocks?.find(b => b.id === blockId)
          if (found) return found
        }
      }
    }
    return null
  }

  const removeBlockById = (blockList, blockId) => {
    return blockList.filter(b => b.id !== blockId).map(block => {
      if (block.type === 'columns' && block.content.columns) {
        return {
          ...block,
          content: {
            ...block.content,
            columns: block.content.columns.map(col => ({
              ...col,
              blocks: (col.blocks || []).filter(b => b.id !== blockId)
            }))
          }
        }
      }
      return block
    })
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

  const renderNestedBlocks = (blocks) => {
    return blocks.map(block => (
      <div key={block.id} className="mb-3">
        {renderBlockPreview(block, renderNestedBlocks)}
      </div>
    ))
  }

  const renderPreview = () => {
    return (
      <div className="preview-mode">
        {showPageHeader && (
          <section className="py-5 bg-dark text-white mb-4">
            <div className="container py-5">
              <div className="row justify-content-center text-center">
                <div className="col-lg-8">
                  <h1 className="display-4 fw-bold mb-4">{pageTitle || 'Page Title'}</h1>
                  {pageSubtitle && (
                    <p className="lead mb-0">{pageSubtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {blocks.map(block => (
          <div key={block.id} className="mb-4">
            {renderBlockPreview(block, renderNestedBlocks)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="scene-panel"
      style={{
        flex: 1,
        backgroundColor: '#383838',
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
          justifyContent: 'space-between',
          padding: '0 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#cbcbcb'
        }}
      >
        <span>Scene</span>

        {/* Add Block Button */}
        <div className="dropdown">
          <button
            className="btn btn-sm"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor: '#5a5a5a',
              border: '1px solid #2b2b2b',
              color: '#cbcbcb',
              padding: '2px 8px',
              fontSize: '11px'
            }}
            title="Add block"
          >
            <IconPlus size={14} className="me-1" />
            Add Block
          </button>
          <div className="dropdown-menu dropdown-menu-end" style={{ maxHeight: '400px', overflowY: 'auto', width: '280px' }}>
            <div className="p-2">
              <BlockLibrary onAddBlock={addBlock} compact={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#2b2b2b' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            minHeight: '100%',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          {blocks.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">No blocks yet</h4>
              <p className="text-muted">Click "Add Block" to start building your page</p>
            </div>
          ) : viewMode === 'visual' ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map(block => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    onEdit={onSelectBlock}
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
  )
}
