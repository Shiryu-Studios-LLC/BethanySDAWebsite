import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Events from './pages/Events'
import Contact from './pages/Contact'
import Login from './pages/Login'
import DynamicPage from './pages/DynamicPage'
import UnifiedAdminPortal from './pages/admin/UnifiedAdminPortal'
import PageEditor from './pages/admin/PageEditor'

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
              <UnifiedAdminPortal />
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

        {/* Dynamic pages - catch-all route (must be last) */}
        <Route path=":slug" element={<DynamicPage />} />
      </Route>
    </Routes>
  )
}

export default App
