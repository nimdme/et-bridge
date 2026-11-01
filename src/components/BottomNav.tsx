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
  Award,
  FileText,
  BookMarked,
  TrendingUp,
  Users,
  BookOpen,
  Sparkles,
  CreditCard,
  ShieldCheck,
  FileQuestion,
  Bell,
  Clock,
  HelpCircle,
  Smartphone,
  Sun,
  Moon,
  LogOut,
  ChevronRight
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
  const { session, profile, totalPendingDlHours, academicAnalysis, logout } = useAuth()
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

  const currentFullPath = location.pathname + location.search
  const secondaryPaths = ['/courses', '/analysis', '/campus', '/notices']
  const isSecondaryActive = secondaryPaths.includes(location.pathname)

  // 4 Regular items + 1 Center Accent Button
  const leftItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/attendance', label: 'Attendance', icon: PieChart },
  ]

  const rightItems = [
    { to: '/timetable', label: 'Schedule', icon: CalendarDays },
    { to: '/academics', label: 'Academics', icon: GraduationCap },
  ]

  // Exact sections matching desktop Sidebar.tsx for 1:1 parity and easy maintenance
  const navSections = [
    {
      title: 'Core',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Attendance', path: '/attendance', icon: PieChart },
        { label: 'Class Timetable', path: '/timetable', icon: CalendarDays },
      ]
    },
    {
      title: 'Academics',
      items: [
        { label: 'Examinations', path: '/academics?tab=exams', icon: Award },
        { label: 'Assignments', path: '/academics?tab=assignments', icon: FileText },
        { label: 'Courses & Syllabus', path: '/courses', icon: BookMarked },
        { label: 'Academic Analysis', path: '/analysis', icon: TrendingUp },
        { label: 'Faculty Directory', path: '/academics?tab=teachers', icon: Users },
        { label: 'Study Notes', path: '/academics?tab=materials', icon: BookOpen },
      ]
    },
    {
      title: 'Campus Life',
      items: [
        { label: 'Activity Points', path: '/campus?tab=points', icon: Sparkles },
        { label: 'Fees & No Dues', path: '/campus?tab=fees', icon: CreditCard },
        { label: 'Duty Leaves', path: '/campus?tab=duty', icon: ShieldCheck },
        { label: 'Surveys', path: '/campus?tab=surveys', icon: FileQuestion },
      ]
    },
    {
      title: 'Notice Board',
      items: [
        { label: 'Notices & Circulars', path: '/notices', icon: Bell },
      ]
    }
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

  const isItemActive = (path: string) => {
    if (path.includes('?')) {
      return currentFullPath === path
    }
    return location.pathname === path
  }

  return (
    <>
      <nav 
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 backdrop-blur-md border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 px-3 pt-1.5 md:hidden transition-colors shadow-lg"
      >
        <div className="flex items-end justify-between max-w-md mx-auto relative">
          {/* Left 2 Items: Home, Attendance */}
          <div className="flex items-center justify-around flex-1">
            {leftItems.map((item) => {
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
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>

          {/* Center: Accent Elevated Water Drop / Inverted Notch Menu Button */}
          <div className="relative -top-4 flex flex-col items-center shrink-0 px-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
              className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-200 shadow-xl ${
                isSecondaryActive || isMenuOpen
                  ? 'bg-gradient-to-tr from-brand-500 via-indigo-500 to-brand-600 text-white shadow-brand-500/50 scale-105 ring-4 ring-zinc-950 dark:ring-zinc-950 light:ring-white'
                  : 'bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-500 text-white shadow-brand-600/35 ring-4 ring-zinc-950 dark:ring-zinc-950 light:ring-white hover:scale-105 active:scale-95'
              }`}
            >
              <Menu className={`w-5 h-5 text-white transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} />
              {totalPendingDlHours > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-zinc-950 animate-pulse" />
              )}
            </button>
            <span className={`text-[10px] mt-0.5 font-bold tracking-tight ${
              isSecondaryActive || isMenuOpen ? 'text-brand-400' : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600'
            }`}>
              Menu
            </span>
          </div>

          {/* Right 2 Items: Schedule, Academics */}
          <div className="flex items-center justify-around flex-1">
            {rightItems.map((item) => {
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
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Sheet - Mirrors Desktop Sidebar */}
      {isMenuOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 md:hidden"
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
                className="p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Sidebar List (Identical to Desktop Sidebar) */}
            <div className="p-4 space-y-5 overflow-y-auto">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 mb-1.5">
                    {section.title}
                  </h4>
                  <div className="space-y-0.5">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon
                      const active = isItemActive(item.path)
                      return (
                        <button
                          key={itemIdx}
                          type="button"
                          onClick={() => handleNavigate(item.path)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? 'bg-brand-600/15 dark:bg-brand-600/15 light:bg-brand-50 text-brand-400 dark:text-brand-400 light:text-brand-600 font-bold shadow-sm'
                              : 'text-zinc-400 dark:text-zinc-400 light:text-slate-700 hover:text-zinc-200 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${active ? 'text-brand-400' : 'text-zinc-500'}`} />
                            <span>{item.label}</span>
                          </div>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Quick Actions & Utilities */}
              <div className="pt-2 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setShowLogModal(true)
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs font-bold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>+ Log Pending Duty Leave</span>
                  </div>
                  {totalPendingDlHours > 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200">
                      +{totalPendingDlHours}h Pending
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setShowInstallModal(true)
                    }}
                    className="p-2.5 rounded-xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:bg-zinc-800/60 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                    <span>Install App</span>
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

                {/* Something Missing? Faint feedback button matching desktop sidebar */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setShowFeedbackModal(true)
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-500 light:text-slate-500 hover:text-zinc-300 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Something Missing?</span>
                </button>
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

      {/* Duty Leave Modal mounted globally */}
      <LogDutyLeaveModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
      />

      {/* Feedback Modal mounted globally */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Install Modal mounted globally */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </>
  )
}
