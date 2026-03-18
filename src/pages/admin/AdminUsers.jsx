import { useState, useEffect, useCallback } from 'react'
import { fetchUsers, updateUserRole, deleteUser } from '../../api'
import AdminLayout from '../../components/layout/AdminLayout'
import ConfirmModal from '../../components/common/ConfirmModal'
import Pagination from '../../components/common/Pagination'
import Spinner from '../../components/common/Spinner'
import { formatDateTime, getErrorMessage } from '../../utils/helpers'
import { Search, X, Trash2, ShieldCheck, User, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15, search }
      if (roleFilter !== 'All') params.role = roleFilter
      const { data } = await fetchUsers(params)
      setUsers(data.users)
      setPages(data.pages)
      setTotal(data.total)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  useEffect(() => { setPage(1) }, [search, roleFilter])
  useEffect(() => { load() }, [load])

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id)
    try {
      await updateUserRole(id, role)
      toast.success(`Role updated to "${role}"`)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteUser(deleteId)
      toast.success('User deleted')
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
          <h1 className="page-title">Users</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} registered users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="input pl-10 pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {['All', 'patient', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                  roleFilter === r
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="card text-center py-14">
            <User size={44} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No users found</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Phone / Age</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                            u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : 'bg-gradient-to-br from-teal-500 to-primary-500'
                          }`}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">{u.name}</p>
                            <p className="text-slate-400 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-slate-600 text-xs">{u.phone || '—'}</p>
                        <p className="text-slate-400 text-xs">{u.age ? `${u.age} yrs` : '—'} {u.gender ? `· ${u.gender}` : ''}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 hidden lg:table-cell">
                        {formatDateTime(u.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-teal-100 text-teal-700 border border-teal-200'}`}>
                          {u.role === 'admin' ? <ShieldCheck size={11} /> : <User size={11} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {updatingId === u._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <div className="relative">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                              >
                                <option value="patient">patient</option>
                                <option value="admin">admin</option>
                              </select>
                              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          )}
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => setDeleteId(u._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
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

      {deleteId && (
        <ConfirmModal
          title="Delete User"
          message="Are you sure you want to delete this user? All their bookings will remain in the system."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </AdminLayout>
  )
}

export default AdminUsers
