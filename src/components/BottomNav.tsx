import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CalendarDays, 
  GraduationCap, 
  PieChart, 
  Menu,
  X,
  BookMarked,
  TrendingUp,
  Building,
  Bell,
  Clock,
  HelpCircle,
  Smartphone,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Sparkles,
  CreditCard,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { LogDutyLeaveModal } from './LogDutyLeaveModal'
import { FeedbackModal } from './FeedbackModal'
import { InstallModal } from './InstallModal'
import { formatSemester } from '../utils/format'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, profile, totalPendingDlHours, academicAnalysis, activityPoints, fees, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)

  const studentName = profile?.name || session?.studentName || session?.username || 'Student'
  const admissionNo = profile?.admission_no || session?.username || ''
  const collegeName = session?.instituteName || session?.instituteId?.toUpperCase() || ''
  const currentSem = formatSemester(profile?.curnt_sem || academicAnalysis?.student?.current_sem, 'Semester')

  const studentInitials = studentName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST'

  const secondaryPaths = ['/courses', '/analysis', '/campus', '/notices']
  const isSecondaryActive = secondaryPaths.includes(location.pathname)

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/attendance', label: 'Attendance', icon: PieChart },
    { to: '/timetable', label: 'Schedule', icon: CalendarDays },
    { to: '/academics', label: 'Academics', icon: GraduationCap },
  ]

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setIsMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav 
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 backdrop-blur-md border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 px-2 pt-1.5 md:hidden transition-colors shadow-lg"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-0.5 px-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-brand-400 font-bold'
                      : 'text-zinc-500 dark:text-zinc-500 light:text-slate-500 hover:text-zinc-300 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-xl transition-all ${
                      isActive ? 'bg-brand-500/15 text-brand-400 scale-105' : ''
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}

          {/* 5th Button: More / Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-0.5 px-2 rounded-xl transition-all ${
              isSecondaryActive || isMenuOpen
                ? 'text-brand-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-500 light:text-slate-500 hover:text-zinc-300 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all relative ${
              isSecondaryActive || isMenuOpen ? 'bg-brand-500/15 text-brand-400 scale-105' : ''
            }`}>
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalPendingDlHours > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Sheet */}
      {isMenuOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-full max-h-[85vh] bg-zinc-900 dark:bg-zinc-900 light:bg-white border-t border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-zinc-700/80 dark:bg-zinc-700/80 light:bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

            {/* Sheet Header: Student Info */}
            <div className="px-5 pb-3 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm ring-1 ring-white/10">
                  {studentInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-white dark:text-white light:text-slate-900 truncate">
                    {studentName}
                  </h3>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600 truncate">
                    {admissionNo} • {currentSem} • {collegeName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Scrollable Content */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Primary Pages Grid */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block px-1 mb-2">
                  Academic Sections
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigate('/courses')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      location.pathname === '/courses'
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                        : 'bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-1.5 rounded-xl bg-purple-500/15 text-purple-400">
                        <BookMarked className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Courses & Syllabus</span>
                      <span className="text-[10px] opacity-70 block">Modules & Outlines</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('/analysis')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      location.pathname === '/analysis'
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                        : 'bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Academic Analysis</span>
                      <span className="text-[10px] opacity-70 block">CGPA & Backlogs</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('/campus')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      location.pathname === '/campus'
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                        : 'bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-1.5 rounded-xl bg-brand-500/15 text-brand-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Campus & Services</span>
                      <span className="text-[10px] opacity-70 block">Points, Fees & Dues</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('/notices')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      location.pathname === '/notices'
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                        : 'bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400">
                        <Bell className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Notice Board</span>
                      <span className="text-[10px] opacity-70 block">Circulars & Alerts</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Actions & Tools */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 block px-1 mb-2">
                  Quick Actions & Tools
                </span>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setShowLogModal(true)
                    }}
                    className="w-full p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs font-bold transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Log Pending Duty Leave</span>
                    </div>
                    {totalPendingDlHours > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200">
                        +{totalPendingDlHours}h Pending
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-80 font-medium">Claim hours →</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setShowFeedbackModal(true)
                    }}
                    className="w-full p-3 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 hover:bg-zinc-800/60 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 flex items-center justify-between text-xs font-semibold transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-zinc-400" />
                      <span>Something Missing? (Feedback)</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-normal">Report to Admin →</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false)
                        setShowInstallModal(true)
                      }}
                      className="p-2.5 rounded-xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                      <span>Install PWA</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="p-2.5 rounded-xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign Out & Legal */}
              <div className="pt-2 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-800/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of ETLab</span>
                </button>

                <p className="text-[10px] text-center text-zinc-500 dark:text-zinc-500 light:text-slate-500">
                  ETBridge v2.0 • Independent client. Not affiliated with ETLab or Etuwa Concepts.
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Duty Leave Modal mounted globally for mobile drawer */}
      <LogDutyLeaveModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
      />

      {/* Feedback Modal mounted globally for mobile drawer */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Install Modal mounted globally for mobile drawer */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </>
  )
}
