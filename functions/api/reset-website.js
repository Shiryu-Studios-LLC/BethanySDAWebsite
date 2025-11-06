/**
 * Reset Website API
 * Resets the website to default church template
 * Preserves media files in R2 bucket
 */

import { readFileSync } from 'fs'
import { join } from 'path'

function isLocalDevelopment(request) {
  const url = new URL(request.url)
  return url.hostname === 'localhost' || url.hostname === '127.0.0.1'
}

function verifyAuthentication(request) {
  if (isLocalDevelopment(request)) {
    return true
  }

  const cookies = request.headers.get('Cookie') || ''
  const cfAccessToken = cookies.split(';').find(cookie =>
    cookie.trim().startsWith('CF_Authorization=')
  )

  return !!cfAccessToken
}

export async function onRequest(context) {
  const { request, env } = context

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isLocalDevelopment(request) ? 'http://localhost:5173' : 'https://bethanysda.pages.dev'
      }
    })
  }

  // Verify authentication
  if (!verifyAuthentication(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isLocalDevelopment(request) ? 'http://localhost:5173' : 'https://bethanysda.pages.dev'
      }
    })
  }

  try {
    const db = env.DB

    // Read the default website SQL file
    const defaultWebsiteSQL = `
      -- Clear existing pages
      DELETE FROM pages;

      -- Homepage
      INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order) VALUES (
        'home',
        'Homepage',
        '[{"id":"block-home-hero","type":"hero","content":{"title":"Welcome to Bethany SDA Church","subtitle":"Join us in worship, fellowship, and service as we grow together in faith","buttonText":"Plan Your Visit","buttonUrl":"/visit","backgroundType":"color","backgroundColor":"#0054a6"}},{"id":"block-home-welcome","type":"text","content":{"html":"<h2>Welcome Home</h2><p>Whether you are a long-time member or visiting for the first time, we are glad you are here.</p>"}},{"id":"block-home-services","type":"columns","content":{"columnCount":3,"columns":[{"blocks":[{"id":"card-sabbath","type":"card","content":{"icon":"📖","title":"Sabbath School","description":"Saturdays at 9:30 AM","linkText":"","linkUrl":""}}]},{"blocks":[{"id":"card-worship","type":"card","content":{"icon":"🙏","title":"Worship Service","description":"Saturdays at 11:00 AM","linkText":"","linkUrl":""}}]},{"blocks":[{"id":"card-prayer","type":"card","content":{"icon":"✨","title":"Prayer Meeting","description":"Wednesdays at 7:00 PM","linkText":"","linkUrl":""}}]}]}}]',
        'Welcome to Bethany SDA Church - Houston''s Haitian Seventh-day Adventist Community',
        1,
        0,
        1
      );

      -- Visit Page
      INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order) VALUES (
        'visit',
        'Plan Your Visit',
        '[{"id":"block-visit-hero","type":"hero","content":{"title":"Plan Your Visit","subtitle":"We would love to meet you!","buttonText":"","buttonUrl":"","backgroundType":"color","backgroundColor":"#28a745"}},{"id":"block-visit-intro","type":"text","content":{"html":"<h2>What to Expect</h2><p>Visiting a new church can be exciting! We want you to feel welcome from the moment you arrive.</p>"}}]',
        'Plan your visit to Bethany SDA Church',
        1,
        1,
        2
      );

      -- About Page
      INSERT INTO pages (slug, title, content, meta_description, is_published, show_in_nav, nav_order) VALUES (
        'about',
        'About Us',
        '[{"id":"block-about-hero","type":"hero","content":{"title":"About Us","subtitle":"Our mission, history, and beliefs","buttonText":"","buttonUrl":"","backgroundType":"color","backgroundColor":"#6c757d"}},{"id":"block-about-mission","type":"text","content":{"html":"<h2>Our Mission</h2><p>To glorify God by making disciples of Jesus Christ, nurturing spiritual growth, and serving our community with love.</p>"}}]',
        'Learn about Bethany SDA Church',
        1,
        1,
        3
      );
    `

    // Execute the reset
    const statements = defaultWebsiteSQL.split(';').filter(s => s.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await db.prepare(statement).run()
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Website reset to default template successfully. Media files preserved.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isLocalDevelopment(request) ? 'http://localhost:5173' : 'https://bethanysda.pages.dev',
        'Access-Control-Allow-Credentials': 'true'
      }
    })
  } catch (error) {
    console.error('Reset error:', error)
    return new Response(JSON.stringify({
      error: 'Failed to reset website',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isLocalDevelopment(request) ? 'http://localhost:5173' : 'https://bethanysda.pages.dev'
      }
    })
  }
}
