import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute'

// Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFound from './pages/NotFound'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientBookings from './pages/patient/PatientBookings'
import PatientReports from './pages/patient/PatientReports'
import PatientProfile from './pages/patient/PatientProfile'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTests from './pages/admin/AdminTests'
import AdminBookings from './pages/admin/AdminBookings'
import AdminReports from './pages/admin/AdminReports'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProfile from './pages/admin/AdminProfile'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              border: '1px solid #f1f5f9',
            },
            success: {
              iconTheme: { primary: '#14b8a6', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* ─── Public ─── */}
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* ─── Patient ─── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute>
                <PatientBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <PatientReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          {/* ─── Admin ─── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests"
            element={
              <ProtectedRoute adminOnly>
                <AdminTests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute adminOnly>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute adminOnly>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* ─── 404 ─── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  )
}

export default App
