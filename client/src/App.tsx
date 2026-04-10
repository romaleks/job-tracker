import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Jobs from '@/pages/Jobs'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
