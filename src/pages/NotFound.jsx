import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FlaskConical, Home } from 'lucide-react'

const NotFound = () => {
  const { user, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FlaskConical size={36} className="text-primary-500" />
        </div>
        <h1 className="font-display font-bold text-7xl text-slate-200 mb-2">404</h1>
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          {user && (
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="btn-secondary"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotFound
