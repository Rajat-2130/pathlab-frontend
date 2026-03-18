import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile, changePassword } from '../../api'
import AdminLayout from '../../components/layout/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { getErrorMessage } from '../../utils/helpers'
import { User, Lock, Save, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminProfile = () => {
  const { user, refetchUser } = useAuth()
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      await updateProfile(profileForm)
      await refetchUser()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePassSubmit = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setPassLoading(true)
    try {
      await changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      })
      toast.success('Password changed successfully')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="page-title">Admin Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your admin account</p>
        </div>

        {/* Avatar card */}
        <div className="card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-bold text-slate-900 text-lg">{user?.name}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              <ShieldCheck size={11} /> Administrator
            </span>
          </div>
        </div>

        {/* Profile form */}
        <div className="card p-5 sm:p-6">
          <h2 className="font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
            <User size={17} className="text-primary-600" />
            Personal Information
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="input opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="9876543210"
                className="input"
              />
            </div>
            <button type="submit" disabled={profileLoading} className="btn-primary">
              {profileLoading ? (
                <><Spinner size="sm" /> Saving...</>
              ) : (
                <><Save size={15} /> Save Changes</>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-5 sm:p-6">
          <h2 className="font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Lock size={17} className="text-primary-600" />
            Change Password
          </h2>
          <form onSubmit={handlePassSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  className="input pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                value={passForm.newPassword}
                onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="input"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="input"
                required
              />
            </div>
            <button type="submit" disabled={passLoading} className="btn-primary">
              {passLoading ? (
                <><Spinner size="sm" /> Updating...</>
              ) : (
                <><Lock size={15} /> Update Password</>
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile
