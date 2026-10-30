import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  CalendarDays, 
  Award, 
  FileText, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  FileQuestion, 
  Bell, 
  PieChart, 
  BookMarked,
  ChevronUp,
  HelpCircle
} from 'lucide-react'
import { DiscordProfileCard } from './DiscordProfileCard'
import { FeedbackModal } from './FeedbackModal'
import { formatSemester } from '../utils/format'

export const Sidebar: React.FC = () => {
  const { session, profile } = useAuth()
  const location = useLocation()

  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)

  const currentPath = location.pathname
  const currentSearch = location.search

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        popoverRef.current?.contains(target) ||
        cardContainerRef.current?.contains(target)
      ) {
        return
      }
      setShowProfilePopup(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowProfilePopup(false)
      }
    }
    if (showProfilePopup) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showProfilePopup])

  const navSections = [
    {
      title: 'Core',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Attendance', path: '/attendance', icon: PieChart },
        { label: 'Timetable', path: '/timetable', icon: CalendarDays },
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

  const isActive = (targetPath: string) => {
    if (targetPath.includes('?')) {
      return (currentPath + currentSearch) === targetPath
    }
    return currentPath === targetPath && !currentSearch
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

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-slate-50 border-r border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 p-3 select-none overflow-y-auto shrink-0 transition-colors">
        <div className="flex-1 space-y-4">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 light:text-slate-400 px-3 block mb-1">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        active
                          ? 'bg-brand-600/15 text-brand-300 dark:text-brand-300 light:text-brand-700 border border-brand-500/30 shadow-sm'
                          : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-zinc-900/60 dark:hover:bg-zinc-900/60 light:hover:bg-slate-200/70'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        active ? 'text-brand-400 dark:text-brand-400 light:text-brand-600' : 'text-zinc-500 dark:text-zinc-500 light:text-slate-400'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Faint "Something Missing?" Option */}
          <div className="pt-2 px-1">
            <button
              type="button"
              onClick={() => setShowFeedbackModal(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono text-zinc-500 hover:text-zinc-300 dark:text-zinc-500 dark:hover:text-zinc-300 light:text-slate-400 light:hover:text-slate-700 hover:bg-zinc-900/40 dark:hover:bg-zinc-900/40 light:hover:bg-slate-200/50 transition-colors text-left group"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-600 light:text-slate-400 group-hover:text-zinc-400 transition-colors" />
              <span>Something Missing?</span>
            </button>
          </div>
        </div>

        {/* Discord-Style Interactive Profile Tile at Bottom */}
        <div className="pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 mt-4 relative" ref={popoverRef}>
          {/* Discord Floating Profile Card rendered via Portal to avoid sidebar clipping */}
          {showProfilePopup && createPortal(
            <div 
              className="fixed inset-0 z-[100] flex items-end justify-start p-4 bg-black/30 md:bg-transparent"
              onClick={() => setShowProfilePopup(false)}
            >
              <div 
                ref={cardContainerRef}
                className="fixed bottom-20 left-4 z-[101] w-84 max-w-[calc(100vw-2rem)] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <DiscordProfileCard onClose={() => setShowProfilePopup(false)} />
              </div>
            </div>,
            document.body
          )}

          {/* Clickable Student Tile (Clicking opens Discord popup) */}
          <div
            onClick={() => setShowProfilePopup(prev => !prev)}
            className="p-2.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm flex items-center justify-between gap-2.5 cursor-pointer hover:border-brand-500/50 hover:bg-zinc-800/50 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  {studentInitials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900 dark:ring-zinc-900 light:ring-white" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white dark:text-white light:text-slate-900 truncate leading-tight group-hover:text-brand-300 transition-colors">
                  {studentName}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5 truncate">
                  <span className="font-mono font-bold text-brand-400">{instCode}</span>
                  <span>•</span>
                  <span className="truncate">{formatSemester(profile?.curnt_sem, 'Sem')}</span>
                </div>
              </div>
            </div>

            <ChevronUp className={`w-4 h-4 text-zinc-500 group-hover:text-brand-400 transition-transform ${
              showProfilePopup ? 'rotate-180 text-brand-400' : ''
            }`} />
          </div>
        </div>
      </aside>

      {/* Something Missing Feedback Modal */}
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </>
  )
}
