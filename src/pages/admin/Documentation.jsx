import { useState } from 'react'
import { IconBook, IconPhoto, IconFile, IconCalendar, IconMicrophone, IconFileText, IconSettings, IconEdit, IconCode } from '@tabler/icons-react'

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview', icon: IconBook },
    { id: 'media', title: 'Media Library', icon: IconPhoto },
    { id: 'pages', title: 'Page Editor', icon: IconEdit },
    { id: 'events', title: 'Events', icon: IconCalendar },
    { id: 'sermons', title: 'Sermons', icon: IconMicrophone },
    { id: 'bulletins', title: 'Bulletins', icon: IconFileText },
    { id: 'settings', title: 'Site Settings', icon: IconSettings },
    { id: 'technical', title: 'Technical Info', icon: IconCode }
  ]

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Documentation</h2>
              <div className="text-muted">Complete guide to managing your church website</div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {/* Sidebar Navigation */}
          <div className="col-md-3">
            <div className="card sticky-top" style={{ top: '1rem' }}>
              <div className="list-group list-group-flush">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center ${
                        activeSection === section.id ? 'active' : ''
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon size={18} className="me-2" />
                      {section.title}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Documentation Content */}
          <div className="col-md-9">
            <div className="card">
              <div className="card-body">
                {activeSection === 'overview' && <OverviewSection />}
                {activeSection === 'media' && <MediaLibrarySection />}
                {activeSection === 'pages' && <PageEditorSection />}
                {activeSection === 'events' && <EventsSection />}
                {activeSection === 'sermons' && <SermonsSection />}
                {activeSection === 'bulletins' && <BulletinsSection />}
                {activeSection === 'settings' && <SettingsSection />}
                {activeSection === 'technical' && <TechnicalSection />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewSection() {
  return (
    <div>
      <h2>Welcome to the Admin Portal</h2>
      <p className="lead">Your complete content management system for Bethany SDA Church website.</p>

      <h3 className="mt-4">What You Can Do</h3>
      <ul>
        <li><strong>Media Library:</strong> Upload and manage images, videos, and documents</li>
        <li><strong>Page Editor:</strong> Create and edit custom pages with a visual block editor</li>
        <li><strong>Events:</strong> Manage church events and special programs</li>
        <li><strong>Sermons:</strong> Upload and organize sermon recordings</li>
        <li><strong>Bulletins:</strong> Share weekly bulletins and newsletters</li>
        <li><strong>Site Settings:</strong> Configure church information and contact details</li>
      </ul>

      <h3 className="mt-4">Getting Started</h3>
      <ol>
        <li>Start by uploading media files you'll need (logos, photos, videos)</li>
        <li>Create or edit pages using the Page Editor</li>
        <li>Add upcoming events to the calendar</li>
        <li>Upload sermons and bulletins regularly</li>
        <li>Update site settings with current church information</li>
      </ol>

      <div className="alert alert-info mt-4">
        <h4 className="alert-heading">Multi-Language Support</h4>
        <p className="mb-0">The website automatically supports multiple languages (English, Haitian Creole, French, Spanish, Portuguese) using the language switcher in the footer.</p>
      </div>
    </div>
  )
}

function MediaLibrarySection() {
  return (
    <div>
      <h2>Media Library Guide</h2>
      <p className="lead">Upload and manage all media files for your website.</p>

      <h3 className="mt-4">Uploading Files</h3>
      <ol>
        <li>Navigate to <strong>Media Library</strong> from the Admin Portal</li>
        <li>Select a folder category (Images, Videos, Documents, Audio, Logos, or Banners)</li>
        <li>Click <strong>"Choose Files"</strong> or drag and drop files into the upload area</li>
        <li>Wait for the upload to complete</li>
      </ol>

      <h3 className="mt-4">Supported File Types</h3>
      <div className="row mt-3">
        <div className="col-md-6">
          <h4>Images</h4>
          <ul>
            <li>JPG/JPEG</li>
            <li>PNG</li>
            <li>GIF</li>
            <li>WebP</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Videos</h4>
          <ul>
            <li>MP4</li>
            <li>WebM</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Documents</h4>
          <ul>
            <li>PDF</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Audio</h4>
          <ul>
            <li>MP3</li>
            <li>WAV</li>
          </ul>
        </div>
      </div>

      <div className="alert alert-warning mt-4">
        <strong>File Size Limit:</strong> Maximum 50MB per file
      </div>

      <h3 className="mt-4">Using Media in Pages</h3>
      <ol>
        <li>Upload your file to the Media Library</li>
        <li>Click the <strong>"Copy URL"</strong> button under the file</li>
        <li>Go to the Page Editor and add an Image, Video, Gallery, or Hero block</li>
        <li>Paste the URL into the appropriate field in the Inspector Panel</li>
      </ol>

      <h3 className="mt-4">Organizing Files</h3>
      <p>Files are organized into folders:</p>
      <ul>
        <li><strong>Images:</strong> General website photos</li>
        <li><strong>Videos:</strong> Video content</li>
        <li><strong>Documents:</strong> PDFs and other documents</li>
        <li><strong>Audio:</strong> Music and audio recordings</li>
        <li><strong>Logos:</strong> Church logos and branding</li>
        <li><strong>Banners:</strong> Header and banner images</li>
      </ul>

      <h3 className="mt-4">Deleting Files</h3>
      <p>Click the <strong>"Delete"</strong> button under any file to remove it. Be careful - this cannot be undone!</p>
    </div>
  )
}

function PageEditorSection() {
  return (
    <div>
      <h2>Page Editor Guide</h2>
      <p className="lead">Create and edit custom pages with a visual block editor.</p>

      <h3 className="mt-4">Understanding the Interface</h3>
      <p>The Page Editor uses a Unity-style three-panel layout:</p>
      <ul>
        <li><strong>Left Panel (Block Library):</strong> Drag blocks from here onto your page</li>
        <li><strong>Center Panel (Canvas):</strong> Preview and arrange your page content</li>
        <li><strong>Right Panel (Inspector):</strong> Edit properties of selected blocks</li>
      </ul>

      <h3 className="mt-4">Creating a New Page</h3>
      <ol>
        <li>Go to <strong>Pages</strong> from the Admin Portal</li>
        <li>Click <strong>"Create New Page"</strong></li>
        <li>Enter a page title and URL slug</li>
        <li>Start adding blocks from the Block Library</li>
        <li>Click <strong>"Save Page"</strong> when done</li>
      </ol>

      <h3 className="mt-4">Available Block Types</h3>
      <div className="row">
        <div className="col-md-6">
          <h4>Content Blocks</h4>
          <ul>
            <li><strong>Heading:</strong> Titles and section headers</li>
            <li><strong>Text:</strong> Paragraphs with rich text editing</li>
            <li><strong>Image:</strong> Single image with caption</li>
            <li><strong>Gallery:</strong> Multi-image grid (1-3 columns)</li>
            <li><strong>Video:</strong> YouTube video embeds</li>
            <li><strong>Button:</strong> Call-to-action buttons</li>
            <li><strong>Divider:</strong> Section separators</li>
            <li><strong>Spacer:</strong> Add vertical spacing</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Layout Blocks</h4>
          <ul>
            <li><strong>Hero Section:</strong> Full-width header with image/video background</li>
            <li><strong>Container:</strong> Boxed content area</li>
            <li><strong>Columns:</strong> Multi-column layouts (2-4 columns)</li>
            <li><strong>Card:</strong> Content card with image and text</li>
            <li><strong>Feature:</strong> Icon/image with title and description</li>
            <li><strong>Testimonial:</strong> Quote with author</li>
            <li><strong>Stats:</strong> Number displays with labels</li>
            <li><strong>Timeline:</strong> Event timeline display</li>
          </ul>
        </div>
      </div>

      <h3 className="mt-4">Editing Blocks</h3>
      <ol>
        <li>Click on a block in the canvas to select it</li>
        <li>The Inspector Panel on the right will show editable properties</li>
        <li>For text blocks, you can click directly on the text to edit inline</li>
        <li>Use the toolbar at the top of each block to:
          <ul>
            <li>Duplicate the block</li>
            <li>Move it up or down</li>
            <li>Delete the block</li>
          </ul>
        </li>
      </ol>

      <h3 className="mt-4">Using Media in Blocks</h3>
      <p>To add images or videos:</p>
      <ol>
        <li>First upload the media to the Media Library</li>
        <li>Copy the media URL</li>
        <li>In the Page Editor, add an Image, Gallery, Video, or Hero block</li>
        <li>Select the block and paste the URL in the Inspector Panel</li>
      </ol>

      <div className="alert alert-info mt-4">
        <h4 className="alert-heading">Pro Tip</h4>
        <p className="mb-0">Use Hero Sections for page headers, Features for highlighting church ministries, and Cards for displaying events or programs.</p>
      </div>

      <h3 className="mt-4">Publishing Pages</h3>
      <ol>
        <li>Click <strong>"Save Page"</strong> to save your changes</li>
        <li>Pages are immediately visible at their URL slug (e.g., /your-page-name)</li>
        <li>You can edit pages anytime by going to Pages and clicking <strong>"Edit"</strong></li>
      </ol>
    </div>
  )
}

function EventsSection() {
  return (
    <div>
      <h2>Events Management</h2>
      <p className="lead">Create and manage church events, services, and special programs.</p>

      <h3 className="mt-4">Creating Events</h3>
      <ol>
        <li>Navigate to <strong>Events</strong> from the Admin Portal</li>
        <li>Click <strong>"Add Event"</strong></li>
        <li>Fill in event details:
          <ul>
            <li>Event name</li>
            <li>Date and time</li>
            <li>Location</li>
            <li>Description</li>
            <li>Category (Service, Meeting, Social, etc.)</li>
          </ul>
        </li>
        <li>Click <strong>"Save"</strong></li>
      </ol>

      <h3 className="mt-4">Event Categories</h3>
      <ul>
        <li><strong>Worship Service:</strong> Regular church services</li>
        <li><strong>Bible Study:</strong> Study groups and classes</li>
        <li><strong>Prayer Meeting:</strong> Prayer gatherings</li>
        <li><strong>Social:</strong> Fellowship events</li>
        <li><strong>Youth:</strong> Youth programs</li>
        <li><strong>Community:</strong> Community outreach</li>
        <li><strong>Special:</strong> Special events and programs</li>
      </ul>

      <h3 className="mt-4">Managing Events</h3>
      <ul>
        <li><strong>Edit:</strong> Click the edit button to modify event details</li>
        <li><strong>Delete:</strong> Remove past or cancelled events</li>
        <li><strong>Recurring Events:</strong> Mark events as recurring for weekly services</li>
      </ul>

      <div className="alert alert-info mt-4">
        <h4 className="alert-heading">Best Practice</h4>
        <p className="mb-0">Keep the events calendar updated regularly. Remove past events and add upcoming ones to keep the calendar relevant.</p>
      </div>
    </div>
  )
}

function SermonsSection() {
  return (
    <div>
      <h2>Sermons Management</h2>
      <p className="lead">Upload and organize sermon recordings.</p>

      <h3 className="mt-4">Uploading Sermons</h3>
      <ol>
        <li>Navigate to <strong>Sermons</strong> from the Admin Portal</li>
        <li>Click <strong>"Upload Sermon"</strong></li>
        <li>Fill in sermon details:
          <ul>
            <li>Title</li>
            <li>Speaker/Pastor name</li>
            <li>Date preached</li>
            <li>Scripture reference</li>
            <li>Series (if applicable)</li>
          </ul>
        </li>
        <li>Upload audio or video file (or paste YouTube URL)</li>
        <li>Click <strong>"Save"</strong></li>
      </ol>

      <h3 className="mt-4">Sermon Organization</h3>
      <ul>
        <li><strong>Series:</strong> Group related sermons together</li>
        <li><strong>Topics:</strong> Tag sermons by topic for easy searching</li>
        <li><strong>Speakers:</strong> Filter by pastor or guest speaker</li>
      </ul>

      <h3 className="mt-4">Audio vs Video</h3>
      <p>You can upload sermons in multiple formats:</p>
      <ul>
        <li><strong>Audio Only:</strong> Upload MP3 files to the Media Library</li>
        <li><strong>Video:</strong> Upload MP4 files or paste YouTube URLs</li>
        <li><strong>Both:</strong> Provide both audio and video options</li>
      </ul>

      <div className="alert alert-warning mt-4">
        <strong>File Size:</strong> For large video files, consider uploading to YouTube first, then paste the URL. This saves storage space and provides better streaming.
      </div>
    </div>
  )
}

function BulletinsSection() {
  return (
    <div>
      <h2>Bulletins Management</h2>
      <p className="lead">Upload weekly bulletins, newsletters, and announcements.</p>

      <h3 className="mt-4">Uploading Bulletins</h3>
      <ol>
        <li>Navigate to <strong>Bulletins</strong> from the Admin Portal</li>
        <li>Click <strong>"Upload Bulletin"</strong></li>
        <li>Select the PDF file from your computer</li>
        <li>Enter the bulletin date</li>
        <li>Add a title (e.g., "Weekly Bulletin - January 15, 2025")</li>
        <li>Click <strong>"Upload"</strong></li>
      </ol>

      <h3 className="mt-4">Best Practices</h3>
      <ul>
        <li>Upload bulletins as PDF files for best compatibility</li>
        <li>Use consistent naming: "Bulletin - [Date]"</li>
        <li>Upload bulletins weekly, preferably before the service</li>
        <li>Archive old bulletins after a few months</li>
      </ul>

      <h3 className="mt-4">Managing Bulletins</h3>
      <ul>
        <li><strong>View:</strong> Click to preview the PDF</li>
        <li><strong>Download:</strong> Download a copy</li>
        <li><strong>Delete:</strong> Remove old bulletins</li>
      </ul>
    </div>
  )
}

function SettingsSection() {
  return (
    <div>
      <h2>Site Settings</h2>
      <p className="lead">Configure church information and contact details.</p>

      <h3 className="mt-4">Church Information</h3>
      <p>Update basic church information:</p>
      <ul>
        <li>Church name</li>
        <li>Tagline or mission statement</li>
        <li>Physical address</li>
        <li>Phone number</li>
        <li>Email address</li>
      </ul>

      <h3 className="mt-4">Service Times</h3>
      <p>Configure regular service schedules:</p>
      <ul>
        <li>Sabbath School time</li>
        <li>Worship Service time</li>
        <li>Prayer Meeting time</li>
        <li>Other regular meetings</li>
      </ul>

      <h3 className="mt-4">Social Media</h3>
      <p>Add links to your social media profiles:</p>
      <ul>
        <li>Facebook</li>
        <li>YouTube</li>
        <li>Instagram</li>
        <li>Twitter/X</li>
      </ul>

      <h3 className="mt-4">Contact Form</h3>
      <p>Configure where contact form submissions are sent:</p>
      <ul>
        <li>Primary contact email</li>
        <li>CC additional addresses</li>
      </ul>

      <div className="alert alert-info mt-4">
        <h4 className="alert-heading">Keep Information Current</h4>
        <p className="mb-0">Review site settings regularly to ensure contact information and service times are accurate.</p>
      </div>
    </div>
  )
}

function TechnicalSection() {
  return (
    <div>
      <h2>Technical Information</h2>
      <p className="lead">Technical details about your website infrastructure.</p>

      <h3 className="mt-4">Technology Stack</h3>
      <ul>
        <li><strong>Frontend:</strong> React with Vite</li>
        <li><strong>Hosting:</strong> Cloudflare Pages</li>
        <li><strong>Database:</strong> Cloudflare D1 (SQLite)</li>
        <li><strong>Media Storage:</strong> Cloudflare R2 (S3-compatible)</li>
        <li><strong>Authentication:</strong> Cloudflare Access</li>
        <li><strong>UI Framework:</strong> Tabler with Bootstrap 5</li>
      </ul>

      <h3 className="mt-4">Media Storage (R2)</h3>
      <p>All uploaded media is stored in Cloudflare R2:</p>
      <ul>
        <li><strong>Bucket Name:</strong> bethany-sda-media</li>
        <li><strong>Public URL:</strong> https://pub-fc5bfa77df6042a081860f61dded7bb3.r2.dev</li>
        <li><strong>Folders:</strong> Images, Videos, Documents, Audio, Logos, Banners</li>
      </ul>

      <h3 className="mt-4">Database (D1)</h3>
      <p>Content is stored in a Cloudflare D1 database:</p>
      <ul>
        <li><strong>Database Name:</strong> bethany-sda-db</li>
        <li><strong>Tables:</strong> pages, events, sermons, bulletins, settings</li>
      </ul>

      <h3 className="mt-4">Deployment</h3>
      <p>The site is deployed using Cloudflare Pages:</p>
      <ul>
        <li><strong>Build Command:</strong> npm run build</li>
        <li><strong>Output Directory:</strong> dist</li>
        <li><strong>Auto-Deploy:</strong> Pushes to main branch trigger deployments</li>
      </ul>

      <h3 className="mt-4">Multi-Language Support</h3>
      <p>Powered by Google Translate Widget:</p>
      <ul>
        <li><strong>Default Language:</strong> English</li>
        <li><strong>Supported Languages:</strong> Haitian Creole, French, Spanish, Portuguese</li>
        <li><strong>Location:</strong> Footer on all pages</li>
      </ul>

      <h3 className="mt-4">Security</h3>
      <ul>
        <li><strong>Admin Access:</strong> Protected by Cloudflare Access</li>
        <li><strong>Authentication:</strong> Email-based login</li>
        <li><strong>API Routes:</strong> /api/* protected endpoints</li>
        <li><strong>HTTPS:</strong> All traffic encrypted</li>
      </ul>

      <div className="alert alert-success mt-4">
        <h4 className="alert-heading">Performance</h4>
        <p className="mb-0">Built on Cloudflare's global network for fast, reliable access worldwide. Media is cached at edge locations for optimal loading speed.</p>
      </div>

      <h3 className="mt-4">API Endpoints</h3>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Method</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/api/upload</td>
              <td>POST</td>
              <td>Upload files to R2</td>
            </tr>
            <tr>
              <td>/api/media</td>
              <td>GET</td>
              <td>List all media files</td>
            </tr>
            <tr>
              <td>/api/media</td>
              <td>DELETE</td>
              <td>Delete media file</td>
            </tr>
            <tr>
              <td>/api/pages</td>
              <td>GET/POST/PUT/DELETE</td>
              <td>Manage pages</td>
            </tr>
            <tr>
              <td>/api/events</td>
              <td>GET/POST/PUT/DELETE</td>
              <td>Manage events</td>
            </tr>
            <tr>
              <td>/api/sermons</td>
              <td>GET/POST/PUT/DELETE</td>
              <td>Manage sermons</td>
            </tr>
            <tr>
              <td>/api/bulletins</td>
              <td>GET/POST/DELETE</td>
              <td>Manage bulletins</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
