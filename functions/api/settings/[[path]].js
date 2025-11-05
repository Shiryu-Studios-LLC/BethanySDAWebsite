// Cloudflare Pages Functions API for Settings
// This handles all settings CRUD operations

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

  // In production, Cloudflare Access handles JWT verification automatically
  // If the request reaches this function, it means the user is authenticated
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
    // Route to appropriate handler
    if (path === 'site') {
      return handleSiteSettings(request, env, corsHeaders)
    } else if (path === 'homepage') {
      return handleHomepageSettings(request, env, corsHeaders)
    } else if (path === 'visit-page') {
      return handleVisitPageSettings(request, env, corsHeaders)
    } else if (path === 'about-page') {
      return handleAboutPageSettings(request, env, corsHeaders)
    }

    return jsonResponse({ error: 'Not found' }, 404, corsHeaders)
  } catch (error) {
    console.error('API Error:', error)
    return jsonResponse({ error: error.message }, 500, corsHeaders)
  }
}

// Site Settings Handlers
async function handleSiteSettings(request, env, corsHeaders) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT key, value FROM site_settings').all()
    const settings = {}
    results.forEach(row => {
      settings[row.key] = row.value
    })
    return jsonResponse(settings, 200, corsHeaders)
  }

  if (request.method === 'PUT') {
    // Verify authentication for write operations
    if (!verifyAuthentication(request)) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
    }

    const settings = await request.json()

    // Input validation
    if (!settings || typeof settings !== 'object') {
      return jsonResponse({ error: 'Invalid input: settings must be an object' }, 400, corsHeaders)
    }

    // Update each setting
    const stmt = env.DB.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')

    for (const [key, value] of Object.entries(settings)) {
      await stmt.bind(key, value).run()
    }

    return jsonResponse({ success: true, message: 'Settings updated successfully' }, 200, corsHeaders)
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
}

// Homepage Settings Handlers
async function handleHomepageSettings(request, env, corsHeaders) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM homepage_settings WHERE id = 1').all()
    const settings = results[0] || {}

    // Convert boolean fields
    if (settings.show_live_stream !== undefined) {
      settings.showLiveStream = Boolean(settings.show_live_stream)
      delete settings.show_live_stream
    }

    // Convert snake_case to camelCase
    if (settings.hero_video_url !== undefined) {
      settings.heroVideoUrl = settings.hero_video_url
      settings.heroImageUrl = settings.hero_image_url
      settings.welcomeMessage = settings.welcome_message
      settings.liveStreamUrl = settings.live_stream_url
      delete settings.hero_video_url
      delete settings.hero_image_url
      delete settings.welcome_message
      delete settings.live_stream_url
    }

    return jsonResponse(settings, 200, corsHeaders)
  }

  if (request.method === 'PUT') {
    // Verify authentication for write operations
    if (!verifyAuthentication(request)) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
    }

    const settings = await request.json()

    // Input validation
    if (!settings || typeof settings !== 'object') {
      return jsonResponse({ error: 'Invalid input: settings must be an object' }, 400, corsHeaders)
    }

    await env.DB.prepare(`
      UPDATE homepage_settings
      SET hero_video_url = ?,
          hero_image_url = ?,
          welcome_message = ?,
          live_stream_url = ?,
          show_live_stream = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      settings.heroVideoUrl || '',
      settings.heroImageUrl || '',
      settings.welcomeMessage || '',
      settings.liveStreamUrl || '',
      settings.showLiveStream ? 1 : 0
    ).run()

    return jsonResponse({ success: true, message: 'Homepage settings updated successfully' }, 200, corsHeaders)
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
}

// Visit Page Settings Handlers
async function handleVisitPageSettings(request, env, corsHeaders) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM visit_page_settings WHERE id = 1').all()
    const settings = results[0] || {}

    // Convert snake_case to camelCase
    if (settings.page_title !== undefined) {
      settings.visitPageTitle = settings.page_title
      settings.visitPageDescription = settings.page_description
      delete settings.page_title
      delete settings.page_description
    }

    return jsonResponse(settings, 200, corsHeaders)
  }

  if (request.method === 'PUT') {
    // Verify authentication for write operations
    if (!verifyAuthentication(request)) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
    }

    const settings = await request.json()

    // Input validation
    if (!settings || typeof settings !== 'object') {
      return jsonResponse({ error: 'Invalid input: settings must be an object' }, 400, corsHeaders)
    }

    await env.DB.prepare(`
      UPDATE visit_page_settings
      SET page_title = ?,
          page_description = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      settings.visitPageTitle || '',
      settings.visitPageDescription || ''
    ).run()

    return jsonResponse({ success: true, message: 'Visit page settings updated successfully' }, 200, corsHeaders)
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
}

// About Page Settings Handlers
async function handleAboutPageSettings(request, env, corsHeaders) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM about_page_settings WHERE id = 1').all()
    const settings = results[0] || {}

    // Convert snake_case to camelCase
    if (settings.mission_statement !== undefined) {
      settings.missionStatement = settings.mission_statement
      settings.ourHistory = settings.our_history
      settings.ourBeliefs = settings.our_beliefs
      delete settings.mission_statement
      delete settings.our_history
      delete settings.our_beliefs
    }

    return jsonResponse(settings, 200, corsHeaders)
  }

  if (request.method === 'PUT') {
    // Verify authentication for write operations
    if (!verifyAuthentication(request)) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders)
    }

    const settings = await request.json()

    // Input validation
    if (!settings || typeof settings !== 'object') {
      return jsonResponse({ error: 'Invalid input: settings must be an object' }, 400, corsHeaders)
    }

    await env.DB.prepare(`
      UPDATE about_page_settings
      SET mission_statement = ?,
          our_history = ?,
          our_beliefs = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(
      settings.missionStatement || '',
      settings.ourHistory || '',
      settings.ourBeliefs || ''
    ).run()

    return jsonResponse({ success: true, message: 'About page settings updated successfully' }, 200, corsHeaders)
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
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
