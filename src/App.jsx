import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AdminPortal from './pages/admin/AdminPortal'
import MediaLibrary from './pages/admin/MediaLibrary'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<AdminPortal />} />
        <Route path="admin/media" element={<MediaLibrary />} />
      </Route>
    </Routes>
  )
}

export default App
