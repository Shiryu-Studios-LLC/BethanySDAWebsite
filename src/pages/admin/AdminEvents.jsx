import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconPlus, IconEdit, IconTrash, IconCalendar, IconClock, IconMapPin, IconUsers } from '@tabler/icons-react'
import AlertModal from '../../components/AlertModal'
import ConfirmModal from '../../components/ConfirmModal'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'service',
    imageUrl: '',
    registrationRequired: false,
    maxAttendees: ''
  })

  const categories = [
    { value: 'service', label: 'Church Service', color: 'primary' },
    { value: 'prayer', label: 'Prayer Meeting', color: 'success' },
    { value: 'bible-study', label: 'Bible Study', color: 'info' },
    { value: 'youth', label: 'Youth Event', color: 'warning' },
    { value: 'community', label: 'Community Outreach', color: 'danger' },
    { value: 'special', label: 'Special Event', color: 'purple' }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      // TODO: Fetch from API once backend is ready
      // For now, load from localStorage
      const stored = localStorage.getItem('events')
      if (stored) {
        setEvents(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveEvents = (updatedEvents) => {
    // TODO: Save to API once backend is ready
    // Sort events by date (newest first)
    const sortedEvents = updatedEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
    localStorage.setItem('events', JSON.stringify(sortedEvents))
    setEvents(sortedEvents)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      setAlert({ message: 'Please fill in required fields', type: 'error' })
      return
    }

    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(ev =>
        ev.id === editingEvent.id ? { ...formData, id: ev.id } : ev
      )
      saveEvents(updatedEvents)
      setAlert({ message: 'Event updated successfully!', type: 'success' })
    } else {
      // Add new event
      const newEvent = {
        ...formData,
        id: Date.now().toString()
      }
      saveEvents([newEvent, ...events])
      setAlert({ message: 'Event added successfully!', type: 'success' })
    }

    resetForm()
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData(event)
    setShowForm(true)
  }

  const handleDeleteClick = (event) => {
    setConfirmDelete(event)
  }

  const deleteEvent = () => {
    if (!confirmDelete) return

    const updatedEvents = events.filter(ev => ev.id !== confirmDelete.id)
    saveEvents(updatedEvents)
    setAlert({ message: `"${confirmDelete.title}" deleted successfully!`, type: 'success' })
    setConfirmDelete(null)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'service',
      imageUrl: '',
      registrationRequired: false,
      maxAttendees: ''
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryInfo = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue)
    return category || { label: categoryValue, color: 'secondary' }
  }

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date(new Date().setHours(0, 0, 0, 0))
  }

  const upcomingEvents = events.filter(ev => isUpcoming(ev.date))
  const pastEvents = events.filter(ev => !isUpcoming(ev.date))

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
              <h2 className="page-title">Event Management</h2>
              <p className="text-muted mt-1">Manage church events, services, and special programs</p>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(!showForm)}
              >
                <IconPlus size={20} className="me-1" />
                {showForm ? 'Cancel' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconCalendar className="me-2" size={20} />
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label required">Event Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="e.g., Sabbath Worship Service"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label required">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      placeholder="e.g., Main Sanctuary"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      placeholder="Event details and information..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="imageUrl"
                      placeholder="https://example.com/event-image.jpg"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                    />
                    <small className="form-hint">Optional event image from Media Library</small>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Max Attendees</label>
                    <input
                      type="number"
                      className="form-control"
                      name="maxAttendees"
                      placeholder="Optional"
                      value={formData.maxAttendees}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="registrationRequired"
                        checked={formData.registrationRequired}
                        onChange={handleInputChange}
                      />
                      <span className="form-check-label">Registration Required</span>
                    </label>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconCalendar className="me-2" size={20} />
                Upcoming Events ({upcomingEvents.length})
              </h3>
            </div>
            <div className="card-body">
              <div className="row row-cards">
                {upcomingEvents.map((event) => {
                  const categoryInfo = getCategoryInfo(event.category)
                  return (
                    <div key={event.id} className="col-md-6 col-lg-4">
                      <div className="card card-sm shadow-sm">
                        {event.imageUrl && (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="card-img-top"
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body">
                          <span className={`badge bg-${categoryInfo.color}-lt mb-2`}>
                            {categoryInfo.label}
                          </span>
                          <h4 className="card-title mb-2">{event.title}</h4>
                          <div className="text-muted small mb-2">
                            <div className="mb-1">
                              <IconCalendar size={16} className="me-1" />
                              {formatDate(event.date)}
                            </div>
                            <div className="mb-1">
                              <IconClock size={16} className="me-1" />
                              {event.time}
                            </div>
                            <div className="mb-1">
                              <IconMapPin size={16} className="me-1" />
                              {event.location}
                            </div>
                            {event.maxAttendees && (
                              <div className="mb-1">
                                <IconUsers size={16} className="me-1" />
                                Max {event.maxAttendees} attendees
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-muted small mb-3">{event.description}</p>
                          )}
                          {event.registrationRequired && (
                            <div className="badge bg-warning-lt mb-3">Registration Required</div>
                          )}
                          <div className="btn-list">
                            <button
                              className="btn btn-sm btn-outline-primary w-100"
                              onClick={() => handleEdit(event)}
                            >
                              <IconEdit size={16} className="me-1" />
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger w-100"
                              onClick={() => handleDeleteClick(event)}
                            >
                              <IconTrash size={16} className="me-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title">
                <IconCalendar className="me-2" size={20} />
                Past Events ({pastEvents.length})
              </h3>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {pastEvents.map((event) => {
                  const categoryInfo = getCategoryInfo(event.category)
                  return (
                    <div key={event.id} className="list-group-item">
                      <div className="row align-items-center">
                        <div className="col">
                          <span className={`badge bg-${categoryInfo.color}-lt me-2`}>
                            {categoryInfo.label}
                          </span>
                          <span className="badge bg-secondary-lt">Past</span>
                          <h4 className="mt-2 mb-1">{event.title}</h4>
                          <div className="text-muted small">
                            <span className="me-3">
                              <IconCalendar size={16} className="me-1" />
                              {formatDate(event.date)}
                            </span>
                            <span className="me-3">
                              <IconClock size={16} className="me-1" />
                              {event.time}
                            </span>
                            <span>
                              <IconMapPin size={16} className="me-1" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="btn-list">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(event)}
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {loading ? (
          <div className="card mt-4">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading events...</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="card mt-4">
            <div className="card-body">
              <div className="empty">
                <div className="empty-icon">
                  <IconCalendar size={64} className="text-muted" />
                </div>
                <p className="empty-title h3">No events yet</p>
                <p className="empty-subtitle text-muted">
                  Add your first event to get started
                </p>
              </div>
            </div>
          </div>
        ) : null}
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
          title="Delete Event"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          onConfirm={deleteEvent}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
