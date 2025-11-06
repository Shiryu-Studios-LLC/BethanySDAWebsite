import { useState } from 'react'
import { IconEye, IconCode, IconChevronDown, IconChevronRight, IconFileText, IconBoxMultiple, IconPhoto, IconQuote } from '@tabler/icons-react'
import HierarchyPanel from './UnityEditor/HierarchyPanel'
import ScenePanel from './UnityEditor/ScenePanel'
import InspectorPanel from './UnityEditor/InspectorPanel'
import UnityToolbar from './UnityEditor/UnityToolbar'

export default function UnityEditor({ blocks, onChange, pageTitle = '', pageSubtitle = '', showPageHeader = true }) {
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [viewMode, setViewMode] = useState('visual') // 'visual' or 'preview'
  const [hierarchyWidth, setHierarchyWidth] = useState(280)
  const [inspectorWidth, setInspectorWidth] = useState(320)

  // Handle block selection from hierarchy
  const handleSelectBlock = (blockId) => {
    const block = findBlockById(blockId)
    setSelectedBlock(block)
  }

  // Find block by ID (including nested blocks)
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

  // Update selected block
  const handleUpdateBlock = (updatedBlock) => {
    onChange(blocks.map(b => {
      if (b.id === updatedBlock.id) return updatedBlock

      // Handle nested blocks in columns
      if (b.type === 'columns' && b.content.columns) {
        return {
          ...b,
          content: {
            ...b.content,
            columns: b.content.columns.map(col => ({
              ...col,
              blocks: (col.blocks || []).map(nestedBlock =>
                nestedBlock.id === updatedBlock.id ? updatedBlock : nestedBlock
              )
            }))
          }
        }
      }

      return b
    }))
    setSelectedBlock(updatedBlock)
  }

  // Handle block deletion
  const handleDeleteBlock = (blockId) => {
    const newBlocks = blocks.filter(b => b.id !== blockId).map(block => {
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
    onChange(newBlocks)
    setSelectedBlock(null)
  }

  // Handle block duplication
  const handleDuplicateBlock = (block) => {
    const newBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Find the parent and insert after the original
    const index = blocks.findIndex(b => b.id === block.id)
    if (index !== -1) {
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
      setSelectedBlock(newBlock)
    }
  }

  return (
    <div className="unity-editor" style={{ height: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#2b2b2b' }}>
      {/* Top Toolbar */}
      <UnityToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        blockCount={blocks.length}
      />

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Hierarchy */}
        <HierarchyPanel
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          width={hierarchyWidth}
        />

        {/* Center Panel - Scene/Canvas */}
        <ScenePanel
          blocks={blocks}
          onChange={onChange}
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          viewMode={viewMode}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          showPageHeader={showPageHeader}
        />

        {/* Right Panel - Inspector */}
        <InspectorPanel
          selectedBlock={selectedBlock}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onDuplicateBlock={handleDuplicateBlock}
          width={inspectorWidth}
        />
      </div>
    </div>
  )
}
