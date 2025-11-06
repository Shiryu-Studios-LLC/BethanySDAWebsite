import { useDroppable, DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import BlockRenderer from './BlockRenderer'
import BlockLibrary from './BlockLibrary'
import { IconPlus } from '@tabler/icons-react'

export default function ColumnBlock({ columnIndex, blocks, onBlocksChange, onEdit, onDelete, onDuplicate }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnIndex}`,
    data: { columnIndex }
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Allow 8px of movement before dragging starts
      },
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex(b => b.id === active.id)
    const newIndex = blocks.findIndex(b => b.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex)
      onBlocksChange(reorderedBlocks)
    }
  }

  const addBlockToColumn = (template) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...template
    }
    onBlocksChange([...blocks, newBlock])
  }

  const deleteBlockFromColumn = (blockId) => {
    onBlocksChange(blocks.filter(b => b.id !== blockId))
  }

  const duplicateBlockInColumn = (block) => {
    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    const index = blocks.findIndex(b => b.id === block.id)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    onBlocksChange(newBlocks)
  }

  return (
    <div
      ref={setNodeRef}
      className={`column-drop-zone border rounded p-3 position-relative ${isOver ? 'bg-primary-lt' : 'bg-light bg-opacity-50'}`}
      style={{ minHeight: '200px' }}
    >
      {/* Mini Add Block Button */}
      <div className="position-absolute top-0 end-0 m-2">
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-primary"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="Add block to this column"
          >
            <IconPlus size={16} />
          </button>
          <div className="dropdown-menu dropdown-menu-end" style={{ maxHeight: '400px', overflowY: 'auto', width: '280px' }}>
            <div className="p-2">
              <BlockLibrary onAddBlock={addBlockToColumn} compact={true} />
            </div>
          </div>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center text-muted py-5">
          <small>Click + to add blocks</small>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map(block => (
              <BlockRenderer
                key={block.id}
                block={block}
                onEdit={onEdit}
                onDelete={() => deleteBlockFromColumn(block.id)}
                onDuplicate={() => duplicateBlockInColumn(block)}
                isNested={true}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
