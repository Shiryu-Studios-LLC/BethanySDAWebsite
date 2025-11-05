// Cloudflare Pages Function for listing and deleting media files

// GET - List all media files
export async function onRequestGet({ request, env }) {
  try {
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
