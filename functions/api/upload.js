// Cloudflare Pages Function for uploading files to R2

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

export async function onRequestPost({ request, env }) {
  try {
    // Verify authentication - only authenticated admins can upload
    if (!verifyAuthentication(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if R2 bucket is configured
    if (!env.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'uploads'

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large. Maximum size is 50MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate file type (only allow common web media types)
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf',
      'audio/mpeg', 'audio/wav'
    ]
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'File type not allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate a unique filename to avoid conflicts
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileKey = `${folder}/${timestamp}-${sanitizedName}`

    // Upload to R2
    await env.MEDIA_BUCKET.put(fileKey, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Generate public URL (if bucket is public)
    const publicUrl = `${env.R2_PUBLIC_URL}/${fileKey}`

    return new Response(JSON.stringify({
      success: true,
      file: {
        fileKey,
        fileName: file.name,
        publicUrl,
        size: file.size,
        type: file.type
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
