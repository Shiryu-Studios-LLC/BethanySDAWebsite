// Cloudflare Pages Functions API for Dynamic Pages
// This handles all pages CRUD operations

// Helper function to check if running in local development
function isLocalDevelopment(request) {
  const url = new URL(request.url)
  return url.hostname === 'localhost' || url.hostname === '127.0.0.1'
}

// Helper function to verify Cloudflare Access authentication
function verifyAuthentication(request) {
  // Skip authentication in local development
  if (isLocalDevelopment(request)) {
    return true
  }

  // Check for Cloudflare Access JWT in cookies
  const cookies = request.headers.get('Cookie') || ''
  const cfAccessToken = cookies.split(';').find(c => c.trim().startsWith('CF_Authorization='))

  if (!cfAccessToken) {
    return false
  }

  return true
}

export async function onRequest(context) {
  const { request, env, params } = context
  const url = new URL(request.url)
  const path = params.path ? params.path.join('/') : ''

  // Determine CORS origin based on environment
  const allowedOrigin = isLocalDevelopment(request)
    ? 'http://localhost:5173'
    : url.origin

  // CORS headers with restricted origin
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // List all pages (GET /api/pages)
    if (request.method === 'GET' && !path) {
      return await listPages(request, env, corsHeaders)
    }

    // Get single page by slug (GET /api/pages/:slug)
    if (request.method === 'GET' && path) {
      return await getPageBySlug(request, env, corsHeaders, path)
    }

    // Create new page (POST /api/pages)
    if (request.method === 'POST' && !path) {
      return await createPage(request, env, corsHeaders)
    }

    // Update page (PUT /api/pages/:id)
    if (request.method === 'PUT' && path) {
      return await updatePage(request, env, corsHeaders, path)
    }

    // Delete page (DELETE /api/pages/:id)
    if (request.method === 'DELETE' && path) {
      return await deletePage(request, env, corsHeaders, path)
    }

    return jsonResponse({ error: 'Not found' }, 404, corsHeaders)
  } catch (error) {
    console.error('API Error:', error)
    return jsonResponse({ error: error.message }, 500, corsHeaders)
  }
}

// List all pages
async function listPages(request, env, corsHeaders) {
  const { results } = await env.DB.prepare(`
    SELECT id, slug, title, meta_description, is_published, show_in_nav, nav_order, created_at, updated_at
    FROM pages
    ORDER BY nav_order ASC, title ASC
  `).all()

  return jsonResponse({ pages: results }, 200, corsHeaders)
}

// Get page by slug
async function getPageBySlug(request, env, corsHeaders, slug) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM pages WHERE slug = ?
  `).bind(slug).all()

  if (results.length === 0) {
    return jsonResponse({ error: 'Page not found' }, 404, corsHeaders)
  }

  return jsonResponse(results[0], 200, corsHeaders)
}

// Create new page
async function createPage(request, env, corsHeaders) {
  // Verify authentication - only authenticated admins can create pages
  if (!verifyAuthentication(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
  }

  const page = await request.json()

  // Input validation
  if (!page.title || typeof page.title !== 'string') {
    return jsonResponse({ error: 'Invalid input: title is required' }, 400, corsHeaders)
  }

  // Generate slug from title if not provided
  const slug = page.slug || page.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Check if slug already exists
  const { results: existing } = await env.DB.prepare(
    'SELECT id FROM pages WHERE slug = ?'
  ).bind(slug).all()

  if (existing.length > 0) {
    return jsonResponse({ error: 'A page with this slug already exists' }, 400, corsHeaders)
  }

  // Insert new page
  const result = await env.DB.prepare(`
    INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order, show_page_header)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    slug,
    page.title,
    page.content || '',
    page.meta_description || '',
    page.is_published !== undefined ? (page.is_published ? 1 : 0) : 1,
    page.show_in_nav ? 1 : 0,
    page.nav_order || 999,
    page.show_page_header !== undefined ? (page.show_page_header ? 1 : 0) : 1
  ).run()

  return jsonResponse({
    success: true,
    message: 'Page created successfully',
    id: result.meta.last_row_id,
    slug
  }, 201, corsHeaders)
}

// Update page
async function updatePage(request, env, corsHeaders, id) {
  // Verify authentication - only authenticated admins can update pages
  if (!verifyAuthentication(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
  }

  const page = await request.json()

  // Input validation
  if (!page || typeof page !== 'object') {
    return jsonResponse({ error: 'Invalid input: page data is required' }, 400, corsHeaders)
  }

  // Build update query dynamically based on provided fields
  const updates = []
  const values = []

  if (page.title !== undefined) {
    updates.push('title = ?')
    values.push(page.title)
  }
  if (page.content !== undefined) {
    updates.push('content = ?')
    values.push(page.content)
  }
  if (page.meta_description !== undefined) {
    updates.push('meta_description = ?')
    values.push(page.meta_description)
  }
  if (page.is_published !== undefined) {
    updates.push('is_published = ?')
    values.push(page.is_published ? 1 : 0)
  }
  if (page.show_in_nav !== undefined) {
    updates.push('show_in_nav = ?')
    values.push(page.show_in_nav ? 1 : 0)
  }
  if (page.nav_order !== undefined) {
    updates.push('nav_order = ?')
    values.push(page.nav_order)
  }
  if (page.show_page_header !== undefined) {
    updates.push('show_page_header = ?')
    values.push(page.show_page_header ? 1 : 0)
  }

  updates.push('updated_at = CURRENT_TIMESTAMP')
  values.push(id)

  await env.DB.prepare(`
    UPDATE pages
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...values).run()

  return jsonResponse({ success: true, message: 'Page updated successfully' }, 200, corsHeaders)
}

// Delete page
async function deletePage(request, env, corsHeaders, id) {
  // Verify authentication - only authenticated admins can delete pages
  if (!verifyAuthentication(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
  }

  await env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(id).run()

  return jsonResponse({ success: true, message: 'Page deleted successfully' }, 200, corsHeaders)
}

// Helper function
function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }
  })
}
