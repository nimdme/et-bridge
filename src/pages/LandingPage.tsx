import React, { useState, useMemo } from 'react'
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
  ChevronRight,
  Terminal,
  Activity,
  Sliders,
  Check,
  Building,
  RotateCw
} from 'lucide-react'
import { InstallModal } from '../components/InstallModal'

const POPULAR_COLLEGES = [
  { code: 'cev', name: 'College of Engineering Vadakara' },
  { code: 'gcek', name: 'Govt College of Engineering Kannur' },
  { code: 'mace', name: 'Mar Athanasius College of Engineering' },
  { code: 'tkmce', name: 'TKM College of Engineering Kollam' },
  { code: 'jec', name: 'Jyothi Engineering College' },
  { code: 'vjec', name: 'Vimal Jyothi Engineering College' },
  { code: 'rit', name: 'Rajiv Gandhi Institute of Technology' },
  { code: 'geck', name: 'Govt Engineering College Kozhikode' }
]

export const LandingPage: React.FC = () => {
  const { isAuthenticated, loginDemo } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'architecture' | 'benchmark' | 'colleges'>('benchmark')
  const [collegeSearch, setCollegeSearch] = useState('')

  // Interactive Live Simulator State
  const [totalClasses, setTotalClasses] = useState(32)
  const [attendedClasses, setAttendedClasses] = useState(23)
  const [dutyLeaveHours, setDutyLeaveHours] = useState(2)

  // Math calculations for live simulator
  const simStats = useMemo(() => {
    const total = Math.max(1, totalClasses)
    const attended = Math.min(total, Math.max(0, attendedClasses))
    const currentPercent = (attended / total) * 100
    const target = 75
    const tFrac = 0.75

    // Official status
    const isSafe = currentPercent >= target
    const canMiss = isSafe ? Math.max(0, Math.floor(attended / tFrac - total)) : 0
    const mustAttend = !isSafe ? Math.max(0, Math.ceil((tFrac * total - attended) / (1 - tFrac))) : 0

    // Projected with duty leave
    const projAttended = Math.min(total, attended + dutyLeaveHours)
    const projPercent = (projAttended / total) * 100
    const isProjSafe = projPercent >= target
    const projCanMiss = isProjSafe ? Math.max(0, Math.floor(projAttended / tFrac - total)) : 0
    const projMustAttend = !isProjSafe ? Math.max(0, Math.ceil((tFrac * total - projAttended) / (1 - tFrac))) : 0

    return {
      total,
      attended,
      currentPercent: currentPercent.toFixed(1),
      isSafe,
      canMiss,
      mustAttend,
      projAttended,
      projPercent: projPercent.toFixed(1),
      isProjSafe,
      projCanMiss,
      projMustAttend
    }
  }, [totalClasses, attendedClasses, dutyLeaveHours])

  const filteredColleges = POPULAR_COLLEGES.filter(c => 
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) || 
    c.code.toLowerCase().includes(collegeSearch.toLowerCase())
  )

  const handleDemoClick = () => {
    loginDemo()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 light:bg-slate-50 light:text-slate-900 flex flex-col selection:bg-brand-500/30 selection:text-brand-300 transition-colors">
      {/* Background delicate atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-brand-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Minimal Header */}
      <header className="max-w-5xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/20 flex items-center justify-center">
            <svg viewBox="0 0 512 512" className="w-4 h-4 text-white" fill="none">
              <path d="M120 340 C180 220, 332 220, 392 340" stroke="currentColor" strokeWidth="48" strokeLinecap="round"/>
              <path d="M256 340 L256 240" stroke="currentColor" strokeWidth="36" strokeLinecap="round"/>
              <circle cx="256" cy="160" r="36" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-white dark:text-white light:text-slate-900">
              ET<span className="text-brand-400">Bridge</span>
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono font-bold text-zinc-500 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded px-1.5 py-0.2">
              v2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 rounded-xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-200/80 hover:bg-zinc-800 text-zinc-400 dark:text-zinc-400 light:text-slate-700 hover:text-white transition-all active:scale-95"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setShowInstallModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-brand-400" />
            <span>Install</span>
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all active:scale-95"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all active:scale-95"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-12 pb-20 flex flex-col items-center">
        
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-200/80 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mb-6 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Independent KTU ETLab Client • Zero Tracking</span>
        </div>

        {/* Minimalist Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white dark:text-white light:text-slate-900 text-center leading-[1.12] max-w-3xl">
          ETLab, but actually{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">
            fast, accurate & useful.
          </span>
        </h1>

        {/* Candid summary */}
        <p className="mt-4 text-sm sm:text-base text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-center max-w-xl leading-relaxed">
          Built because the official app crashes on attendance, hides bunk margins, and takes 10 seconds of webview lag. ETBridge is a lightweight client that loads in &lt;60ms, tracks your 75% limit, and simulates hour-by-hour duty leaves.
        </p>

        {/* Action Buttons with Graceful Shimmer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleDemoClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 animate-shimmer-sweep"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Live Demo (1-Click)</span>
            <ArrowRight className="w-4 h-4 opacity-80" />
          </button>

          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-semibold text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-sm"
          >
            <span>Sign In with College ID</span>
          </Link>
        </div>

        {/* =========================================================================
            INTERACTIVE LIVE SIMULATOR: Try the Bunk & Duty Leave Engine Right Here
            ========================================================================= */}
        <div className="mt-14 w-full rounded-3xl bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-brand-500/10 text-brand-400">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900">
                  Interactive Attendance & Bunk Simulator
                </h3>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                Test the KTU 75% calculation engine live before even logging in
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-brand-400 font-bold">
                Target: 75.0%
              </span>
            </div>
          </div>

          {/* Interactive Controls Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Classes Conducted Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                    Total Classes Conducted:
                  </span>
                  <span className="font-mono font-bold text-white dark:text-white light:text-slate-900 text-sm">
                    {totalClasses}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={totalClasses}
                  onChange={(e) => {
                    const newTotal = Number(e.target.value)
                    setTotalClasses(newTotal)
                    if (attendedClasses > newTotal) setAttendedClasses(newTotal)
                  }}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Classes Attended Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                    Classes Attended:
                  </span>
                  <span className="font-mono font-bold text-white dark:text-white light:text-slate-900 text-sm">
                    {attendedClasses}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={totalClasses}
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Toggle Duty Leave Hours */}
              <div>
                <span className="block text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-2">
                  Simulate Pending Duty Leave:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[0, 1, 2, 3, 4, 5].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDutyLeaveHours(h)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 ${
                        dutyLeaveHours === h
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                          : 'bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-100 hover:bg-zinc-700 text-zinc-300 dark:text-zinc-300 light:text-slate-700'
                      }`}
                    >
                      {h === 0 ? 'None' : `+${h}h DL`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Visual Result Box */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      Current Official Status
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className={`text-2xl font-black ${
                        simStats.isSafe ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {simStats.currentPercent}%
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        ({simStats.attended}/{simStats.total})
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    simStats.isSafe
                      ? 'bg-emerald-950/70 border-emerald-800/70 text-emerald-400'
                      : 'bg-rose-950/70 border-rose-800/70 text-rose-400'
                  }`}>
                    {simStats.isSafe ? `Can skip ${simStats.canMiss} classes` : `Attend next ${simStats.mustAttend} hours`}
                  </span>
                </div>

                {/* Duty Leave Impact preview */}
                {dutyLeaveHours > 0 && (
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Projected with +{dutyLeaveHours}h Duty Leave</span>
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xl font-black text-amber-300">
                        {simStats.projPercent}%
                        <span className="text-xs font-normal text-amber-400/80 ml-1.5 font-mono">
                          ({simStats.projAttended}/{simStats.total})
                        </span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/70 border border-amber-800/70 text-amber-300">
                        {simStats.isProjSafe ? (
                          simStats.projCanMiss > 0 ? `Can skip ${simStats.projCanMiss} classes` : 'Safe (≥ 75%)'
                        ) : (
                          `Attend next ${simStats.projMustAttend} hours`
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-500 light:text-slate-400">
                Formula: {simStats.isSafe ? '⌊(Attended / 0.75) - Total⌋' : '⌈(0.75 × Total - Attended) / 0.25⌉'}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            INFORMATION-RICH TECHNICAL TABS
            ========================================================================= */}
        <div className="mt-14 w-full">
          <div className="flex items-center gap-1.5 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 pb-2 mb-5">
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'benchmark'
                  ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 text-white dark:text-white light:text-slate-900 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Benchmark Comparison
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 text-white dark:text-white light:text-slate-900 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Zero-Knowledge Security
            </button>
            <button
              onClick={() => setActiveTab('colleges')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'colleges'
                  ? 'bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 text-white dark:text-white light:text-slate-900 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Supported Colleges ({POPULAR_COLLEGES.length}+)
            </button>
          </div>

          {/* TAB 1: Benchmark Comparison */}
          {activeTab === 'benchmark' && (
            <div className="rounded-3xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono text-[11px]">
                      <th className="py-3 px-4 font-semibold">Capability</th>
                      <th className="py-3 px-4 font-semibold text-rose-400">Official ETLab Mobile App</th>
                      <th className="py-3 px-4 font-semibold text-emerald-400">ETBridge Client</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 dark:divide-zinc-800/60 light:divide-slate-200">
                    <tr>
                      <td className="py-3 px-4 font-medium text-white dark:text-white light:text-slate-900">Cold Start Latency</td>
                      <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono">~7,400ms (Heavy webview)</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">&lt; 60ms (Instant precached)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-white dark:text-white light:text-slate-900">Bunk Calculator</td>
                      <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">Hidden / Manual calculation</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">Live per-subject margin (can skip / attend)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-white dark:text-white light:text-slate-900">Duty Leave Simulator</td>
                      <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">No (Shows only after faculty entry)</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">Toggle hours (4, 5, 6) & project attendance</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-white dark:text-white light:text-slate-900">Absent Session Topics</td>
                      <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">Unavailable / buried</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">1-click drilldown into topics taught that hour</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-white dark:text-white light:text-slate-900">Offline Campus Access</td>
                      <td className="py-3 px-4 text-zinc-400 dark:text-zinc-400 light:text-slate-600">Blank white error screen</td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">Full offline timetable & marks via localStorage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Zero-Knowledge Security */}
          {activeTab === 'architecture' && (
            <div className="rounded-3xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                    No Middleman Servers. No Proxies. Zero Logging.
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-0.5">
                    ETBridge is an unopinionated static client that lives entirely in your browser.
                  </p>
                </div>
              </div>

              {/* Direct Network Diagram */}
              <div className="p-4 rounded-2xl bg-zinc-950 font-mono text-xs text-zinc-300 space-y-2 border border-zinc-800">
                <div className="text-zinc-500">// Direct Browser-to-College Endpoint:</div>
                <div className="text-emerald-400">
                  POST https://api.students.etlab.app/login
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Headers: {'{'} "X-Institute-ID": "{'<college_code>'}" {'}'}
                </div>
                <div className="text-zinc-500 pt-1">
                  // Tokens are stored in localStorage(`etbridge_session`) on your device only.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700">MIT Licensed open-source repository</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700">No analytics, no ad trackers, zero telemetry</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Supported Colleges */}
          {activeTab === 'colleges' && (
            <div className="rounded-3xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-6 space-y-4 shadow-sm">
              <input
                type="text"
                placeholder="Search college name or code (e.g. CEV, MACE, GCEK)..."
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-900 focus:outline-none focus:border-brand-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredColleges.map((col) => (
                  <div
                    key={col.code}
                    className="p-3 rounded-xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-brand-400 uppercase mr-2">{col.code}</span>
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-800 font-medium truncate max-w-[170px] inline-block align-bottom">{col.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40 shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 bg-zinc-950 dark:bg-zinc-950 light:bg-white py-6 px-4 text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-500 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-medium text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              Crafted by <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-900 font-semibold">Niranjan M D</strong> (CEV).
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 mt-0.5">
              MIT License • Community project for KTU engineering students
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleDemoClick}
              className="hover:text-brand-400 transition-colors font-medium"
            >
              Demo Preview
            </button>
            <button
              onClick={() => setShowInstallModal(true)}
              className="hover:text-brand-400 transition-colors font-medium"
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
