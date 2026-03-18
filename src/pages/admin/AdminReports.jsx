import { useState, useEffect, useCallback } from 'react'
import { fetchAllBookings, deleteReport } from '../../api'
import API from '../../api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatusBadge from '../../components/common/StatusBadge'
import ConfirmModal from '../../components/common/ConfirmModal'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import { formatDate, formatPrice, getErrorMessage } from '../../utils/helpers'
import { FileText, Trash2, Eye, Search, X, CheckCircle, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminReports = () => {
  const [bookings, setBookings]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [page, setPage]               = useState(1)
  const [pages, setPages]             = useState(1)
  const [total, setTotal]             = useState(0)
  const [search, setSearch]           = useState('')
  const [uploadModal, setUploadModal] = useState(null)
  const [pdfFile, setPdfFile]         = useState(null)
  const [notes, setNotes]             = useState('')
  const [uploading, setUploading]     = useState(false)
  const [deleteId, setDeleteId]       = useState(null)
  const [deleting, setDeleting]       = useState(false)
  const [dragOver, setDragOver]       = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await fetchAllBookings({ page, limit: 15, search })
      setBookings(data.bookings)
      setPages(data.pages)
      setTotal(data.total)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { setPage(1) }, [search])
  useEffect(() => { load() }, [load])

  const openModal = (booking) => {
    setUploadModal(booking)
    setPdfFile(null)
    setNotes('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      toast.error('Please select a PDF file only')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      toast.error('Please drop a PDF file only')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('report', pdfFile)
      formData.append('notes', notes)

      await API.post(`/reports/upload/${uploadModal._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Report uploaded successfully!')
      setUploadModal(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteReport(deleteId)
      toast.success('Report deleted')
      setDeleteId(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="page-title">Reports Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Upload PDF reports for patient bookings
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or booking…"
            className="input pl-10 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Test
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Report
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900 text-xs">{b.userId?.name}</p>
                        <p className="text-slate-400 text-xs font-mono">#{b.bookingId}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <p className="text-slate-700 text-xs font-medium">{b.testId?.name}</p>
                        <p className="text-slate-400 text-xs">{formatPrice(b.testId?.price)}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 hidden md:table-cell">
                        {formatDate(b.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {b.report ? (
                            <>
                              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                <CheckCircle size={12} /> Uploaded
                              </span>
                              
                               <a href={b.report.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                title="View Report">
                             
                                <Eye size={13} />
                                </a>
                              
                              <button
                                onClick={() => setDeleteId(b._id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Report"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => openModal(b)}
                              className="btn-primary btn-sm text-xs"
                            >
                              <Upload size={12} /> Upload PDF
                            </button>
                          )}
                        </div>
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

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-slate-900">Upload PDF Report</h2>
              <button
                onClick={() => setUploadModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Patient Info */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Patient</p>
                  <p className="font-semibold text-slate-800">{uploadModal.userId?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Booking ID</p>
                  <p className="font-semibold text-slate-800">#{uploadModal.bookingId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Test</p>
                  <p className="font-semibold text-slate-800">{uploadModal.testId?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Date</p>
                  <p className="font-semibold text-slate-800">{formatDate(uploadModal.date)}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpload} className="px-6 py-5 space-y-4">

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-primary-400 bg-primary-50'
                    : pdfFile
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                }`}
                onClick={() => document.getElementById('pdfInput').click()}
              >
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {pdfFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-emerald-600" />
                    </div>
                    <p className="font-semibold text-emerald-700 text-sm">{pdfFile.name}</p>
                    <p className="text-emerald-500 text-xs">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPdfFile(null) }}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Upload size={22} className="text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-600 text-sm">
                      Drop PDF here or click to browse
                    </p>
                    <p className="text-slate-400 text-xs">PDF only · Max 10MB</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="label">Notes for Patient (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any remarks about the report..."
                  className="input resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !pdfFile}
                  className="btn-primary flex-1"
                >
                  {uploading ? (
                    <><Spinner size="sm" /> Uploading...</>
                  ) : (
                    <><Upload size={15} /> Upload Report</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmModal
          title="Delete Report"
          message="Are you sure? The patient will no longer be able to access this report."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </AdminLayout>
  )
}

export default AdminReports

