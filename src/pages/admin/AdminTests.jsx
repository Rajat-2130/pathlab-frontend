import { useState, useEffect, useCallback } from 'react'
import { fetchTests, createTest, updateTest, deleteTest } from '../../api'
import AdminLayout from '../../components/layout/AdminLayout'
import ConfirmModal from '../../components/common/ConfirmModal'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import { formatPrice, getErrorMessage, getCategoryColor } from '../../utils/helpers'
import { Plus, Edit2, Trash2, Search, X, Star, FlaskConical } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Blood Test','Urine Test','Radiology','Cardiology','Pathology','Microbiology','Biochemistry','Immunology','Genetics','Other']

const EMPTY_FORM = { name: '', price: '', description: '', category: 'Blood Test', popular: false, turnaroundTime: '24 hours', preparationRequired: 'No special preparation required', isActive: true }

const AdminTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTest, setEditTest] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (search) params.search = search
      const { data } = await fetchTests(params)
      setTests(data.tests)
      setPages(data.pages)
      setTotal(data.total)
    } catch { } finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { setPage(1) }, [search])
  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditTest(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (t) => { setEditTest(t); setForm({ name: t.name, price: t.price, description: t.description, category: t.category, popular: t.popular, turnaroundTime: t.turnaroundTime, preparationRequired: t.preparationRequired, isActive: t.isActive }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditTest(null); setForm(EMPTY_FORM) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editTest) {
        await updateTest(editTest._id, form)
        toast.success('Test updated')
      } else {
        await createTest(form)
        toast.success('Test created')
      }
      closeModal()
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteTest(deleteId)
      toast.success('Test deleted')
      setDeleteId(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setDeleting(false) }
  }

  const fc = (field, val) => setForm(p => ({ ...p, [field]: val }))

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="page-title">Manage Tests</h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} tests available</p>
          </div>
          <button onClick={openAdd} className="btn-primary shrink-0">
            <Plus size={16} /> Add Test
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tests…" className="input pl-10 pr-9" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : tests.length === 0 ? (
          <div className="card text-center py-14">
            <FlaskConical size={44} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No tests found</p>
            <button onClick={openAdd} className="btn-primary btn-sm mt-4">Add First Test</button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Test</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Popular</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tests.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{t.description}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`badge border ${getCategoryColor(t.category)}`}>{t.category}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{formatPrice(t.price)}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        {t.popular ? (
                          <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                            <Star size={12} fill="currentColor" /> Yes
                          </span>
                        ) : <span className="text-slate-400 text-xs">No</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteId(t._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-slate-900">{editTest ? 'Edit Test' : 'Add New Test'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="label">Test Name *</label>
                <input type="text" value={form.name} onChange={(e) => fc('name', e.target.value)} required className="input" placeholder="e.g. Complete Blood Count (CBC)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => fc('price', e.target.value)} required min="0" className="input" placeholder="299" />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select value={form.category} onChange={(e) => fc('category', e.target.value)} className="input">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea value={form.description} onChange={(e) => fc('description', e.target.value)} required rows={3} className="input resize-none" placeholder="Describe what this test measures…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Turnaround Time</label>
                  <input type="text" value={form.turnaroundTime} onChange={(e) => fc('turnaroundTime', e.target.value)} className="input" placeholder="24 hours" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.popular} onChange={(e) => fc('popular', e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:bg-primary-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                  <span className="text-sm font-semibold text-slate-700">Popular</span>
                </div>
              </div>
              <div>
                <label className="label">Preparation Required</label>
                <input type="text" value={form.preparationRequired} onChange={(e) => fc('preparationRequired', e.target.value)} className="input" placeholder="e.g. Fasting for 8 hours" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <><Spinner size="sm" /> Saving...</> : editTest ? 'Update Test' : 'Create Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Test"
          message="Are you sure you want to delete this test? This will also affect related bookings."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </AdminLayout>
  )
}

export default AdminTests
