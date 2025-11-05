// Cloudflare Pages Function for listing and deleting media files

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

// GET - List all media files
export async function onRequestGet({ request, env }) {
  try {
    // Verify authentication - only authenticated admins can list media
    if (!verifyAuthentication(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!env.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // List objects from R2
    const listed = await env.MEDIA_BUCKET.list()

    const files = listed.objects.map(obj => ({
      fileKey: obj.key,
      fileName: obj.key.split('/').pop(),
      publicUrl: `${env.R2_PUBLIC_URL}/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded
    }))

    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('List error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// DELETE - Delete a media file
export async function onRequestDelete({ request, env }) {
  try {
    // Verify authentication - only authenticated admins can delete media
    if (!verifyAuthentication(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!env.MEDIA_BUCKET) {
      return new Response(JSON.stringify({ error: 'R2 bucket not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { fileKey } = await request.json()

    if (!fileKey) {
      return new Response(JSON.stringify({ error: 'No file key provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Delete from R2
    await env.MEDIA_BUCKET.delete(fileKey)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Delete error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
