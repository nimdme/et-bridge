import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

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

const LOGIN_STATUSES = [
  'Connecting to ETLab...',
  'Authenticating session...',
  'Retrieving attendance & schedule...',
  'Preparing dashboard...'
]

const RELOAD_STATUSES = [
  'Refreshing portal data...',
  'Synchronizing timetable...',
  'Updating attendance margins...'
]

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  mode = 'reload',
  message,
  instituteId,
  instituteName,
  studentName,
  onCancel,
  onSkip
}) => {
  const statuses = mode === 'login' ? LOGIN_STATUSES : RELOAD_STATUSES
  const [statusIndex, setStatusIndex] = useState(0)
  const [showSlowWarning, setShowSlowWarning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(prev => (prev < statuses.length - 1 ? prev + 1 : prev))
    }, 1100)

    const slowTimer = setTimeout(() => {
      setShowSlowWarning(true)
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(slowTimer)
    }
  }, [statuses.length])

  const instCode = instituteId ? instituteId.toUpperCase() : ''
  const currentStatus = message || statuses[statusIndex]

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 text-zinc-100 dark:text-zinc-100 light:text-slate-900 transition-colors">
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-6">
        
        {/* Sleek Minimal App Logo */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-brand-500/20 ring-1 ring-zinc-800 dark:ring-zinc-800 light:ring-slate-300 animate-pulse">
            <svg viewBox="0 0 512 512" className="w-7 h-7 text-white" fill="none">
              <path d="M120 340 C180 220, 332 220, 392 340" stroke="currentColor" strokeWidth="44" strokeLinecap="round"/>
              <path d="M256 340 L256 240" stroke="currentColor" strokeWidth="34" strokeLinecap="round"/>
              <circle cx="256" cy="160" r="32" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Clean Status & Subtle Identity */}
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 tracking-tight font-mono transition-opacity duration-300">
            {currentStatus}
          </h2>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono">
            {instCode && <span>{instCode}</span>}
            {instCode && studentName && <span>•</span>}
            {studentName && <span className="truncate max-w-[150px]">{studentName}</span>}
          </div>
        </div>

        {/* Ultra-Minimal Indeterminate Line Loader */}
        <div className="w-40 h-0.5 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 bg-brand-500 rounded-full w-20 animate-[indeterminate_1.5s_infinite_ease-in-out]" />
        </div>

        {/* Slow Network Fallback */}
        {showSlowWarning && (
          <div className="pt-2 flex flex-col items-center gap-2 text-xs text-zinc-400 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-amber-400/90 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>ETLab server responding slowly</span>
            </div>
            <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
              {onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white transition-colors"
                >
                  Continue
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-3 py-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
