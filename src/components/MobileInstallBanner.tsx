import React from 'react'
import { Download, X } from 'lucide-react'
import { usePWA } from '../context/PWAContext'
import { BrandLogo } from './BrandLogo'

export const MobileInstallBanner: React.FC = () => {
  const { showPeriodicPrompt, dismissPeriodicPrompt, triggerInstall, isInstalled } = usePWA()

  if (!showPeriodicPrompt || isInstalled) {
    return null
  }

  const handleInstall = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await triggerInstall()
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dismissPeriodicPrompt(7) // Snooze for 7 days
  }

  return (
    <div 
      role="dialog" 
      aria-label="Install ETBridge App"
      className="fixed bottom-[74px] left-3 right-3 sm:hidden z-30 max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="glass-panel border border-brand-500/35 bg-zinc-900/95 dark:bg-zinc-900/95 light:bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl shadow-black/50 dark:shadow-black/70 light:shadow-slate-300/70 flex items-center justify-between gap-3">
        {/* App Icon + Value proposition */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-md shadow-brand-500/20 bg-brand-600/10 border border-brand-500/25 flex items-center justify-center p-1">
            <BrandLogo className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 truncate flex items-center gap-1.5">
              <span>Install ETBridge</span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-brand-500/15 text-brand-400 border border-brand-500/30">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600 truncate mt-0.5">
              Fast, fullscreen & offline access
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss install banner for 7 days"
            title="Dismiss for 7 days"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
