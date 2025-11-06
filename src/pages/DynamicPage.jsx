import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { blocksToHtml } from '../utils/blocksToHtml'

export default function DynamicPage({ fixedSlug }) {
  const { slug: paramSlug } = useParams()
  const slug = fixedSlug || paramSlug
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadPage()
  }, [slug])

  const loadPage = async () => {
    try {
      setLoading(true)
      setNotFound(false)
      const response = await fetch(`/api/pages/${slug}`)

      if (response.ok) {
        const data = await response.json()

        // Only show published pages to public
        if (data.is_published) {
          // Parse content from JSON string to blocks array
          let content = data.content
          if (typeof content === 'string') {
            try {
              const blocks = JSON.parse(content)
              // Convert blocks to HTML
              content = blocksToHtml(blocks)
            } catch (e) {
              // If parsing fails, use content as-is (backward compatibility with old HTML content)
              console.warn('Failed to parse content as JSON, using as HTML')
            }
          }

          setPage({ ...data, content })
        } else {
          setNotFound(true)
        }
      } else if (response.status === 404) {
        setNotFound(true)
      }
    } catch (error) {
      console.error('Error loading page:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-body">
        <div className="container-xl d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page-body">
        <div className="container-xl text-center py-5">
          <h1 className="display-1 text-muted">404</h1>
          <h2>Page Not Found</h2>
          <p className="text-muted">The page you're looking for doesn't exist or has been removed.</p>
          <a href="/" className="btn btn-primary mt-3">Go Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="page-body">
      {/* Hero Section - Optional based on show_page_header setting */}
      {page.show_page_header && (
        <section className="py-5 bg-dark text-white">
          <div className="container py-5">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold mb-4">{page.title}</h1>
                {page.meta_description && (
                  <p className="lead mb-0">{page.meta_description}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Page Content */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="dynamic-page-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(page.content)
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
