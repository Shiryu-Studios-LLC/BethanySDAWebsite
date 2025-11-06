import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import BlockRenderer from './BlockRenderer'

export default function ColumnBlock({ columnIndex, blocks, onBlocksChange, onEdit, onDelete, onDuplicate }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnIndex}`,
    data: { columnIndex }
  })

  return (
    <div
      ref={setNodeRef}
      className={`column-drop-zone border rounded p-3 ${isOver ? 'bg-primary-lt' : 'bg-light bg-opacity-50'}`}
      style={{ minHeight: '200px' }}
    >
      {blocks.length === 0 ? (
        <div className="text-center text-muted py-5">
          <small>Drop blocks here</small>
        </div>
      ) : (
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map(block => (
            <BlockRenderer
              key={block.id}
              block={block}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              isNested={true}
            />
          ))}
        </SortableContext>
      )}
    </div>
  )
}
