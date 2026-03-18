import { useState, useEffect, useCallback } from 'react'
import { fetchMyBookings } from '../../api'
import PatientLayout from '../../components/layout/PatientLayout'
import Spinner from '../../components/common/Spinner'
import { formatDate } from '../../utils/helpers'
import { FileText, Download, ExternalLink, FlaskConical, Eye } from 'lucide-react'

const PatientReports = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await fetchMyBookings({ status: 'Report Ready', limit: 50 })
      setBookings(data.bookings.filter((b) => b.report))
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <PatientLayout>
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="page-title">My Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">{bookings.length} report{bookings.length !== 1 ? 's' : ''} available</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-16">
            <FileText size={44} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No reports available yet</p>
            <p className="text-slate-400 text-sm mt-1">Reports will appear here once ready</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <div key={b._id} className="card p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-slate-900 text-sm truncate">{b.testId?.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">#{b.bookingId}</p>
                    <p className="text-xs text-slate-400">Test date: {formatDate(b.date)}</p>
                  </div>
                </div>

                {b.report?.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                    💬 {b.report.notes}
                  </p>
                )}

                <div className="text-xs text-slate-400 mb-4">
                  Report uploaded: {formatDate(b.report?.createdAt)}
                </div>

                <div className="flex gap-2">
                  <a
                    href={b.report?.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary btn-sm text-xs flex-1 justify-center gap-1.5"
                  >
                    <Eye size={13} /> View Report
                  </a>
                  <a
                    href={b.report?.fileUrl}
                    download
                    className="btn-secondary btn-sm text-xs gap-1.5"
                  >
                    <Download size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  )
}

export default PatientReports
