import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null

  const pageNums = []
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
      pageNums.push(i)
    } else if (i === page - 2 || i === page + 2) {
      pageNums.push('...')
    }
  }

  // De-duplicate ellipses
  const deduped = pageNums.filter((v, i, a) => v !== '...' || a[i - 1] !== '...')

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {deduped.map((num, i) =>
        num === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
              num === page
                ? 'bg-primary-600 text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default Pagination
