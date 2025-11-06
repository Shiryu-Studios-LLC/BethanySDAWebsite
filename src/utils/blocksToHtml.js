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
      const bgType = block.content.backgroundType || 'color'
      const bgColor = block.content.backgroundColor || '#0054a6'
      const bgImage = block.content.backgroundImage || ''
      const bgVideo = block.content.backgroundVideo || ''

      return `
        <div class="text-white p-5 text-center rounded mb-4 position-relative overflow-hidden" style="background-color: ${bgType === 'color' ? escapeHtml(bgColor) : '#000'}; min-height: 400px; display: flex; align-items: center; justify-content: center;">
          ${bgType === 'video' && bgVideo ? `
            <video autoplay muted loop playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
              <source src="${escapeHtml(bgVideo)}" type="video/mp4">
            </video>
          ` : ''}
          ${bgType === 'image' && bgImage ? `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url(${escapeHtml(bgImage)}); background-size: cover; background-position: center; z-index: 0;"></div>
          ` : ''}
          ${bgType === 'video' || bgType === 'image' ? `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4); z-index: 1;"></div>
          ` : ''}
          <div style="position: relative; z-index: 2;">
            <h1 class="display-4 mb-3">${escapeHtml(block.content.title || '')}</h1>
            <p class="lead mb-4">${escapeHtml(block.content.subtitle || '')}</p>
            ${block.content.buttonText ? `
              <a href="${escapeHtml(block.content.buttonUrl || '#')}" class="btn btn-light btn-lg">
                ${escapeHtml(block.content.buttonText)}
              </a>
            ` : ''}
          </div>
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
      const columnCount = block.content.columnCount || block.content.columns?.length || 2
      const colWidth = 12 / columnCount
      return `
        <div class="row g-3 mb-4">
          ${(block.content.columns || []).map(col => `
            <div class="col-md-${colWidth}">
              ${col.blocks && col.blocks.length > 0 ? blocksToHtml(col.blocks) : ''}
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

    case 'card':
      return `
        <div class="card mb-4">
          <div class="card-body text-center">
            ${block.content.icon ? `<div class="mb-3" style="font-size: 3rem">${escapeHtml(block.content.icon)}</div>` : ''}
            <h3 class="card-title">${escapeHtml(block.content.title || '')}</h3>
            <p class="text-muted">${escapeHtml(block.content.description || '')}</p>
            ${block.content.linkText ? `
              <a href="${escapeHtml(block.content.linkUrl || '#')}" class="btn btn-primary">
                ${escapeHtml(block.content.linkText)}
              </a>
            ` : ''}
          </div>
        </div>
      `

    case 'quote':
      return `
        <blockquote class="blockquote text-center mb-4">
          <p class="mb-3 fs-4">"${escapeHtml(block.content.quote || '')}"</p>
          <footer class="blockquote-footer">
            ${escapeHtml(block.content.author || '')}
            ${block.content.role ? `<cite class="ms-2">- ${escapeHtml(block.content.role)}</cite>` : ''}
          </footer>
        </blockquote>
      `

    case 'embed':
      return `
        <div class="mb-4" style="height: ${parseInt(block.content.height) || 400}px">
          ${block.content.embedCode || ''}
        </div>
      `

    case 'callout':
      const calloutStyle = block.content.style || 'info'
      return `
        <div class="alert alert-${calloutStyle} mb-4" role="alert">
          <h4 class="alert-title">${escapeHtml(block.content.title || '')}</h4>
          <div class="text-muted">${escapeHtml(block.content.message || '')}</div>
        </div>
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
