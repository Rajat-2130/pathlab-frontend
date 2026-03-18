import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile, changePassword } from '../../api'
import PatientLayout from '../../components/layout/PatientLayout'
import Spinner from '../../components/common/Spinner'
import { getErrorMessage } from '../../utils/helpers'
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const PatientProfile = () => {
  const { user, refetchUser } = useAuth()
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    age: user?.age || '', gender: user?.gender || '',
  })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      await updateProfile(profileForm)
      await refetchUser()
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePassSubmit = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setPassLoading(true)
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
      toast.success('Password changed successfully')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <PatientLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your account details</p>
        </div>

        {/* Avatar */}
        <div className="card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-primary-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-bold text-slate-900 text-lg">{user?.name}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">Patient</span>
          </div>
        </div>

        {/* Profile form */}
        <div className="card p-5 sm:p-6">
          <h2 className="font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
            <User size={17} className="text-primary-600" /> Personal Information
          </h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full Name</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} className="input" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Email</label>
                <input type="email" value={user?.email} disabled className="input opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="input" placeholder="9876543210" />
              </div>
              <div>
                <label className="label">Age</label>
                <input type="number" value={profileForm.age} onChange={(e) => setProfileForm(p => ({ ...p, age: e.target.value }))} className="input" min="1" max="120" />
              </div>
              <div>
                <label className="label">Gender</label>
                <select value={profileForm.gender} onChange={(e) => setProfileForm(p => ({ ...p, gender: e.target.value }))} className="input">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={profileLoading} className="btn-primary">
              {profileLoading ? <><Spinner size="sm" /> Saving...</> : <><Save size={15} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-5 sm:p-6">
          <h2 className="font-display font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Lock size={17} className="text-primary-600" /> Change Password
          </h2>
          <form onSubmit={handlePassSubmit} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={passForm.currentPassword} onChange={(e) => setPassForm(p => ({ ...p, currentPassword: e.target.value }))} className="input pr-11" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" value={passForm.newPassword} onChange={(e) => setPassForm(p => ({ ...p, newPassword: e.target.value }))} className="input" minLength={6} required />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" value={passForm.confirmPassword} onChange={(e) => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input" required />
            </div>
            <button type="submit" disabled={passLoading} className="btn-primary">
              {passLoading ? <><Spinner size="sm" /> Updating...</> : <><Lock size={15} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </PatientLayout>
  )
}

export default PatientProfile
