import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api'
import { getErrorMessage } from '../utils/helpers'
import { FlaskConical, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || null

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    const { data } = await loginUser(form)
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
    if (from) return navigate(from, { replace: true })
    navigate(data.user.role === 'admin' ? '/admin' : '/dashboard', {
      replace: true,
    })
  } catch (err) {
    toast.error(getErrorMessage(err))
  } finally {
    setLoading(false)
  }
}

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-teal-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FlaskConical size={22} className="text-white" />
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-slate-900 text-xl leading-none block">PathLab</span>
              <span className="text-[10px] text-slate-400 font-medium leading-none tracking-wide uppercase">Diagnostics</span>
            </div>
          </Link>
          <h1 className="mt-6 font-display font-bold text-2xl text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
