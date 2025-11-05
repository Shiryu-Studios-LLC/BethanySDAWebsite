// API utility for making requests to Cloudflare Pages Functions

const API_BASE = '/api/settings'

/**
 * Fetch site-wide settings
 */
export async function getSiteSettings() {
  const response = await fetch(`${API_BASE}/site`)
  if (!response.ok) {
    throw new Error('Failed to fetch site settings')
  }
  return response.json()
}

/**
 * Update site-wide settings
 */
export async function updateSiteSettings(settings) {
  const response = await fetch(`${API_BASE}/site`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
  if (!response.ok) {
    throw new Error('Failed to update site settings')
  }
  return response.json()
}

/**
 * Fetch homepage settings
 */
export async function getHomepageSettings() {
  const response = await fetch(`${API_BASE}/homepage`)
  if (!response.ok) {
    throw new Error('Failed to fetch homepage settings')
  }
  return response.json()
}

/**
 * Update homepage settings
 */
export async function updateHomepageSettings(settings) {
  const response = await fetch(`${API_BASE}/homepage`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
  if (!response.ok) {
    throw new Error('Failed to update homepage settings')
  }
  return response.json()
}

/**
 * Fetch visit page settings
 */
export async function getVisitPageSettings() {
  const response = await fetch(`${API_BASE}/visit-page`)
  if (!response.ok) {
    throw new Error('Failed to fetch visit page settings')
  }
  return response.json()
}

/**
 * Update visit page settings
 */
export async function updateVisitPageSettings(settings) {
  const response = await fetch(`${API_BASE}/visit-page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
  if (!response.ok) {
    throw new Error('Failed to update visit page settings')
  }
  return response.json()
}

/**
 * Fetch about page settings
 */
export async function getAboutPageSettings() {
  const response = await fetch(`${API_BASE}/about-page`)
  if (!response.ok) {
    throw new Error('Failed to fetch about page settings')
  }
  return response.json()
}

/**
 * Update about page settings
 */
export async function updateAboutPageSettings(settings) {
  const response = await fetch(`${API_BASE}/about-page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
  if (!response.ok) {
    throw new Error('Failed to update about page settings')
  }
  return response.json()
}
