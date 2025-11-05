import { Link } from 'react-router-dom'
import { IconCalendar, IconClock, IconMapPin, IconChevronRight } from '@tabler/icons-react'

export default function Events() {
  // Sample events - will be editable through admin portal later
  const upcomingEvents = [
    {
      id: 1,
      title: 'Sabbath Worship Service',
      date: 'Every Saturday',
      time: '11:00 AM',
      location: 'Main Sanctuary',
      description: 'Join us for weekly worship, praise, and a message from God\'s Word.',
      recurring: true
    },
    {
      id: 2,
      title: 'Prayer Meeting',
      date: 'Every Wednesday',
      time: '7:00 PM',
      location: 'Fellowship Hall',
      description: 'Mid-week prayer and Bible study for spiritual growth and fellowship.',
      recurring: true
    },
    {
      id: 3,
      title: 'Youth Ministry',
      date: 'First Friday of Every Month',
      time: '6:00 PM',
      location: 'Youth Room',
      description: 'Fun, fellowship, and spiritual growth for our young people.',
      recurring: true
    }
  ]

  return (
    <div className="page-body">
      {/* Hero Section */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Church Events</h1>
              <p className="lead mb-0">
                Stay connected with our church community through our various events and activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-5">
        <div className="container py-4">
          <h2 className="mb-5">Upcoming Events</h2>
          <div className="row g-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-start mb-3">
                      <div className="avatar avatar-md bg-primary-lt me-3">
                        <IconCalendar size={24} />
                      </div>
                      <div className="flex-fill">
                        <h3 className="card-title mb-1">{event.title}</h3>
                        {event.recurring && (
                          <span className="badge bg-primary-lt text-primary">Recurring</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted d-flex align-items-center mb-1">
                        <IconCalendar size={16} className="me-2" />
                        {event.date}
                      </small>
                      <small className="text-muted d-flex align-items-center mb-1">
                        <IconClock size={16} className="me-2" />
                        {event.time}
                      </small>
                      <small className="text-muted d-flex align-items-center">
                        <IconMapPin size={16} className="me-2" />
                        {event.location}
                      </small>
                    </div>

                    <p className="text-muted mb-3">
                      {event.description}
                    </p>

                    <Link to="/visit" className="btn btn-outline-primary btn-sm">
                      Learn More
                      <IconChevronRight size={16} className="ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Events */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <h2 className="mb-4">Special Events</h2>
          <div className="alert alert-info">
            <div className="d-flex">
              <div>
                <IconCalendar size={24} className="me-3" />
              </div>
              <div>
                <h4 className="alert-title">More Events Coming Soon!</h4>
                <div className="text-muted">
                  We're planning exciting events throughout the year. Check back soon for updates on special
                  programs, community outreach, and seasonal celebrations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar CTA */}
      <section className="py-5">
        <div className="container py-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center p-5">
              <h2 className="mb-3">Never Miss an Event</h2>
              <p className="lead mb-4">
                Subscribe to our calendar to get updates on all church events and activities.
              </p>
              <Link to="/contact" className="btn btn-light btn-lg">
                Get Event Updates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
