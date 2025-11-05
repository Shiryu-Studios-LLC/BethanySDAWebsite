import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Visit from './pages/Visit'
import Events from './pages/Events'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminPortal from './pages/admin/AdminPortal'
import MediaLibrary from './pages/admin/MediaLibrary'
import Sermons from './pages/admin/Sermons'
import Bulletins from './pages/admin/Bulletins'
import AdminEvents from './pages/admin/AdminEvents'
import SiteSettings from './pages/admin/SiteSettings'
import Pages from './pages/admin/Pages'
import Homepage from './pages/admin/Homepage'
import VisitPageSettings from './pages/admin/VisitPageSettings'
import AboutPageSettings from './pages/admin/AboutPageSettings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="visit" element={<Visit />} />
        <Route path="events" element={<Events />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
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
          path="admin/homepage"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/visit-page"
          element={
            <ProtectedRoute>
              <VisitPageSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/about-page"
          element={
            <ProtectedRoute>
              <AboutPageSettings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
