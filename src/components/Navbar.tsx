import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  RotateCw, 
  Smartphone, 
  Sparkles, 
  Search, 
  Sun, 
  Moon
} from 'lucide-react'
import { InstallModal } from './InstallModal'
import { DiscordProfileCard } from './DiscordProfileCard'
import { ETBridgeLogo } from './ETBridgeLogo'

export const Navbar: React.FC = () => {
  const { session, profile, isDemo, refreshData, loading, openCommandPalette } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [showMobileProfile, setShowMobileProfile] = useState(false)

  const studentName = profile?.name || session?.studentName || session?.username || 'Student'
  const studentInitials = studentName
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST'

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData(true)
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 relative">
        {/* Sleek top indeterminate progress bar during background or manual sync */}
        {(loading || isRefreshing) && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-800/40 dark:bg-zinc-800/40 light:bg-slate-200 overflow-hidden z-50">
            <div className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 w-1/3 animate-indeterminate shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </div>
        )}
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Minimal Brand & College Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
              <ETBridgeLogo size="sm" showText={true} />
              <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 hidden xs:inline font-mono">v2.0</span>
            </Link>

            {/* Demo badge */}
            {isDemo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3 h-3" /> Demo
              </span>
            )}
          </div>

          {/* Center: Minimalist Search / Spotlight trigger */}
          <button
            onClick={openCommandPalette}
            className="flex-1 max-w-sm flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-slate-100 hover:bg-zinc-800/80 dark:hover:bg-zinc-800/80 light:hover:bg-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400 light:text-slate-400 shrink-0" />
              <span className="truncate">Search subjects, teachers, notes, dues...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-600 bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded shadow-sm">
              ⌘K
            </kbd>
          </button>

          {/* Right: Quick Controls (Theme Toggle, Install, Refresh, Mobile Avatar) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800/80 dark:hover:bg-zinc-800/80 light:hover:bg-slate-200 border border-transparent hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-slate-300 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Install PWA Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs font-medium text-zinc-200 dark:text-zinc-200 light:text-slate-800 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-brand-400" />
              <span>Install App</span>
            </button>

            {/* Refresh Data Button */}
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              title="Refresh Data from College Server"
              className="p-2 rounded-xl text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800/80 dark:hover:bg-zinc-800/80 light:hover:bg-slate-200 border border-transparent hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-slate-300 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
            </button>

            {/* Mobile Profile Avatar Button */}
            {session && (
              <button
                type="button"
                onClick={() => setShowMobileProfile(true)}
                title="Open Profile Card"
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs uppercase shadow-sm ring-1 ring-zinc-700/60 shrink-0 always-white"
              >
                {studentInitials}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Install Modal */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />

      {/* Mobile Discord Profile Card Modal */}
      {showMobileProfile && (
        <DiscordProfileCard onClose={() => setShowMobileProfile(false)} isMobileModal />
      )}
    </>
  )
}
