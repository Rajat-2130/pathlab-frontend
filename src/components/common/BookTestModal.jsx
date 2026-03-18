import { useState } from 'react'
import { X, FlaskConical, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react'
import { createBooking } from '../../api'
import { formatPrice, getErrorMessage, getTodayDate, getMaxDate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import Spinner from './Spinner'

const TIME_SLOTS = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
]

const BookTestModal = ({ test, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    date: getTodayDate(),
    timeSlot: '09:00 AM',
    address: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await createBooking({ testId: test._id, ...form })
      setBooked(true)
      setBookingId(data.booking.bookingId)
      toast.success('Booking confirmed!')
      onSuccess?.()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-bold text-slate-900 text-lg">Book Test</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {booked ? (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-xl mb-2">Booking Confirmed!</h3>
            <p className="text-slate-500 text-sm mb-4">Your test has been booked successfully.</p>
            <div className="bg-slate-50 rounded-xl px-5 py-3 mb-6">
              <p className="text-xs text-slate-400 mb-1">Booking ID</p>
              <p className="font-display font-bold text-primary-700 text-lg">{bookingId}</p>
            </div>
            <button onClick={onClose} className="btn-primary w-full">
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Test Info */}
            <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  <FlaskConical size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900">{test.name}</h3>
                  <p className="text-sm text-slate-500">{test.category} · Results in {test.turnaroundTime}</p>
                  <p className="font-bold text-primary-700 mt-1">{formatPrice(test.price)}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Date */}
              <div>
                <label className="label">
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> Preferred Date</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  min={getTodayDate()}
                  max={getMaxDate()}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="label">
                  <span className="flex items-center gap-1.5"><Clock size={13} /> Time Slot</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, timeSlot: slot }))}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        form.timeSlot === slot
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="label">
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> Address (optional)</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Home collection address"
                  className="input"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="label">Special Notes (optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any specific instructions..."
                  className="input resize-none"
                />
              </div>

              <div className="pt-1">
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <><Spinner size="sm" /> Booking...</> : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default BookTestModal
