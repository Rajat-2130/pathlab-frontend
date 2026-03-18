import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchMyBookings } from '../../api'
import PatientLayout from '../../components/layout/PatientLayout'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'
import { formatDate, formatPrice } from '../../utils/helpers'
import { CalendarCheck, FlaskConical, FileText, Clock, ChevronRight, BookOpen } from 'lucide-react'

const PatientDashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, ready: 0 })

  useEffect(() => {
    fetchMyBookings({ limit: 5 }).then(({ data }) => {
      setBookings(data.bookings)
      const all = data.bookings
      setStats({
        total: data.total,
        pending: all.filter((b) => b.status === 'Pending').length,
        ready: all.filter((b) => b.status === 'Report Ready').length,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <PatientLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-teal-600 to-primary-600 rounded-2xl p-6 text-white">
          <h1 className="font-display font-bold text-2xl mb-1">
            Good day, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-teal-100 text-sm">Here's an overview of your health tests.</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-4 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-4 py-2 text-sm font-semibold transition-colors">
            <BookOpen size={15} />
            Book a New Test
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Bookings', value: stats.total, icon: CalendarCheck, color: 'bg-blue-50 text-blue-600' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-50 text-amber-600' },
            { label: 'Reports Ready', value: stats.ready, icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 text-center">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} />
              </div>
              <p className="font-display font-bold text-2xl text-slate-900">{loading ? '–' : value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="font-display font-bold text-slate-900">Recent Bookings</h2>
            <Link to="/dashboard/bookings" className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <FlaskConical size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium mb-3">No bookings yet</p>
              <Link to="/" className="btn-primary btn-sm">Book Your First Test</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {bookings.map((b) => (
                <div key={b._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <FlaskConical size={16} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{b.testId?.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(b.date)} · {formatPrice(b.testId?.price)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile reminder */}
        {!user?.phone && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-amber-900">Complete your profile</p>
              <p className="text-xs text-amber-600 mt-0.5">Add your phone number for booking updates.</p>
            </div>
            <Link to="/dashboard/profile" className="btn-sm text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
              Update
            </Link>
          </div>
        )}
      </div>
    </PatientLayout>
  )
}

export default PatientDashboard
