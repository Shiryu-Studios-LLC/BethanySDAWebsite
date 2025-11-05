import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconUpload, IconTrash, IconLink } from '@tabler/icons-react'

export default function MediaLibrary() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('images/hero')
  const [uploading, setUploading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])

  const folders = [
    { value: 'images/hero', label: 'Hero Images' },
    { value: 'images/events', label: 'Events' },
    { value: 'images/gallery', label: 'Gallery' },
    { value: 'videos/hero', label: 'Hero Videos' },
    { value: 'videos/sermons', label: 'Sermons' },
    { value: 'documents/bulletins', label: 'Bulletins' }
  ]

  const handleFileSelection = (e) => {
    setSelectedFiles(Array.from(e.target.files))
  }

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    // TODO: Implement upload to API
    alert('Upload functionality coming soon!')
    setUploading(false)
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  const deleteFile = async (fileKey) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    // TODO: Implement delete API call
    alert('Delete functionality coming soon!')
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle">
                <Link to="/admin" className="text-muted">
                  <IconArrowLeft className="me-1" size={16} />
                  Back to Admin Portal
                </Link>
              </div>
              <h2 className="page-title">Media Library</h2>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <IconUpload className="me-2" size={20} />
                  Upload New Media
                </h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Folder</label>
                  <select
                    className="form-select"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                  >
                    {folders.map(folder => (
                      <option key={folder.value} value={folder.value}>
                        {folder.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Files</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleFileSelection}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={uploadFiles}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  <IconUpload className="me-2" size={20} />
                  Upload {selectedFiles.length > 0 ? `${selectedFiles.length} File(s)` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="mb-3">Media Files</h3>
          </div>
          {mediaFiles.length === 0 ? (
            <div className="col-12">
              <div className="empty">
                <div className="empty-icon">
                  <IconPhoto size={48} />
                </div>
                <p className="empty-title">No media files yet</p>
                <p className="empty-subtitle text-muted">
                  Upload your first file to get started
                </p>
              </div>
            </div>
          ) : (
            mediaFiles.map((media) => (
              <div key={media.fileKey} className="col-md-3">
                <div className="card">
                  <div className="card-body p-2">
                    <div className="ratio ratio-16x9 mb-2 bg-light">
                      {/* TODO: Add image preview */}
                    </div>
                    <p className="mb-2 small text-truncate" title={media.fileName}>
                      {media.fileName}
                    </p>
                    <div className="btn-group w-100">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => copyUrl(media.publicUrl)}
                      >
                        <IconLink size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteFile(media.fileKey)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
