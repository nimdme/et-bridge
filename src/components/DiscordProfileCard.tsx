import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  X, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  Smartphone, 
  LogOut, 
  Building2, 
  GraduationCap 
} from 'lucide-react'
import { InstallModal } from './InstallModal'
import { formatSemester } from '../utils/format'

interface DiscordProfileCardProps {
  onClose: () => void
  isMobileModal?: boolean
}

export const DiscordProfileCard: React.FC<DiscordProfileCardProps> = ({ onClose, isMobileModal = false }) => {
  const { session, profile, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [copiedAdmission, setCopiedAdmission] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onClose()
    logout()
    navigate('/', { replace: true })
  }

  const handleCopyAdmission = (e: React.MouseEvent) => {
    e.stopPropagation()
    const textToCopy = profile?.admission_no || session?.username || ''
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopiedAdmission(true)
      setTimeout(() => setCopiedAdmission(false), 2000)
    }
  }

  const studentName = profile?.name || session?.studentName || session?.username || 'Student'
  const studentInitials = studentName
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST'

  const instCode = (session?.instituteId || 'cev').toUpperCase()
  const instName = session?.instituteName || 'College of Engineering Vadakara'

  const cardContent = (
    <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-700/80 dark:border-zinc-700/80 light:border-slate-300 rounded-3xl shadow-2xl overflow-hidden w-full max-w-sm max-h-[calc(100vh-6rem)] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
      {/* Discord Top Banner with College Gradient */}
      <div className="h-20 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-3.5 flex items-start justify-between relative always-white shrink-0">
        {/* College Code Pill in banner */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-black uppercase shadow-sm always-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{instCode}</span>
        </span>

        <button
          onClick={onClose}
          aria-label="Close profile card"
          className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors always-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar Overlap & Student Name */}
      <div className="px-5 pt-0 pb-4 relative">
        <div className="flex items-end justify-between -mt-9 mb-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center uppercase shadow-lg ring-4 ring-zinc-900 dark:ring-zinc-900 light:ring-white always-white">
              {studentInitials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-zinc-900 dark:ring-zinc-900 light:ring-white" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
            ETLab Connected
          </span>
        </div>

        {/* Name & Admission ID */}
        <div>
          <h4 className="text-base font-extrabold text-white dark:text-white light:text-slate-900 leading-tight">
            {studentName}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
            <span className="font-mono font-bold text-brand-400">
              {profile?.admission_no || session?.username}
            </span>
            <button
              onClick={handleCopyAdmission}
              title="Copy Admission Number"
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded"
            >
              {copiedAdmission ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
            {profile?.roll_no && (
              <>
                <span>•</span>
                <span>Roll: {profile.roll_no}</span>
              </>
            )}
          </div>
        </div>

        {/* Discord-style "Academic Identity" Box */}
        <div className="mt-3 p-3 rounded-2xl bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-2 text-xs">
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">College</span>
            <p className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800 truncate">
              {instName} ({instCode})
            </p>
          </div>

          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Class & Course</span>
            <p className="font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800 truncate">
              {profile?.course || 'Engineering'}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
            <span className="text-zinc-400">Semester:</span>
            <span className="font-bold text-brand-400">
              {formatSemester(profile?.curnt_sem, 'Semester')}
            </span>
          </div>

          {profile?.email && (
            <div className="flex items-center justify-between text-[11px] gap-2 pt-1 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
              <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500 shrink-0">Email:</span>
              <span className="font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 truncate min-w-0" title={profile.email}>{profile.email}</span>
            </div>
          )}
        </div>

        {/* Quick Actions (Discord style) */}
        <div className="mt-3 space-y-1.5 pt-2 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 light:bg-slate-100 light:hover:bg-slate-200 text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
            </span>
            <span className="text-[10px] text-zinc-500 uppercase font-bold">{theme}</span>
          </button>

          {/* Install PWA Button */}
          <button
            onClick={() => {
              onClose()
              setShowInstallModal(true)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 light:bg-slate-100 light:hover:bg-slate-200 text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-700 transition-colors text-left"
          >
            <Smartphone className="w-4 h-4 text-brand-400" />
            <span>Install App on Device</span>
          </button>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of ETLab</span>
          </button>
        </div>
      </div>

      {/* PWA Install Modal nested if triggered */}
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </div>
  )

  if (isMobileModal) {
    return createPortal(
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()} 
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full max-w-sm"
        >
          {cardContent}
        </div>
      </div>,
      document.body
    )
  }

  return cardContent
}
