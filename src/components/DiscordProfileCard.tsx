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
  GraduationCap,
  Mail,
  PieChart
} from 'lucide-react'
import { InstallModal } from './InstallModal'
import { EtlabImage } from './EtlabImage'
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

  const instCode = session?.instituteId ? session.instituteId.toUpperCase() : ''
  const instName = session?.instituteName || (instCode ? `${instCode} Portal` : 'College Portal')
  const photoSrc = profile?.photo || profile?.image || profile?.avatar || session?.studentPhoto

  const attendancePer = profile?.attendance?.percentage
  const hasAttendance = typeof attendancePer === 'number' && !isNaN(attendancePer)

  const cardContent = (
    <div className="bg-zinc-900/95 dark:bg-zinc-900/95 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm max-h-[calc(100vh-5rem)] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
      {/* Top Header: Institution & Close Button */}
      <div className="px-4 py-3 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-xs font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-800 truncate">
            {instName}
          </span>
          {instCode && (
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-200 text-[10px] font-mono font-bold text-brand-400 shrink-0">
              {instCode}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Close profile card"
          className="p-1 rounded-lg text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Student Identity: Avatar + Names */}
        <div className="flex items-start gap-3.5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-zinc-700/60 dark:ring-zinc-700/60 light:ring-slate-300 shadow-sm shrink-0 bg-zinc-800 dark:bg-zinc-800 light:bg-slate-100 flex items-center justify-center text-white font-black text-xl">
            <EtlabImage
              src={photoSrc}
              alt={studentName}
              fallback={
                <div className="w-full h-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base tracking-wider">
                  {studentInitials}
                </div>
              }
            />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 leading-snug truncate">
              {studentName}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleCopyAdmission}
                title="Click to copy admission number"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 hover:bg-zinc-800 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 light:bg-slate-100 light:hover:bg-slate-200 text-xs font-mono font-semibold text-brand-400 dark:text-brand-400 light:text-brand-600 transition-colors"
              >
                <span>{profile?.admission_no || session?.username}</span>
                {copiedAdmission ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400 hover:text-white" />
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 truncate">
              {formatSemester(profile?.curnt_sem, 'Semester')}
              {profile?.roll_no ? ` • Roll ${profile.roll_no}` : ''}
              {profile?.batch_id ? ` • Batch ${profile.batch_id}` : ''}
            </p>
          </div>
        </div>

        {/* Academic Details Card */}
        <div className="p-3 rounded-xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-2.5 text-xs">
          {/* Course */}
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Program</span>
              <p className="font-medium text-zinc-200 dark:text-zinc-200 light:text-slate-800 truncate">
                {profile?.course || 'Engineering'}
              </p>
            </div>
          </div>

          {/* Attendance Snapshot */}
          {hasAttendance && (
            <div className="pt-2 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500 flex items-center gap-1.5">
                  <PieChart className="w-3 h-3 text-brand-400" />
                  <span>Cumulative Attendance</span>
                </span>
                <span className={`font-mono font-bold ${attendancePer >= 75 ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-600' : 'text-amber-400 dark:text-amber-400 light:text-amber-600'}`}>
                  {attendancePer.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${attendancePer >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, attendancePer))}%` }}
                />
              </div>
              {profile?.attendance?.classes_attended != null && profile?.attendance?.total_classes != null && (
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 mt-1">
                  {profile.attendance.classes_attended} attended out of {profile.attendance.total_classes} conducted classes
                </p>
              )}
            </div>
          )}

          {/* Email */}
          {profile?.email && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
              <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-500 shrink-0 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-brand-400" />
                <span>Email</span>
              </span>
              <span className="font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-700 truncate min-w-0 text-right" title={profile.email}>
                {profile.email}
              </span>
            </div>
          )}
        </div>

        {/* Clean Actions */}
        <div className="space-y-1.5 pt-1">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 light:bg-slate-100 light:hover:bg-slate-200 text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
            </span>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{theme}</span>
          </button>

          {/* Install PWA Button */}
          <button
            type="button"
            onClick={() => {
              onClose()
              setShowInstallModal(true)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 light:bg-slate-100 light:hover:bg-slate-200 text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-700 transition-colors text-left"
          >
            <Smartphone className="w-4 h-4 text-brand-400" />
            <span>Install App on Device</span>
          </button>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 dark:hover:bg-rose-950/30 light:hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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
