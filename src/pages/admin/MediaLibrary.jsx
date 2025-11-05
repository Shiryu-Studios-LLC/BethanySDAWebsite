import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconUpload, IconTrash, IconLink, IconPhoto, IconCheck, IconX, IconFileText, IconVideo, IconFile } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'

export default function MediaLibrary() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('images/hero')
  const [uploading, setUploading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [filterFolder, setFilterFolder] = useState('all')
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const folders = [
    { value: 'images/hero', label: 'Hero Images' },
    { value: 'images/events', label: 'Events' },
    { value: 'images/gallery', label: 'Gallery' },
    { value: 'videos/hero', label: 'Hero Videos' },
    { value: 'videos/sermons', label: 'Sermons' },
    { value: 'documents/bulletins', label: 'Bulletins' }
  ]

  // Load media files on component mount
  useEffect(() => {
    loadMediaFiles()
  }, [])

  const loadMediaFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media')

      if (response.ok) {
        const data = await response.json()
        setMediaFiles(data.files || [])
      } else {
        console.error('Failed to load media files')
      }
    } catch (error) {
      console.error('Error loading media files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelection = (e) => {
    setSelectedFiles(Array.from(e.target.files))
    setUploadSuccess(false)
  }

  const removeSelectedFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <IconPhoto size={20} />
    if (fileName.match(/\.(mp4|webm|ogg)$/i)) return <IconVideo size={20} />
    if (fileName.match(/\.(pdf|doc|docx)$/i)) return <IconFileText size={20} />
    return <IconFile size={20} />
  }

  const filteredMedia = filterFolder === 'all'
    ? mediaFiles
    : mediaFiles.filter(media => media.fileKey.startsWith(filterFolder))

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)

    try {
      // Upload files one by one
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', selectedFolder)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      await Promise.all(uploadPromises)

      // Reload media files after successful upload
      await loadMediaFiles()

      // Clear selected files
      setSelectedFiles([])

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''

      // Show success message
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error) {
      console.error('Upload error:', error)
      setAlert({ message: `Error uploading files: ${error.message}`, type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setAlert({ message: 'URL copied to clipboard!', type: 'success' })
  }

  const handleDeleteClick = (fileKey, fileName) => {
    setConfirmDelete({ fileKey, fileName })
  }

  const deleteFile = async () => {
    if (!confirmDelete) return

    const { fileKey, fileName } = confirmDelete

    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileKey })
      })

      if (response.ok) {
        // Reload media files after deletion
        await loadMediaFiles()
        setAlert({ message: `"${fileName}" deleted successfully!`, type: 'success' })
      } else {
        const error = await response.json()
        setAlert({ message: `Error deleting file: ${error.error}`, type: 'error' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setAlert({ message: `Error deleting file: ${error.message}`, type: 'error' })
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <div className="page-pretitle">
                <Link to="/admin" className="text-muted text-decoration-none">
                  <IconArrowLeft className="me-1" size={16} />
                  Back to Admin Portal
                </Link>
              </div>
              <h2 className="page-title">Media Library</h2>
              <p className="text-muted mt-1">Upload and manage your media files</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
            <div className="d-flex align-items-center">
              <IconCheck className="me-2" size={20} />
              <div>Files uploaded successfully!</div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="row mt-4">
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0">
                  <IconUpload className="me-2" size={20} />
                  Upload Files
                </h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Destination Folder</label>
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
                  <small className="form-hint">Choose where to store your files</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Select Files</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleFileSelection}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  <small className="form-hint">You can select multiple files</small>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Selected Files ({selectedFiles.length})</label>
                    <div className="list-group list-group-flush">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div className="d-flex align-items-center">
                            {getFileIcon(file.name)}
                            <div className="ms-2">
                              <div className="small text-truncate" style={{ maxWidth: '200px' }}>
                                {file.name}
                              </div>
                              <small className="text-muted">{formatFileSize(file.size)}</small>
                            </div>
                          </div>
                          <button
                            className="btn btn-sm btn-ghost-danger"
                            onClick={() => removeSelectedFile(index)}
                            title="Remove"
                          >
                            <IconX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary w-100"
                  onClick={uploadFiles}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <IconUpload className="me-2" size={20} />
                      Upload {selectedFiles.length > 0 ? `${selectedFiles.length} File(s)` : 'Files'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="card-title mb-0">
                    <IconPhoto className="me-2" size={20} />
                    Your Media Files
                  </h3>
                  <select
                    className="form-select w-auto"
                    value={filterFolder}
                    onChange={(e) => setFilterFolder(e.target.value)}
                  >
                    <option value="all">All Folders</option>
                    {folders.map(folder => (
                      <option key={folder.value} value={folder.value}>
                        {folder.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="card-body" style={{ minHeight: '400px' }}>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading your media files...</p>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">
                      <IconPhoto size={64} className="text-muted" />
                    </div>
                    <p className="empty-title h3">No media files yet</p>
                    <p className="empty-subtitle text-muted">
                      {filterFolder === 'all'
                        ? 'Upload your first file to get started'
                        : 'No files in this folder'}
                    </p>
                  </div>
                ) : (
                  <div className="row row-cards">
                    {filteredMedia.map((media) => (
                      <div key={media.fileKey} className="col-md-6 col-xl-4">
                        <div className="card card-sm shadow-sm hover-shadow-lg transition">
                          <div className="card-img-top img-responsive img-responsive-16x9 bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '150px' }}>
                            {media.fileKey.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={media.publicUrl}
                                alt={media.fileName}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : media.fileKey.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video
                                src={media.publicUrl}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <IconPhoto size={48} className="text-muted" />
                            )}
                          </div>
                          <div className="card-body">
                            <div className="d-flex align-items-start mb-2">
                              {getFileIcon(media.fileName)}
                              <div className="ms-2 flex-grow-1">
                                <div className="small fw-bold text-truncate" title={media.fileName}>
                                  {media.fileName}
                                </div>
                                {media.size && (
                                  <small className="text-muted">{formatFileSize(media.size)}</small>
                                )}
                              </div>
                            </div>
                            <div className="btn-list">
                              <button
                                className="btn btn-sm btn-primary w-100"
                                onClick={() => copyUrl(media.publicUrl)}
                              >
                                <IconLink size={16} className="me-1" />
                                Copy URL
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger w-100"
                                onClick={() => handleDeleteClick(media.fileKey, media.fileName)}
                              >
                                <IconTrash size={16} className="me-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Alert Modal */}
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete File"
          message={`Are you sure you want to delete "${confirmDelete.fileName}"? This action cannot be undone.`}
          onConfirm={deleteFile}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
