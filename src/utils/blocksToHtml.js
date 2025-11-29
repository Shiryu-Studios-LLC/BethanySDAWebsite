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
  // Support both 'content' and 'data' properties for backward compatibility
  const blockData = block.content || block.data || {}

  switch (block.type) {
    case 'navbar':
      const isSticky = blockData.sticky ? 'position: sticky; top: 0; z-index: 1000;' : ''
      const isTransparent = blockData.transparent ? 'background-color: transparent; backdrop-filter: blur(10px);' : `background-color: ${escapeHtml(blockData.backgroundColor || '#ffffff')};`
      return `
        <nav style="${isSticky} ${isTransparent} color: ${escapeHtml(blockData.textColor || '#333333')}; padding: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; font-size: 1.25rem;">
              ${blockData.brandLogo ? `<img src="${escapeHtml(blockData.brandLogo)}" alt="${escapeHtml(blockData.brandName || '')}" style="height: 40px; margin-right: 10px;">` : ''}
              ${escapeHtml(blockData.brandName || 'Brand')}
            </div>
            <div style="display: flex; gap: 2rem;">
              ${(blockData.links || []).map(link => `
                <a href="${escapeHtml(link.url || '#')}" style="color: inherit; text-decoration: none; font-weight: 500;">
                  ${escapeHtml(link.text || '')}
                </a>
              `).join('')}
            </div>
          </div>
        </nav>
      `

    case 'hero':
      const bgType = blockData.backgroundType || 'color'
      const bgColor = blockData.backgroundColor || '#0054a6'
      const bgImage = blockData.backgroundImage || ''
      const bgVideo = blockData.backgroundVideo || ''

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
            <h1 class="display-4 mb-3">${escapeHtml(blockData.title || '')}</h1>
            <p class="lead mb-4">${escapeHtml(blockData.subtitle || '')}</p>
            ${blockData.buttonText ? `
              <a href="${escapeHtml(blockData.buttonUrl || '#')}" class="btn btn-light btn-lg">
                ${escapeHtml(blockData.buttonText)}
              </a>
            ` : ''}
          </div>
        </div>
      `

    case 'heading':
      const level = blockData.level || 2
      const align = blockData.align || 'left'
      return `
        <h${level} style="text-align: ${align}" class="mb-3">
          ${escapeHtml(blockData.text || '')}
        </h${level}>
      `

    case 'text':
      return `
        <div class="mb-4">
          ${blockData.html || ''}
        </div>
      `

    case 'image':
      return `
        <div class="text-center mb-4">
          <img
            src="${escapeHtml(blockData.url || '')}"
            alt="${escapeHtml(blockData.alt || '')}"
            class="img-fluid rounded"
          />
          ${blockData.caption ? `
            <p class="text-muted mt-2">${escapeHtml(blockData.caption)}</p>
          ` : ''}
        </div>
      `

    case 'video':
      return `
        <div class="ratio ratio-16x9 mb-4">
          <iframe
            src="https://www.youtube.com/embed/${escapeHtml(blockData.youtubeId || '')}"
            allowfullscreen
            style="border: 0"
          ></iframe>
        </div>
      `

    case 'button':
      const style = blockData.style || 'primary'
      const size = blockData.size || 'md'
      return `
        <div class="text-center mb-4">
          <a
            href="${escapeHtml(blockData.url || '#')}"
            class="btn btn-${style} btn-${size}"
          >
            ${escapeHtml(blockData.text || '')}
          </a>
        </div>
      `

    case 'columns':
      const columnCount = blockData.columnCount || blockData.columns?.length || 2
      const colWidth = 12 / columnCount
      return `
        <div class="row g-3 mb-4">
          ${(blockData.columns || []).map(col => `
            <div class="col-md-${colWidth}">
              ${col.blocks && col.blocks.length > 0 ? blocksToHtml(col.blocks) : ''}
            </div>
          `).join('')}
        </div>
      `

    case 'spacer':
      return `
        <div style="height: ${parseInt(blockData.height) || 40}px" class="mb-4"></div>
      `

    case 'divider':
      const thickness = parseInt(blockData.thickness) || 1
      const color = blockData.color || '#dee2e6'
      return `
        <hr style="border-top: ${thickness}px solid ${escapeHtml(color)}" class="mb-4" />
      `

    case 'card':
      return `
        <div class="card mb-4">
          <div class="card-body text-center">
            ${blockData.icon ? `<div class="mb-3" style="font-size: 3rem">${escapeHtml(blockData.icon)}</div>` : ''}
            <h3 class="card-title">${escapeHtml(blockData.title || '')}</h3>
            <p class="text-muted">${escapeHtml(blockData.description || '')}</p>
            ${blockData.linkText ? `
              <a href="${escapeHtml(blockData.linkUrl || '#')}" class="btn btn-primary">
                ${escapeHtml(blockData.linkText)}
              </a>
            ` : ''}
          </div>
        </div>
      `

    case 'quote':
      return `
        <blockquote class="blockquote text-center mb-4">
          <p class="mb-3 fs-4">"${escapeHtml(blockData.quote || '')}"</p>
          <footer class="blockquote-footer">
            ${escapeHtml(blockData.author || '')}
            ${blockData.role ? `<cite class="ms-2">- ${escapeHtml(blockData.role)}</cite>` : ''}
          </footer>
        </blockquote>
      `

    case 'embed':
      return `
        <div class="mb-4" style="height: ${parseInt(blockData.height) || 400}px">
          ${blockData.embedCode || ''}
        </div>
      `

    case 'callout':
      const calloutStyle = blockData.style || 'info'
      return `
        <div class="alert alert-${calloutStyle} mb-4" role="alert">
          <h4 class="alert-title">${escapeHtml(blockData.title || '')}</h4>
          <div class="text-muted">${escapeHtml(blockData.message || '')}</div>
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
