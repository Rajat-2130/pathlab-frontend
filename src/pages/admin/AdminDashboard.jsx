import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardStats } from '../../api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'
import { formatDate, formatPrice } from '../../utils/helpers'
import {
  Users, CalendarCheck, Clock, FileText, FlaskConical,
  TrendingUp, ChevronRight, AlertCircle
} from 'lucide-react'

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats().then(({ data: d }) => setData(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center py-24"><Spinner size="lg" /></div>
    </AdminLayout>
  )

  const { stats, recentBookings } = data || {}

  const statCards = [
    { label: 'Total Patients', value: stats?.totalPatients, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: "Today's Bookings", value: stats?.todayBookings, icon: CalendarCheck, color: 'bg-teal-50 text-teal-600', border: 'border-teal-100' },
    { label: 'Pending Tests', value: stats?.pendingBookings, icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { label: 'Reports Ready', value: stats?.reportReadyBookings, icon: FileText, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">PathLab Admin Panel Overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, border }) => (
            <div key={label} className={`card p-5 border ${border}`}>
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="font-display font-bold text-2xl text-slate-900">{value ?? '—'}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/admin/tests', label: 'Manage Tests', sub: 'Add, edit or delete tests', icon: FlaskConical, color: 'bg-primary-600' },
            { to: '/admin/bookings', label: 'All Bookings', sub: 'View & update status', icon: CalendarCheck, color: 'bg-teal-600' },
            { to: '/admin/reports', label: 'Upload Reports', sub: 'Upload patient reports', icon: FileText, color: 'bg-purple-600' },
          ].map(({ to, label, sub, icon: Icon, color }) => (
            <Link key={to} to={to} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow group">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="font-display font-bold text-slate-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-primary-600 font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {!recentBookings?.length ? (
            <div className="text-center py-12">
              <FlaskConical size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Test</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900 text-xs">{b.userId?.name}</p>
                        <p className="text-slate-400 text-xs">{b.userId?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <p className="text-slate-700 text-xs font-medium">{b.testId?.name}</p>
                        <p className="text-slate-400 text-xs">{formatPrice(b.testId?.price)}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 hidden md:table-cell">{formatDate(b.date)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alert for pending */}
        {stats?.pendingBookings > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">
                {stats.pendingBookings} booking{stats.pendingBookings > 1 ? 's' : ''} awaiting action
              </p>
              <p className="text-amber-600 text-xs mt-0.5">Update status for pending bookings</p>
            </div>
            <Link to="/admin/bookings?status=Pending" className="text-xs font-semibold text-amber-700 hover:underline">
              Review →
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
