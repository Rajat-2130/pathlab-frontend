import { Link } from 'react-router-dom'
import { FlaskConical, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center">
                <FlaskConical size={18} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg leading-none">PathLab</span>
                <span className="block text-[10px] text-slate-400 font-medium leading-none tracking-wide uppercase">Diagnostics</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trusted diagnostic services with accurate results and fast turnaround times.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/login', 'Patient Login'], ['/register', 'Register']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {['Blood Tests', 'Urine Analysis', 'Radiology', 'Cardiology', 'Microbiology'].map((s) => (
                <li key={s}>
                  <span className="text-sm text-slate-400">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={14} className="mt-0.5 shrink-0 text-teal-400" />
                123 Medical Plaza, Health City, India - 110001
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone size={14} className="shrink-0 text-teal-400" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail size={14} className="shrink-0 text-teal-400" />
                support@pathlab.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} PathLab Diagnostics. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with ❤️ for better healthcare</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
