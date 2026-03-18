import { AlertTriangle, X } from 'lucide-react'
import Spinner from './Spinner'

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading, danger = true }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-bold text-slate-900">{title || 'Confirm Action'}</h2>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50">
            <X size={17} />
          </button>
        </div>
        <div className="px-6 py-5">
          <div className={`flex items-start gap-3 p-4 rounded-xl mb-5 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
            <AlertTriangle size={20} className={danger ? 'text-red-500 shrink-0 mt-0.5' : 'text-amber-500 shrink-0 mt-0.5'} />
            <p className="text-sm text-slate-600">{message || 'Are you sure you want to proceed?'}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 ${
                danger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {loading ? <Spinner size="sm" /> : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
