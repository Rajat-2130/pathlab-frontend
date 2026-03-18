import { useState, useEffect, useCallback } from 'react'
import { fetchMyBookings, cancelBooking } from '../../api'
import PatientLayout from '../../components/layout/PatientLayout'
import StatusBadge from '../../components/common/StatusBadge'
import Pagination from '../../components/common/Pagination'
import ConfirmModal from '../../components/common/ConfirmModal'
import Spinner from '../../components/common/Spinner'
import { formatDate, formatPrice, getErrorMessage } from '../../utils/helpers'
import { FlaskConical, Calendar, Clock, X, ExternalLink, FileText, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const STATUS_TABS = ['All', 'Pending', 'Sample Collected', 'Report Ready', 'Cancelled']

const PatientBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('All')
  const [cancelId, setCancelId] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (statusFilter !== 'All') params.status = statusFilter
      const { data } = await fetchMyBookings(params)
      setBookings(data.bookings)
      setPages(data.pages)
      setTotal(data.total)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => { setPage(1) }, [statusFilter])
  useEffect(() => { load() }, [load])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await cancelBooking(cancelId)
      toast.success('Booking cancelled')
      setCancelId(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <PatientLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} total bookings</p>
          </div>
          <Link to="/" className="btn-primary btn-sm">+ Book Test</Link>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                statusFilter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-16">
            <FlaskConical size={44} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No bookings found</p>
            <Link to="/" className="btn-primary btn-sm mt-4 inline-flex">Book a Test</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="card p-4 sm:p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <FlaskConical size={18} className="text-primary-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-slate-900">{b.testId?.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">#{b.bookingId}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(b.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{b.timeSlot}</span>
                      <span className="font-semibold text-slate-700">{formatPrice(b.testId?.price)}</span>
                    </div>

                    {b.address && (
                      <p className="text-xs text-slate-400 mt-1 truncate">📍 {b.address}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {b.status === 'Report Ready' && b.report && (
                      <a
                        href={b.report.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary btn-sm text-xs gap-1.5"
                      >
                        <FileText size={13} />
                        Report
                      </a>
                    )}
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => setCancelId(b._id)}
                        className="btn-sm text-xs gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-colors"
                      >
                        <X size={13} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>

      {cancelId && (
        <ConfirmModal
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone."
          onConfirm={handleCancel}
          onCancel={() => setCancelId(null)}
          loading={cancelling}
        />
      )}
    </PatientLayout>
  )
}

export default PatientBookings
