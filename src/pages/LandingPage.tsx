import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  Sun, 
  Moon,
  Check
} from 'lucide-react'
import { InstallModal } from '../components/InstallModal'

export const LandingPage: React.FC = () => {
  const { isAuthenticated, loginDemo } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showInstallModal, setShowInstallModal] = useState(false)

  const handleDemoClick = () => {
    loginDemo()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 light:bg-slate-50 light:text-slate-900 flex flex-col selection:bg-brand-500/30 selection:text-brand-300 transition-colors">
      {/* Background subtle atmospheric gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-brand-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="max-w-5xl w-full mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-md shadow-brand-500/20 flex items-center justify-center">
            <svg viewBox="0 0 512 512" className="w-4 h-4 text-white" fill="none">
              <path d="M120 340 C180 220, 332 220, 392 340" stroke="currentColor" strokeWidth="48" strokeLinecap="round"/>
              <path d="M256 340 L256 240" stroke="currentColor" strokeWidth="36" strokeLinecap="round"/>
              <circle cx="256" cy="160" r="36" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white dark:text-white light:text-slate-900">
                ET<span className="text-brand-400">Bridge</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                v2.0
              </span>
            </div>
            <span className="block text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-500 font-medium leading-none mt-0.5">
              Open KTU Portal Client
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-200/80 hover:bg-zinc-800 text-zinc-400 dark:text-zinc-400 light:text-slate-700 hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setShowInstallModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-brand-400" />
            <span>Install</span>
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 flex flex-col items-center">
        {/* Indie Manifesto Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/40 dark:bg-rose-950/40 light:bg-rose-50 border border-rose-800/40 dark:border-rose-800/40 light:border-rose-200 text-xs text-rose-300 dark:text-rose-300 light:text-rose-700 mb-6 font-medium shadow-sm">
          <span>Student-Built • No Corporate Fluff • 100% Client-Side</span>
        </div>

        {/* Unfiltered Authentic Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white dark:text-white light:text-slate-900 text-center leading-[1.15] max-w-2xl">
          ETLab couldn't bother to test their app.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
            So I rebuilt it properly.
          </span>
        </h1>

        {/* Honest Story / Purpose */}
        <p className="mt-5 text-sm sm:text-base text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-center max-w-xl leading-relaxed">
          The official ETLab mobile app is slow, buggy, clunky, and bloated with webviews that lag in lecture halls. ETBridge is a fast, clean, and instant web app that lets you check your classes, track bunk margins, and keep tabs on your attendance without the frustration.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Open My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Sign In with College ID</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <button
            onClick={handleDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-semibold text-sm transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try 1-Click Demo</span>
          </button>
        </div>

        {/* Live Visual Preview Card (Feels tangible and real) */}
        <div className="mt-12 w-full max-w-xl rounded-3xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white border border-zinc-800/90 dark:border-zinc-800/90 light:border-slate-200 shadow-2xl p-5 sm:p-6 text-left relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                NM
              </div>
              <div>
                <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 leading-tight">
                  NIRANJAN M D
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                  CEV • B.Tech Computer Science • Semester 1
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 dark:bg-emerald-950/80 light:bg-emerald-50 border border-emerald-800/70 light:border-emerald-200 px-2.5 py-1 rounded-full">
              77.0% Overall
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Safe Bunk Status</span>
              <p className="font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Can skip 3 classes</span>
              </p>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5 block">
                Above the KTU 75% cutoff
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Self-Reported Duty Leave</span>
              <p className="font-bold text-amber-400 mt-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Projected: 80.5%</span>
              </p>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5 block">
                +4h pending approval
              </span>
            </div>
          </div>
        </div>

        {/* Why and How Safe Is It Section */}
        <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Card: Why I built it */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold mb-3.5">
                ⚡
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 mb-2">
                Why ETBridge Exists
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                ETLab has had years and millions in college contracts to build a decent app. Instead, students got an unusable, slow webview container that constantly logs you out, struggles with substitutions, and hides attendance records. ETBridge fixes that with pure, lightweight client-side speed.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200 text-xs text-zinc-400 font-medium">
              Loads under 100ms • Works offline • No ads
            </div>
          </div>

          {/* Card: How safe is it */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3.5">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 mb-2">
                Zero-Knowledge Privacy
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
                There is <strong>zero middleman server</strong> and no backend database. Your login credentials and authentication tokens talk directly to your college’s official ETLab REST API from your browser. Everything stays in your device's local storage.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200 text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Open Source under MIT License</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200">
            <span className="font-bold text-white dark:text-white light:text-slate-900 block mb-1">
              📊 Safe Bunk Margins
            </span>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Real-time calculations of how many hours you can miss or must attend to preserve 75%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200">
            <span className="font-bold text-white dark:text-white light:text-slate-900 block mb-1">
              🗓️ Hour-by-Hour Duty Leaves
            </span>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Select specific hours (e.g. 4, 5, 6) to project attendance before faculty entries.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200">
            <span className="font-bold text-white dark:text-white light:text-slate-900 block mb-1">
              📱 Installable PWA
            </span>
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed">
              Install to your home screen on iOS and Android with full standalone app mode.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-zinc-950 dark:bg-zinc-950 light:bg-white py-8 px-4 text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-500 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-medium text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              Built by <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-semibold">Niranjan M D</strong> for students everywhere.
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 mt-0.5">
              Unofficial client. MIT License. Not affiliated with Etuwa Concepts.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleDemoClick}
              className="hover:text-brand-400 transition-colors"
            >
              Demo Mode
            </button>
            <button
              onClick={() => setShowInstallModal(true)}
              className="hover:text-brand-400 transition-colors"
            >
              Install App
            </button>
          </div>
        </div>
      </footer>

      {/* Install Modal */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </div>
  )
}
