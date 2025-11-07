import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IconX, IconUpload, IconTrash, IconSearch, IconCopy, IconCheck, IconPhoto, IconAlertCircle } from '@tabler/icons-react';

const ImageUploadManager = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  // Accepted file types
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // Fetch images on mount
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  // Filter images based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = images.filter(img =>
        img.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchTerm, images]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data.images || []);
      setFilteredImages(data.images || []);
    } catch (err) {
      setError('Failed to load images');
      console.error('Fetch images error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Accepted: JPG, PNG, GIF, WebP`);
    }
    if (file.size > maxFileSize) {
      throw new Error(`File too large. Maximum size: 5MB`);
    }
    return true;
  };

  const uploadFile = async (file) => {
    try {
      validateFile(file);

      const formData = new FormData();
      formData.append('image', file);

      // Create unique ID for tracking progress
      const uploadId = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(prev => ({ ...prev, [uploadId]: percentComplete }));
          }
        });

        xhr.addEventListener('load', () => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[uploadId];
            return newProgress;
          });

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (err) {
              reject(new Error('Invalid server response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[uploadId];
            return newProgress;
          });
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/upload-image');
        xhr.send(formData);
      });
    } catch (err) {
      throw err;
    }
  };

  const handleFileSelect = async (files) => {
    setError(null);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      try {
        const response = await uploadFile(file);
        // Add new image to the list
        const newImage = {
          filename: response.filename || file.name,
          url: response.url,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        setImages(prev => [newImage, ...prev]);
      } catch (err) {
        setError(err.message);
        console.error('Upload error:', err);
      }
    }
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete image');

      setImages(prev => prev.filter(img => img.filename !== filename));
      if (selectedImage?.filename === filename) {
        setSelectedImage(null);
      }
    } catch (err) {
      setError('Failed to delete image');
      console.error('Delete error:', err);
    }
  };

  const handleCopyUrl = (url, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    if (onSelectImage) {
      onSelectImage(image.url);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Get image dimensions
  const [imageDimensions, setImageDimensions] = useState({});

  const loadImageDimensions = (url, filename) => {
    if (!imageDimensions[filename]) {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions(prev => ({
          ...prev,
          [filename]: { width: img.width, height: img.height }
        }));
      };
      img.src = url;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-[800px] max-h-[90vh] bg-[#2d2d2d] rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3d3d3d]">
          <h2 className="text-lg font-semibold text-white">Image Manager</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#3d3d3d] rounded transition-colors"
          >
            <IconX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-center gap-2">
            <IconAlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Upload Area */}
        <div className="p-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-[#4d4d4d] hover:border-[#5d5d5d] bg-[#252525]'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.webp"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            <IconUpload className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-300 mb-2">
              Drag and drop images here, or
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Accepted: JPG, PNG, GIF, WebP • Max size: 5MB
            </p>
          </div>

          {/* Upload Progress */}
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="mt-2">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#1d1d1d] rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#252525] border border-[#3d3d3d] rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Images Grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-400">Loading images...</div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <IconPhoto className="w-12 h-12 mb-2 opacity-50" />
              <p>{searchTerm ? 'No images found' : 'No images uploaded yet'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {filteredImages.map((image) => {
                loadImageDimensions(image.url, image.filename);
                const dims = imageDimensions[image.filename];

                return (
                  <div
                    key={image.filename}
                    className={`relative group cursor-pointer rounded overflow-hidden bg-[#252525] ${
                      selectedImage?.filename === image.filename ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleSelectImage(image)}
                    onMouseEnter={() => setHoveredImage(image.filename)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <div className="relative w-full h-[150px]">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={(e) => handleCopyUrl(image.url, e)}
                            className="p-1 bg-[#2d2d2d] rounded hover:bg-[#3d3d3d] transition-colors"
                            title="Copy URL"
                          >
                            {copiedUrl === image.url ? (
                              <IconCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <IconCopy className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDelete(image.filename, e)}
                            className="p-1 bg-[#2d2d2d] rounded hover:bg-red-600 transition-colors"
                            title="Delete"
                          >
                            <IconTrash className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* Image Info */}
                        <div className="text-xs text-white">
                          <div className="truncate">{image.filename}</div>
                          {dims && (
                            <div className="text-gray-400">
                              {dims.width} × {dims.height}px
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedImage && (
          <div className="p-4 border-t border-[#3d3d3d] flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Selected: <span className="text-white">{selectedImage.filename}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSelectImage(selectedImage.url);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Use Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadManager;