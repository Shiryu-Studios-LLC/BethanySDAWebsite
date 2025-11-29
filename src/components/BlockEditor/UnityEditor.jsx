import { useState, useEffect } from 'react'
import { IconEye, IconCode, IconChevronDown, IconChevronRight, IconFileText, IconBoxMultiple, IconPhoto, IconQuote } from '@tabler/icons-react'
import HierarchyPanel from './UnityEditor/HierarchyPanel'
import ScenePanel from './UnityEditor/ScenePanel'
import InspectorPanel from './UnityEditor/InspectorPanel'
import UnityToolbar from './UnityEditor/UnityToolbar'

export default function UnityEditor({ blocks, onChange, pageTitle = '', pageSubtitle = '', showPageHeader = true, onSave }) {
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [viewMode, setViewMode] = useState('visual') // 'visual' or 'preview'
  const [hierarchyWidth, setHierarchyWidth] = useState(280)
  const [inspectorWidth, setInspectorWidth] = useState(320)
  const [zoom, setZoom] = useState(100)

  // Undo/Redo state
  const [history, setHistory] = useState([blocks])
  const [historyIndex, setHistoryIndex] = useState(0)

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
    const newBlocks = blocks.map(b => {
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
    })
    handleBlocksChange(newBlocks)
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
    handleBlocksChange(newBlocks)
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
      handleBlocksChange(newBlocks)
      setSelectedBlock(newBlock)
    }
  }

  // Handle blocks change with history
  const handleBlocksChange = (newBlocks) => {
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newBlocks)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    onChange(newBlocks)
  }

  // Undo/Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  // Quick actions
  const handleQuickCopy = () => {
    if (selectedBlock) {
      handleDuplicateBlock(selectedBlock)
    }
  }

  const handleQuickDelete = () => {
    if (selectedBlock) {
      handleDeleteBlock(selectedBlock.id)
    }
  }

  // Keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Z: Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      handleUndo()
    }
    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      handleRedo()
    }
    // Ctrl/Cmd + D: Duplicate
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault()
      handleQuickCopy()
    }
    // Delete or Backspace: Delete selected
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlock) {
      e.preventDefault()
      handleQuickDelete()
    }
    // Ctrl/Cmd + S: Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && onSave) {
      e.preventDefault()
      onSave()
    }
    // Ctrl/Cmd + E: Edit mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault()
      setViewMode('visual')
    }
    // Ctrl/Cmd + P: Preview mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault()
      setViewMode('preview')
    }
  }

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedBlock, historyIndex, history, viewMode])

  return (
    <div className="unity-editor" style={{ height: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#2b2b2b' }}>
      {/* Top Toolbar */}
      <UnityToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        blockCount={blocks.length}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={onSave}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onCopy={handleQuickCopy}
        onDelete={handleQuickDelete}
        hasSelection={selectedBlock !== null}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Hierarchy */}
        <HierarchyPanel
          blocks={blocks}
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          onReorderBlocks={handleBlocksChange}
          width={hierarchyWidth}
        />

        {/* Center Panel - Scene/Canvas */}
        <ScenePanel
          blocks={blocks}
          onChange={handleBlocksChange}
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          viewMode={viewMode}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          showPageHeader={showPageHeader}
          zoom={zoom}
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
