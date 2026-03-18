import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const logoutUser = () => API.get('/auth/logout')
export const getMe = () => API.get('/auth/me')
export const updateProfile = (data) => API.put('/auth/profile', data)
export const changePassword = (data) => API.put('/auth/change-password', data)

// ─── Tests ───────────────────────────────────────────────
export const fetchTests = (params) => API.get('/tests', { params })
export const fetchTest = (id) => API.get(`/tests/${id}`)
export const fetchCategories = () => API.get('/tests/categories')
export const createTest = (data) => API.post('/tests', data)
export const updateTest = (id, data) => API.put(`/tests/${id}`, data)
export const deleteTest = (id) => API.delete(`/tests/${id}`)

// ─── Bookings ────────────────────────────────────────────
export const createBooking = (data) => API.post('/bookings', data)
export const fetchMyBookings = (params) => API.get('/bookings/my', { params })
export const fetchAllBookings = (params) => API.get('/bookings', { params })
export const fetchBooking = (id) => API.get(`/bookings/${id}`)
export const updateBookingStatus = (id, status) =>
  API.put(`/bookings/${id}/status`, { status })
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`)
export const fetchBookingStats = () => API.get('/bookings/stats')

// ─── Reports ─────────────────────────────────────────────
export const uploadReport = (bookingId, formData) =>
  API.post(`/reports/upload/${bookingId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const uploadReportUrl = (bookingId, data) =>
  API.post(`/reports/upload/${bookingId}`, data)
export const fetchReport = (bookingId) => API.get(`/reports/${bookingId}`)
export const deleteReport = (bookingId) => API.delete(`/reports/${bookingId}`)

// ─── Users (Admin) ───────────────────────────────────────
export const fetchUsers = (params) => API.get('/users', { params })
export const fetchUser = (id) => API.get(`/users/${id}`)
export const updateUserRole = (id, role) =>
  API.put(`/users/${id}/role`, { role })
export const deleteUser = (id) => API.delete(`/users/${id}`)
export const fetchDashboardStats = () => API.get('/users/dashboard-stats')

export default API