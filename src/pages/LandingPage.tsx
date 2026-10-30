import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  ArrowRight, 
  Smartphone, 
  Lock, 
  Sun, 
  Moon,
  ChevronDown,
  ExternalLink,
  Shield,
  Download
} from 'lucide-react'
import { InstallModal } from '../components/InstallModal'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I log in?',
    answer: 'Enter your college institute code (for example: cev for College of Engineering Vadakara, gcek for Kannur, mace for Kothamangalam) along with your regular ETLab admission number or username and password. The authentication request is made directly to ETLab.'
  },
  {
    question: 'Is my password or student data stored on any server?',
    answer: 'No. ETBridge is a 100% static client-side application. There are no intermediate servers, databases, or tracking proxies. All API requests go directly from your browser to ETLab\'s official API (api.students.etlab.app), and your authentication token is kept only in your browser\'s local storage.'
  },
  {
    question: 'How does the 75% bunk calculation work?',
    answer: 'The calculation uses the standard university attendance target of 75%. If your attendance is currently at or above 75%, it calculates how many classes you can skip without dropping below 75%. If your attendance is below 75%, it calculates how many consecutive hours you must attend to cross the 75% threshold.'
  },
  {
    question: 'How does self-reported duty leave work?',
    answer: 'Faculty often take several days or weeks to enter approved duty leaves into the ETLab portal. ETBridge lets you toggle the specific hours you were on duty (e.g. Hours 4, 5, 6) to project your true attendance and bunk margins. It clearly labels these as self-reported, and automatically reconciles once faculty inputs the official approval.'
  },
  {
    question: 'Which colleges are supported?',
    answer: 'Any university or college that uses ETLab\'s student portal (including CEV, GCEK, MACE, TKMCE, JEC, VJEC, RIT, GECK, and others). You only need your college\'s institute code, which matches the subdomain of your portal (for instance, cev from cev.etlab.app).'
  },
  {
    question: 'Can I install this on my iPhone or Android device?',
    answer: 'Yes. ETBridge is built as a Progressive Web App (PWA). You can add it directly to your home screen via Chrome or Safari. It runs in full screen without browser toolbars, starts instantly, and caches data for offline access.'
  }
]

export const LandingPage: React.FC = () => {
  const { isAuthenticated, loginDemo } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleDemoClick = () => {
    loginDemo()
    navigate('/dashboard')
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 light:bg-slate-50 light:text-slate-900 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">

        {/* Minimal Navigation Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white dark:text-white light:text-slate-900 font-mono">
              ETBridge
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono">
              / documentation & app
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/nimd/etbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 transition-colors font-mono"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-1.5 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 light:bg-slate-900 light:text-white font-medium transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 light:bg-slate-900 light:text-white font-medium transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Title and Summary */}
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 font-mono">
            ETBridge
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
            An open-source, client-side web interface for students using the ETLab portal. Fast, clean, offline-ready, with automated bunk margin calculations and self-reported duty leave tracking.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Sign In with College Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white text-zinc-200 dark:text-zinc-200 light:text-slate-800 hover:bg-zinc-800 text-xs font-semibold transition-all"
            >
              <span>View Demo (CEV Student Data)</span>
            </button>
          </div>
        </section>

        {/* Big Mobile Installation Option */}
        <section className="p-5 sm:p-6 rounded-2xl border-2 border-brand-500/40 bg-brand-950/20 dark:bg-brand-950/20 light:bg-brand-50/50 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-400 dark:text-brand-400 light:text-brand-700 block">
                Mobile Web Application
              </span>
              <h2 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                Install ETBridge on Your Phone
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 leading-relaxed">
                ETBridge is a Progressive Web App (PWA). You can install it directly to your home screen on Android (Chrome/Brave) or iPhone (Safari). It opens fullscreen like a native app, requires zero App Store downloads, and caches your timetable and attendance for offline access in class.
              </p>
            </div>

            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>

          <button
            onClick={() => setShowInstallModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Open Detailed Installation Instructions</span>
          </button>
        </section>

        {/* Why this project was made */}
        <section className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
            Why It Was Made
          </h2>
          <div className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 space-y-3 leading-relaxed">
            <p>
              The official ETLab mobile application is slow, unreliable, and frequently crashes or signs students out. Checking simple attendance records or class routines often requires navigating through multiple menus, waiting through webview delays, and dealing with broken session management.
            </p>
            <p>
              ETBridge was built to provide a clean, instant, and reliable alternative. It connects directly to ETLab's public REST API from your browser, stores your session locally, and gives you instant access to your timetable, internal marks, and safe bunk margins without the bloat.
            </p>
          </div>
        </section>

        {/* What the app does */}
        <section className="space-y-4 pt-2">
          <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
            Core Capabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white space-y-1">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900">
                Attendance & Safe Bunk Margins
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Calculates how many classes you can afford to skip or must attend to maintain the university 75% cutoff for each subject.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white space-y-1">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900">
                Self-Reported Duty Leaves
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Log duty leaves by toggling specific hours of the day (e.g. Hours 4, 5, 6) to project your true attendance before faculty approval.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white space-y-1">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900">
                Live Timetable & Substitutions
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Identifies current ongoing periods based on local time, faculty assignments, and clearly labels class substitutions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white space-y-1">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900">
                Offline Local Storage
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Schedules and marks are cached locally on your device, allowing instant access in lecture halls even without active internet.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
              Security & Privacy Guarantee
            </h2>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200 bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-white space-y-2 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700">
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              <li>
                <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Direct Client-to-API Communication:</strong> All login requests and data fetches travel directly from your browser to ETLab's official REST API endpoint (<code className="font-mono text-xs bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 px-1 py-0.5 rounded">https://api.students.etlab.app</code>).
              </li>
              <li>
                <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">No Intermediary Backend Servers:</strong> There is no proxy server, middleman database, or developer backend recording credentials.
              </li>
              <li>
                <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Local-Only Session Storage:</strong> Your authentication token and pending duty leaves are stored solely on your device's browser <code className="font-mono text-xs bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 px-1 py-0.5 rounded">localStorage</code>.
              </li>
              <li>
                <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Transparent & Open Source:</strong> The full codebase is publicly accessible and auditable on GitHub under the MIT License.
              </li>
            </ul>

            <div className="pt-2 text-xs">
              <a
                href="https://github.com/nimd/etbridge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-400 hover:underline font-mono"
              >
                <span>View Source Code on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-4 pt-2">
          <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
            Frequently Asked Questions
          </h2>

          <div className="border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 divide-y divide-zinc-800 dark:divide-zinc-800 light:divide-slate-200">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-900 hover:text-white transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed pr-6">
                      {faq.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Document Footer */}
        <footer className="pt-8 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono">
          <div>
            Built by Niranjan M D (CEV). Licensed under MIT.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/nimd/etbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setShowInstallModal(true)}
              className="hover:underline"
            >
              Install App
            </button>
          </div>
        </footer>

      </div>

      {/* Install Modal */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </div>
  )
}
