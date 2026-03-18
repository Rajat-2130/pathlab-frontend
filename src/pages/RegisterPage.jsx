import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api'
import { getErrorMessage } from '../utils/helpers'
import { FlaskConical, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner'

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', age: '', gender: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (form.password !== form.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }
  setLoading(true)
  try {
    const { confirmPassword, ...payload } = form
    const { data } = await registerUser(payload)
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    setUser(data.user)
    toast.success('Account created successfully!')
    navigate('/dashboard', { replace: true })
  } catch (err) {
    toast.error(getErrorMessage(err))
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-teal-50/20 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
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
          <h1 className="mt-6 font-display font-bold text-2xl text-slate-900">Create account</h1>
          <p className="text-slate-500 text-sm mt-1">Join PathLab for seamless test booking</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="input pl-10" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="label">Email Address *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="input pl-10" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="label">Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters" className="input pl-10 pr-11" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="label">Confirm Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter password" className="input pl-10" />
                </div>
              </div>

              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className="input pl-10" />
                </div>
              </div>

              <div>
                <label className="label">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="25" min="1" max="120" className="input" />
              </div>

              <div className="col-span-2">
                <label className="label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="input">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? <><Spinner size="sm" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
