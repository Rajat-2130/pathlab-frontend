const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <div className={`${sizes[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`} />
  )
}

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium text-sm">Loading...</p>
    </div>
  </div>
)

export default Spinner
