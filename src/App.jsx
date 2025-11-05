import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Visit from './pages/Visit'
import Events from './pages/Events'
import About from './pages/About'
import Contact from './pages/Contact'
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
        <Route path="admin" element={<AdminPortal />} />
        <Route path="admin/media" element={<MediaLibrary />} />
      </Route>
    </Routes>
  )
}

export default App
