import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FlaskConical, Menu, X, ChevronDown, User, LogOut,
  LayoutDashboard, Settings, Bell
} from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-teal-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FlaskConical size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 text-lg leading-none">PathLab</span>
              <span className="block text-[10px] text-slate-400 font-medium leading-none tracking-wide uppercase">Diagnostics</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            {user && (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isAdmin ? 'Admin Panel' : 'My Dashboard'}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-1.5 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link
                        to={isAdmin ? '/admin' : '/dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                      </Link>
                      <Link
                        to={isAdmin ? '/admin/profile' : '/dashboard/profile'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <User size={15} />
                        My Profile
                      </Link>
                    </div>
                    <div className="border-t border-slate-50 pt-1 pb-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary btn-sm hidden sm:inline-flex">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          <Link to="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            Home
          </Link>
          {user && (
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {isAdmin ? 'Admin Panel' : 'My Dashboard'}
            </Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                Sign In
              </Link>
              <Link to="/register" className="block px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
