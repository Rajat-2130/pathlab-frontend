import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe, logoutUser } from '../api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await getMe()
      setUser(data.user)
    } catch {
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()

    const handleUnauthorized = () => {
      setUser(null)
      localStorage.removeItem('token')
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () =>
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [fetchUser])

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      // ignore
    } finally {
      setUser(null)
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
    }
  }

  const isAdmin = user?.role === 'admin'
  const isPatient = user?.role === 'patient'

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, logout, isAdmin, isPatient, refetchUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}