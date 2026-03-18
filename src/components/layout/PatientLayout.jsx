import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FlaskConical, LayoutDashboard, CalendarCheck,
  FileText, Menu, X, LogOut, ChevronRight, Home, User
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/dashboard/reports', label: 'My Reports', icon: FileText },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

const PatientLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-teal-500 rounded-xl flex items-center justify-center">
            <FlaskConical size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-slate-900 text-base leading-none">PathLab</span>
            <span className="block text-[10px] text-slate-400 font-medium leading-none tracking-wide uppercase">Patient Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors mb-2"
        >
          <Home size={16} />
          Back to Home
        </Link>
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(to, exact)
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon size={17} className={isActive(to, exact) ? 'text-teal-600' : 'text-slate-400'} />
            {label}
            {isActive(to, exact) && <ChevronRight size={14} className="ml-auto text-teal-400" />}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-primary-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 h-14 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-50">
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-slate-900">My Dashboard</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-screen-xl">
          {children}
        </main>
      </div>
    </div>
  )
}

export default PatientLayout
