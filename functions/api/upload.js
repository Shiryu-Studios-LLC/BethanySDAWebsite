// Cloudflare Pages Function for uploading files to R2
export async function onRequestPost({ request, env }) {
  try {
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
