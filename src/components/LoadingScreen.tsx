import React, { useState, useEffect } from 'react'
import { Sparkles, ShieldCheck, Server, AlertCircle } from 'lucide-react'

export interface LoadingScreenProps {
  mode?: 'reload' | 'login' | 'sync'
  title?: string
  message?: string
  instituteId?: string
  instituteName?: string
  studentName?: string
  onCancel?: () => void
  onSkip?: () => void
}

const LOGIN_STEPS = [
  { label: 'Connecting to ETLab portal...', subtext: 'Establishing direct TLS connection to official API' },
  { label: 'Authenticating credentials...', subtext: 'Verifying student registration and access token' },
  { label: 'Syncing timetable & attendance...', subtext: 'Retrieving course periods and live attendance records' },
  { label: 'Calculating bunk margins & analysis...', subtext: 'Evaluating risk indicators and internal marks' },
  { label: 'Preparing student dashboard...', subtext: 'Finalizing layout and quick widgets' }
]

const RELOAD_STEPS = [
  { label: 'Restoring student session...', subtext: 'Connecting to ETLab official student server' },
  { label: 'Syncing live timetable & attendance...', subtext: 'Fetching latest KTU periods and bunk percentages' },
  { label: 'Updating courses & assignment deadlines...', subtext: 'Refreshing coursework, modules and internal evaluations' },
  { label: 'Finalizing your workspace...', subtext: 'Rendering high-speed dashboard' }
]

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  mode = 'reload',
  title,
  message,
  instituteId,
  instituteName,
  studentName,
  onCancel,
  onSkip
}) => {
  const steps = mode === 'login' ? LOGIN_STEPS : RELOAD_STEPS
  const [stepIndex, setStepIndex] = useState(0)
  const [showSlowWarning, setShowSlowWarning] = useState(false)

  // Step progression timer
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 750)

    // Show slow network notice if loading takes longer than 8s
    const slowTimer = setTimeout(() => {
      setShowSlowWarning(true)
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(slowTimer)
    }
  }, [steps.length])

  const progressPercent = Math.min(
    96,
    Math.round(((stepIndex + 1) / steps.length) * 100)
  )

  const currentStep = steps[stepIndex]
  const instCode = instituteId ? instituteId.toUpperCase() : ''
  const instDisplayName = instituteName || (instCode ? `${instCode} Portal` : 'Student Portal')

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 text-zinc-100 dark:text-zinc-100 light:text-slate-900 transition-colors animate-in fade-in duration-200">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand-600/15 via-purple-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md flex flex-col items-center text-center relative z-10 space-y-6">
        
        {/* Animated Brand Emblem with Concentric Orbiting Rings */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-2">
          {/* Outer rotating accent ring with glowing satellite */}
          <div className="absolute inset-0 rounded-full border border-brand-500/20 dark:border-brand-500/20 light:border-brand-500/30 animate-[spin_7s_linear_infinite]">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-brand-400 shadow-[0_0_12px_#818cf8]" />
          </div>

          {/* Middle counter-rotating dashed ring */}
          <div className="absolute inset-3 rounded-full border border-dashed border-indigo-500/30 dark:border-indigo-500/30 light:border-indigo-400/40 animate-[spin_5s_linear_infinite_reverse]" />

          {/* Core pulsing glowing backdrop */}
          <div className="absolute inset-5 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 blur-md opacity-40 animate-pulse" />

          {/* Center Logo Icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl shadow-brand-500/30 flex items-center justify-center group ring-4 ring-zinc-900 dark:ring-zinc-900 light:ring-white">
            <svg viewBox="0 0 512 512" className="w-9 h-9 text-white animate-pulse" fill="none">
              <path d="M120 340 C180 220, 332 220, 392 340" stroke="currentColor" strokeWidth="44" strokeLinecap="round"/>
              <path d="M256 340 L256 240" stroke="currentColor" strokeWidth="34" strokeLinecap="round"/>
              <circle cx="256" cy="160" r="32" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Brand Name & College Identifier */}
        <div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-black text-2xl md:text-3xl tracking-tight text-white dark:text-white light:text-slate-900">
              ET<span className="text-brand-400">Bridge</span>
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 uppercase tracking-wider">
              v2.0
            </span>
          </div>

          {/* College Badge */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono font-bold text-brand-400">{instCode}</span>
            <span className="text-zinc-600 dark:text-zinc-600 light:text-slate-400">•</span>
            <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium truncate max-w-[200px]">
              {instDisplayName}
            </span>
          </div>

          {studentName && (
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 font-medium">
              Student: <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold">{studentName}</span>
            </p>
          )}
        </div>

        {/* Active Stage & Message Card */}
        <div className="w-full p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm space-y-3">
          
          {/* Dynamic Status Text */}
          <div className="min-h-[46px] flex flex-col items-center justify-center">
            <p className="text-sm md:text-base font-bold text-white dark:text-white light:text-slate-900 tracking-tight transition-all duration-300">
              {message || currentStep.label}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5 transition-all duration-300">
              {currentStep.subtext}
            </p>
          </div>

          {/* Smooth Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-zinc-950 dark:bg-zinc-950 light:bg-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 overflow-hidden relative shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>ETLab API Online</span>
              </span>
              <span className="font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Slow Network Warning & Escape Hatch */}
        {showSlowWarning && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-between gap-3 text-xs text-amber-200 animate-in fade-in duration-300 w-full text-left">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ETLab college server is responding slowly...</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 text-[11px]"
                >
                  Continue Anyway
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {/* Privacy & Encryption Reassurance Footer */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          <span>Zero-Knowledge Client • Credentials securely stored locally</span>
        </div>
      </div>
    </div>
  )
}
