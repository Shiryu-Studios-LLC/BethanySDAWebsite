import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Events from './pages/Events'
import Contact from './pages/Contact'
import Login from './pages/Login'
import DynamicPage from './pages/DynamicPage'
import AdminPortal from './pages/admin/AdminPortal'
import MediaLibrary from './pages/admin/MediaLibrary'
import Sermons from './pages/admin/Sermons'
import Bulletins from './pages/admin/Bulletins'
import AdminEvents from './pages/admin/AdminEvents'
import SiteSettings from './pages/admin/SiteSettings'
import Pages from './pages/admin/Pages'
import PageEditor from './pages/admin/PageEditor'
import Documentation from './pages/admin/Documentation'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Core pages using visual builder */}
        <Route index element={<DynamicPage fixedSlug="home" />} />
        <Route path="visit" element={<DynamicPage fixedSlug="visit" />} />
        <Route path="about" element={<DynamicPage fixedSlug="about" />} />

        {/* Other static pages */}
        <Route path="events" element={<Events />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/media"
          element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/sermons"
          element={
            <ProtectedRoute>
              <Sermons />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/bulletins"
          element={
            <ProtectedRoute>
              <Bulletins />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/events"
          element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedRoute>
              <SiteSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/pages"
          element={
            <ProtectedRoute>
              <Pages />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/page-editor/:slug"
          element={
            <ProtectedRoute>
              <PageEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/documentation"
          element={
            <ProtectedRoute>
              <Documentation />
            </ProtectedRoute>
          }
        />

        {/* Dynamic pages - catch-all route (must be last) */}
        <Route path=":slug" element={<DynamicPage />} />
      </Route>
    </Routes>
  )
}

export default App
