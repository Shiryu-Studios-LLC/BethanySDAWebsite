import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Visit from './pages/Visit'
import Events from './pages/Events'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Logout from './pages/Logout'
import AdminPortal from './pages/admin/AdminPortal'
import MediaLibrary from './pages/admin/MediaLibrary'

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
        <Route path="logout" element={<Logout />} />
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
      </Route>
    </Routes>
  )
}

export default App
