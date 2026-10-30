import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  Download,
  TrendingUp,
  Clock,
  Sparkles,
  Database,
  Heart,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react'
import { InstallModal } from '../components/InstallModal'
import { ETBridgeLogo } from '../components/ETBridgeLogo'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I log in?',
    answer: 'Enter your college institute code (for example: gcek for Kannur, mace for Kothamangalam, rit for Kottayam, tkmce for Kollam) along with your regular ETLab admission number or username and password. The authentication request is made directly to ETLab.'
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
    answer: 'Any university or college that uses ETLab\'s student portal (including GCEK, MACE, TKMCE, JEC, VJEC, RIT, GECK, and others). You only need your college\'s institute code, which matches the subdomain of your portal (for instance, gcek from gcek.etlab.app).'
  },
  {
    question: 'Can I install this on my iPhone or Android device?',
    answer: 'Yes. ETBridge is built as a Progressive Web App (PWA). You can add it directly to your home screen via Chrome or Safari. It runs in full screen without browser toolbars, starts instantly, and caches data for offline access.'
  }
]

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index))
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 light:bg-slate-50 light:text-slate-900 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">

        {/* Minimal Navigation Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200">
          <div className="flex items-center gap-3">
            <ETBridgeLogo size="sm" showText={true} />
            <span className="hidden sm:inline text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono">
              / documentation & app
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/nimd/etbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 transition-colors font-mono"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 light:bg-slate-900 light:text-white font-semibold transition-all hover:opacity-90"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Hero Section with Enhanced ETBridge Identity */}
        <section className="space-y-6">
          {/* Subtle colored release tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Direct Client-Side API • v2.0</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ETBridgeLogo size="xl" showText={false} />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 font-mono">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                  ET
                </span>
                <span>Bridge</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono mt-0.5">
                Fast, reliable, and privacy-first client for ETLab students.
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
            An open-source web interface for students using the ETLab portal. Fast, clean, offline-ready, with an{' '}
            <strong className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-semibold">
              automated 75% cutoff engine
            </strong>{' '}
            and{' '}
            <strong className="text-amber-400 dark:text-amber-400 light:text-amber-600 font-semibold">
              self-reported duty leave tracking
            </strong>.
          </p>

          {/* Action Buttons: Prominent Sign In and GitHub Repo Button */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm sm:text-base font-bold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:scale-95 transition-all group"
            >
              <span>Sign into ETLab Account</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://github.com/nimd/etbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300 bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white text-zinc-200 dark:text-zinc-200 light:text-slate-800 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 text-sm font-semibold transition-all shadow-sm active:scale-95 group"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-zinc-400 group-hover:text-white dark:group-hover:text-white light:group-hover:text-slate-900 transition-colors" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </a>
          </div>
        </section>

        {/* Big Mobile Installation Option */}
        <section className="p-5 sm:p-6 rounded-2xl border-2 border-brand-500/40 bg-gradient-to-br from-brand-950/40 via-zinc-900/60 to-indigo-950/30 dark:from-brand-950/40 dark:via-zinc-900/60 dark:to-indigo-950/30 light:from-brand-50 light:via-white light:to-indigo-50/40 space-y-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
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

            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 items-center justify-center shrink-0 border border-brand-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>

          <button
            onClick={() => setShowInstallModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Open Detailed Installation Instructions</span>
          </button>
        </section>

        {/* Why this project was made */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
              Why It Was Made
            </h2>
          </div>
          <div className="p-4 rounded-2xl border-l-4 border-amber-500/60 bg-amber-950/10 dark:bg-amber-950/10 light:bg-amber-50/50 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 space-y-3 leading-relaxed">
            <p>
              The official ETLab mobile application is slow, unreliable, and frequently crashes or signs students out. Checking simple attendance records or class routines often requires navigating through multiple menus, waiting through webview delays, and dealing with broken session management.
            </p>
            <p>
              ETBridge was built to provide a clean, instant, and reliable alternative. It connects directly to ETLab's public REST API from your browser, stores your session locally, and gives you instant access to your timetable, internal marks, and safe bunk margins without the bloat.
            </p>
          </div>
        </section>

        {/* What the app does with sprinkled colors */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
              Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {/* Card 1: Attendance & Safe Bunk Margins (Emerald Accent) */}
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/10 light:bg-emerald-50/40 space-y-2 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 dark:bg-emerald-950/60 light:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-800/40 light:border-emerald-200">
                  75% Target
                </span>
              </div>
              <h3 className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                Attendance & Bunk Margins
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Calculates how many classes you can afford to skip or must attend to maintain the university 75% cutoff for each subject.
              </p>
            </div>

            {/* Card 2: Self-Reported Duty Leaves (Amber Accent) */}
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10 dark:bg-amber-950/10 light:bg-amber-50/40 space-y-2 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 dark:bg-amber-950/60 light:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-800/40 light:border-amber-200">
                  Hour-by-Hour
                </span>
              </div>
              <h3 className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                Self-Reported Duty Leaves
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Log duty leaves by toggling specific hours of the day (e.g. Hours 4, 5, 6) to project your true attendance before faculty approval.
              </p>
            </div>

            {/* Card 3: Live Timetable & Substitutions (Sky Blue Accent) */}
            <div className="p-4 rounded-2xl border border-sky-500/30 bg-sky-950/10 dark:bg-sky-950/10 light:bg-sky-50/40 space-y-2 hover:border-sky-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 dark:bg-sky-950/60 light:bg-sky-100 px-2 py-0.5 rounded-full border border-sky-800/40 light:border-sky-200">
                  Real-time
                </span>
              </div>
              <h3 className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                Live Timetable & Subs
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Identifies current ongoing periods based on local time, faculty assignments, and clearly labels class substitutions.
              </p>
            </div>

            {/* Card 4: Offline Local Storage (Purple Accent) */}
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/10 dark:bg-purple-950/10 light:bg-purple-50/40 space-y-2 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 dark:bg-purple-950/60 light:bg-purple-100 px-2 py-0.5 rounded-full border border-purple-800/40 light:border-purple-200">
                  PWA Cache
                </span>
              </div>
              <h3 className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                Offline Local Storage
              </h3>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                Schedules and marks are cached locally on your device, allowing instant access in lecture halls even without active internet.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Privacy (Sprinkled with Emerald & Blue Accents) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
              Security & Privacy Guarantee
            </h2>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-zinc-900/40 to-brand-950/20 dark:from-emerald-950/20 dark:via-zinc-900/40 dark:to-brand-950/20 light:from-emerald-50 light:via-white light:to-brand-50/30 space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700">
            <ul className="space-y-2.5 leading-relaxed text-zinc-300 dark:text-zinc-300 light:text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white dark:text-white light:text-slate-900">Direct Client-to-API Communication:</strong> All login requests and data fetches travel directly from your browser to ETLab's official REST API endpoint (<code className="font-mono text-xs text-brand-300 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-100 light:text-brand-800 px-1.5 py-0.5 rounded">https://api.students.etlab.app</code>).
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white dark:text-white light:text-slate-900">No Intermediary Backend Servers:</strong> There is no proxy server, middleman database, or developer backend recording credentials.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white dark:text-white light:text-slate-900">Local-Only Session Storage:</strong> Your authentication token and pending duty leaves are stored solely on your device's browser <code className="font-mono text-xs text-amber-300 bg-amber-950/60 dark:bg-amber-950/60 light:bg-amber-100 light:text-amber-800 px-1.5 py-0.5 rounded">localStorage</code>.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white dark:text-white light:text-slate-900">Transparent & Open Source:</strong> The full codebase is publicly accessible and auditable on GitHub under the MIT License.
                </div>
              </li>
            </ul>

            <div className="pt-2 text-xs border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <a
                href="https://github.com/nimd/etbridge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold font-mono"
              >
                <span>Audit the Source Code on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <h2 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 divide-y divide-zinc-800 dark:divide-zinc-800 light:divide-slate-200">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-900 hover:text-white dark:hover:text-white light:hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-brand-400' : ''}`} />
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

        {/* Document Footer: "Made with Love by NiMD" */}
        <footer className="pt-8 border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse" />
            <span>by</span>
            <a
              href="https://nimd.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white dark:text-white light:text-slate-900 underline hover:text-brand-400 dark:hover:text-brand-400 light:hover:text-brand-600 transition-colors"
            >
              NiMD
            </a>
            <span className="text-zinc-600 dark:text-zinc-600 light:text-slate-300">•</span>
            <span>MIT License</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/nimd/etbridge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setShowInstallModal(true)}
              className="hover:underline text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
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
