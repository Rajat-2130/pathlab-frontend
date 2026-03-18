import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllBookings, updateBookingStatus } from '../../api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import { formatDate, formatPrice, getErrorMessage } from '../../utils/helpers'
import { Search, X, Calendar, FlaskConical, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['Pending', 'Sample Collected', 'Report Ready', 'Cancelled']
const STATUS_TABS = ['All', ...STATUSES]

const AdminBookings = () => {
  const [searchParams] = useSearchParams()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15, search }
      if (statusFilter !== 'All') params.status = statusFilter
      const { data } = await fetchAllBookings(params)
      setBookings(data.bookings)
      setPages(data.pages)
      setTotal(data.total)
    } catch { } finally { setLoading(false) }
  }, [page, search, statusFilter])

  useEffect(() => { setPage(1) }, [search, statusFilter])
  useEffect(() => { load() }, [load])

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      await updateBookingStatus(id, status)
      toast.success(`Status updated to "${status}"`)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setUpdatingId(null) }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Bookings</h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} total bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient, email, booking ID…" className="input pl-10 pr-9" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {STATUS_TABS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${statusFilter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-14">
            <FlaskConical size={44} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Test</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900 text-xs">{b.userId?.name}</p>
                        <p className="text-slate-400 text-xs">{b.userId?.email}</p>
                        <p className="text-slate-300 text-[10px] font-mono">#{b.bookingId}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <p className="text-slate-700 font-medium text-xs">{b.testId?.name}</p>
                        <p className="text-slate-400 text-xs">{formatPrice(b.testId?.price)}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-slate-600 text-xs">{formatDate(b.date)}</p>
                        <p className="text-slate-400 text-xs">{b.timeSlot}</p>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        {updatingId === b._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <div className="relative">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b._id, e.target.value)}
                              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                            >
                              {STATUSES.map((s) => <option key={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </AdminLayout>
  )
}

export default AdminBookings
