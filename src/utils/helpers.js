export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending': return 'badge badge-pending'
    case 'Sample Collected': return 'badge badge-collected'
    case 'Report Ready': return 'badge badge-ready'
    case 'Cancelled': return 'badge badge-cancelled'
    default: return 'badge bg-slate-100 text-slate-600'
  }
}

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return '⏳'
    case 'Sample Collected': return '🧪'
    case 'Report Ready': return '✅'
    case 'Cancelled': return '❌'
    default: return '•'
  }
}

export const getCategoryColor = (category) => {
  const colors = {
    'Blood Test': 'bg-red-50 text-red-700 border-red-100',
    'Urine Test': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'Radiology': 'bg-purple-50 text-purple-700 border-purple-100',
    'Cardiology': 'bg-pink-50 text-pink-700 border-pink-100',
    'Pathology': 'bg-blue-50 text-blue-700 border-blue-100',
    'Microbiology': 'bg-green-50 text-green-700 border-green-100',
    'Biochemistry': 'bg-orange-50 text-orange-700 border-orange-100',
    'Immunology': 'bg-teal-50 text-teal-700 border-teal-100',
    'Genetics': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Other': 'bg-slate-50 text-slate-700 border-slate-100',
  }
  return colors[category] || colors['Other']
}

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong'
}

export const getTodayDate = () => {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  return today.toISOString().split('T')[0]
}

export const getMaxDate = () => {
  const max = new Date()
  max.setDate(max.getDate() + 30)
  return max.toISOString().split('T')[0]
}
