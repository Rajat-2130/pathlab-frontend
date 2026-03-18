import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchTests, fetchCategories } from '../api'
import { getErrorMessage } from '../utils/helpers'
import Layout from '../components/layout/Layout'
import TestCard from '../components/common/TestCard'
import BookTestModal from '../components/common/BookTestModal'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import {
  Search, FlaskConical, Star, Shield, Clock, Award,
  X, ChevronRight, Microscope, HeartPulse
} from 'lucide-react'

const CATEGORIES = ['All', 'Blood Test', 'Urine Test', 'Radiology', 'Cardiology', 'Pathology', 'Microbiology', 'Biochemistry', 'Immunology']

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  const [popularTests, setPopularTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedTest, setSelectedTest] = useState(null)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category])

  const loadTests = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (debouncedSearch) params.search = debouncedSearch
      if (category !== 'All') params.category = category
      const { data } = await fetchTests(params)
      setTests(data.tests)
      setPages(data.pages)
      setTotal(data.total)
    } catch (err) {
      console.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, category])

  useEffect(() => {
    loadTests()
  }, [loadTests])

  useEffect(() => {
    fetchTests({ popular: true, limit: 6 }).then(({ data }) => setPopularTests(data.tests)).catch(() => {})
  }, [])

  const handleBook = (test) => {
    if (!user) { navigate('/login'); return }
    setSelectedTest(test)
  }

  const isFiltered = debouncedSearch || category !== 'All'

  return (
    <Layout>
      {/* Watermark */}
<div className="fixed right-2 top-1/2 -translate-y-1/2 rotate-90 origin-right z-50 pointer-events-none">
  <span className="text-xs sm:text-sm text-gray-400 opacity-60 tracking-wider">
    Built by Rajat Singh
  </span>
</div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Microscope size={14} className="text-teal-300" />
              NABL Accredited Diagnostic Centre
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
              Book Lab Tests<br />
              <span className="text-teal-300">From Home</span>
            </h1>
            <p className="text-primary-200 text-lg mb-8 leading-relaxed">
              Accurate diagnostics, fast results, affordable prices. 
              Schedule your test in seconds.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests (e.g. CBC, Thyroid, Vitamin D…)"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: FlaskConical, label: '200+ Tests', sub: 'Available' },
              { icon: Clock, label: '24hr', sub: 'Turnaround' },
              { icon: Shield, label: 'NABL', sub: 'Accredited' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <Icon size={16} className="text-teal-300 mb-1" />
                <span className="font-display font-bold text-white text-base sm:text-lg">{label}</span>
                <span className="text-primary-200 text-xs">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Popular Tests */}
        {!isFiltered && popularTests.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <Star size={20} className="text-amber-500 fill-amber-500" />
                  Popular Tests
                </h2>
                <p className="text-slate-500 text-sm mt-1">Most booked diagnostics</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTests.map((test) => (
                <TestCard key={test._id} test={test} onBook={handleBook} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter + All Tests */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <HeartPulse size={20} className="text-primary-600" />
                {isFiltered ? 'Search Results' : 'All Tests'}
              </h2>
              {!loading && <p className="text-slate-500 text-sm mt-0.5">{total} tests found</p>}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                  category === cat
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-20">
              <FlaskConical size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No tests found matching your search.</p>
              <button onClick={() => { setSearch(''); setCategory('All') }} className="btn-secondary mt-4 btn-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tests.map((test) => (
                  <TestCard key={test._id} test={test} onBook={handleBook} />
                ))}
              </div>
              <Pagination page={page} pages={pages} onPageChange={setPage} />
            </>
          )}
        </section>

        {/* Features */}
        {!isFiltered && (
          <section className="mt-16 mb-4">
            <h2 className="section-title text-center mb-8">Why Choose PathLab?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Shield, title: 'NABL Accredited', desc: 'Certified lab with highest quality standards', color: 'text-primary-600 bg-primary-50' },
                { icon: Clock, title: 'Fast Results', desc: 'Most results delivered within 24 hours', color: 'text-teal-600 bg-teal-50' },
                { icon: Award, title: 'Expert Doctors', desc: 'Reports reviewed by qualified pathologists', color: 'text-amber-600 bg-amber-50' },
                { icon: FlaskConical, title: '200+ Tests', desc: 'Wide range of diagnostic tests available', color: 'text-rose-600 bg-rose-50' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card p-5 text-center hover:shadow-card-hover transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedTest && (
        <BookTestModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onSuccess={() => {
            setSelectedTest(null)
            if (user) navigate('/dashboard/bookings')
          }}
        />
      )}
    </Layout>
  )
}

export default HomePage
