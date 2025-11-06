/**
 * Convert blocks array to HTML for frontend rendering
 */
export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return ''
  }

  return blocks.map(block => renderBlock(block)).join('\n')
}

function renderBlock(block) {
  switch (block.type) {
    case 'hero':
      return `
        <div class="bg-primary text-white p-5 text-center rounded mb-4">
          <h1 class="display-4 mb-3">${escapeHtml(block.content.title || '')}</h1>
          <p class="lead mb-4">${escapeHtml(block.content.subtitle || '')}</p>
          ${block.content.buttonText ? `
            <a href="${escapeHtml(block.content.buttonUrl || '#')}" class="btn btn-light btn-lg">
              ${escapeHtml(block.content.buttonText)}
            </a>
          ` : ''}
        </div>
      `

    case 'heading':
      const level = block.content.level || 2
      const align = block.content.align || 'left'
      return `
        <h${level} style="text-align: ${align}" class="mb-3">
          ${escapeHtml(block.content.text || '')}
        </h${level}>
      `

    case 'text':
      return `
        <div class="mb-4">
          ${block.content.html || ''}
        </div>
      `

    case 'image':
      return `
        <div class="text-center mb-4">
          <img
            src="${escapeHtml(block.content.url || '')}"
            alt="${escapeHtml(block.content.alt || '')}"
            class="img-fluid rounded"
          />
          ${block.content.caption ? `
            <p class="text-muted mt-2">${escapeHtml(block.content.caption)}</p>
          ` : ''}
        </div>
      `

    case 'video':
      return `
        <div class="ratio ratio-16x9 mb-4">
          <iframe
            src="https://www.youtube.com/embed/${escapeHtml(block.content.youtubeId || '')}"
            allowfullscreen
            style="border: 0"
          ></iframe>
        </div>
      `

    case 'button':
      const style = block.content.style || 'primary'
      const size = block.content.size || 'md'
      return `
        <div class="text-center mb-4">
          <a
            href="${escapeHtml(block.content.url || '#')}"
            class="btn btn-${style} btn-${size}"
          >
            ${escapeHtml(block.content.text || '')}
          </a>
        </div>
      `

    case 'columns':
      const columnCount = block.content.columns?.length || 2
      const colWidth = 12 / columnCount
      return `
        <div class="row g-3 mb-4">
          ${(block.content.columns || []).map(col => `
            <div class="col-md-${colWidth}">
              ${col.html || ''}
            </div>
          `).join('')}
        </div>
      `

    case 'spacer':
      return `
        <div style="height: ${parseInt(block.content.height) || 40}px" class="mb-4"></div>
      `

    case 'divider':
      const thickness = parseInt(block.content.thickness) || 1
      const color = block.content.color || '#dee2e6'
      return `
        <hr style="border-top: ${thickness}px solid ${escapeHtml(color)}" class="mb-4" />
      `

    default:
      return ''
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}
