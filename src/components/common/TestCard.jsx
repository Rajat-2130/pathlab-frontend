import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FlaskConical, Clock, Star, ChevronRight, BookOpen } from 'lucide-react'
import { formatPrice, getCategoryColor } from '../../utils/helpers'

const TestCard = ({ test, onBook }) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleBook = () => {
    if (!user) {
      navigate('/login', { state: { from: '/' } })
      return
    }
    onBook?.(test)
  }

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-200 group animate-fade-in flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(test.category)}`}>
          <FlaskConical size={11} />
          {test.category}
        </div>
        {test.popular && (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Star size={11} fill="currentColor" />
            Popular
          </div>
        )}
      </div>

      <h3 className="font-display font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-primary-700 transition-colors">
        {test.name}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-2">
        {test.description}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <Clock size={12} />
        <span>Results in {test.turnaroundTime}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div>
          <span className="text-xl font-display font-bold text-slate-900">{formatPrice(test.price)}</span>
        </div>
        <button
          onClick={handleBook}
          className="btn-primary btn-sm text-xs"
        >
          <BookOpen size={13} />
          Book Now
        </button>
      </div>
    </div>
  )
}

export default TestCard
