import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { downloadFileWithAuth } from '../utils/download'
import { formatPercent } from '../utils/format'
import { 
  Search, 
  X, 
  LayoutDashboard, 
  CalendarDays, 
  GraduationCap, 
  Users, 
  FileText, 
  Award, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  ExternalLink, 
  Phone, 
  Mail,
  ArrowRight,
  Sparkles,
  BookOpen,
  Download
} from 'lucide-react'

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    closeCommandPalette, 
    teachers, 
    materials, 
    attendance 
  } = useAuth()
  
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  // Pre-defined navigation targets
  const navigationItems = [
    { label: 'Today’s Overview & Schedule', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard', keywords: 'home today current class schedule' },
    { label: 'Attendance & Safe Bunk Tracker', category: 'Navigation', icon: CalendarDays, path: '/attendance', keywords: 'attendance bunk safe margin calendar missed percent' },
    { label: 'Timetable & Class Routine', category: 'Navigation', icon: CalendarDays, path: '/timetable', keywords: 'timetable periods routine calendar schedule' },
    { label: 'Courses & Syllabus Hub', category: 'Academics', icon: BookOpen, path: '/courses', keywords: 'courses syllabus topics outcomes source books textbooks curriculum' },
    { label: 'Academic Analysis & Risk Assessment', category: 'Academics', icon: Award, path: '/analysis', keywords: 'academic analysis cgpa sgpa risk radar credit backlogs progression' },
    { label: 'Examinations (Series 1 & 2)', category: 'Academics', icon: Award, path: '/academics?tab=exams', keywords: 'series exam marks internals evaluation tests model' },
    { label: 'Assignments & Submissions', category: 'Academics', icon: FileText, path: '/academics?tab=assignments', keywords: 'assignments homework submissions due upload pdf' },
    { label: 'Faculty & Advisor Directory', category: 'Academics', icon: Users, path: '/academics?tab=teachers', keywords: 'teachers staff advisor hod faculty contact phone email' },
    { label: 'Lecture Notes & Study Materials', category: 'Academics', icon: BookOpen, path: '/academics?tab=materials', keywords: 'notes study materials pdf module download' },
    { label: 'University Exam Results & SGPA', category: 'Academics', icon: GraduationCap, path: '/academics?tab=results', keywords: 'results university ktu exam sgpa cgpa grades' },
    { label: 'KTU Activity Points', category: 'Campus', icon: Sparkles, path: '/campus?tab=points', keywords: 'activity points 100 nss techfest certificate' },
    { label: 'Semester Fees & No Dues', category: 'Campus', icon: CreditCard, path: '/campus?tab=fees', keywords: 'fees installments payment balance receipts dues' },
    { label: 'Duty Leaves & Permissions', category: 'Campus', icon: ShieldCheck, path: '/campus?tab=duty', keywords: 'duty leave exemption attendance hours' },
    { label: 'Faculty Feedback Surveys', category: 'Campus', icon: FileText, path: '/campus?tab=surveys', keywords: 'surveys evaluation feedback form' },
    { label: 'Campus Notices & Circulars', category: 'Notice Board', icon: Bell, path: '/notices', keywords: 'notices circulars announcements pdf' },
  ]

  const q = query.toLowerCase().trim()

  // Filter navigation
  const matchingNav = navigationItems.filter(item => 
    !q || 
    item.label.toLowerCase().includes(q) || 
    item.keywords.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  )

  // Filter teachers
  const matchingTeachers = (teachers || []).filter(t =>
    q && (
      t.name.toLowerCase().includes(q) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.role_label && t.role_label.toLowerCase().includes(q))
    )
  )

  // Filter materials
  const matchingMaterials = (materials || []).filter(m =>
    q && (
      m.title.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      (m.file_name && m.file_name.toLowerCase().includes(q))
    )
  )

  // Filter subjects / attendance
  const matchingSubjects = (attendance || []).filter(s =>
    q && (
      s.subject.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.display_code && s.display_code.toLowerCase().includes(q))
    )
  )

  const handleSelectNav = (path: string) => {
    closeCommandPalette()
    navigate(path)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={closeCommandPalette}
    >
      <div 
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-brand-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search faculty, notes, timetable, fees, or anything..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={closeCommandPalette}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 max-h-[60vh] divide-y divide-zinc-800/40">
          {/* 1. Direct Faculty Matches */}
          {matchingTeachers.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-3 block mb-1">
                Faculty Members
              </span>
              <div className="space-y-1">
                {matchingTeachers.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/70 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{t.name}</span>
                        {t.role_label && (
                          <span className="text-[10px] font-semibold text-brand-400 bg-brand-950/60 border border-brand-800/40 px-1.5 py-0.5 rounded">
                            {t.role_label}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{t.subject || 'Faculty'}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {t.phone && (
                        <a
                          href={`tel:${t.phone}`}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-brand-300 text-xs flex items-center gap-1"
                          title="Call Teacher"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {t.email && (
                        <a
                          href={`mailto:${t.email}`}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1"
                          title="Email Teacher"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Direct Study Notes Matches */}
          {matchingMaterials.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-3 block mb-1">
                Study Materials & Notes
              </span>
              <div className="space-y-1">
                {matchingMaterials.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const url = m.link || m.file_name
                      if (url) {
                        downloadFileWithAuth(url, `${m.subject}_${m.title}.pdf`).catch(console.error)
                        closeCommandPalette()
                      }
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/70 transition-colors group"
                  >
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                        {m.title}
                      </span>
                      <p className="text-[11px] text-zinc-400">{m.subject} • Module {m.module}</p>
                    </div>
                    <span className="text-xs text-brand-400 flex items-center gap-1 shrink-0 font-medium">
                      <span>Download</span>
                      <Download className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Direct Subject / Attendance Matches */}
          {matchingSubjects.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-3 block mb-1">
                Course Attendance
              </span>
              <div className="space-y-1">
                {matchingSubjects.map(s => (
                  <div
                    key={s.code}
                    onClick={() => handleSelectNav('/dashboard')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/70 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-brand-400 bg-brand-950/60 px-1.5 py-0.5 rounded mr-2">
                        {s.code}
                      </span>
                      <span className="text-xs font-bold text-white">{s.subject}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-400">
                        {formatPercent(s.percentage)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Navigation Targets */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-3 block mb-1">
              Actions & Navigation
            </span>
            <div className="space-y-0.5">
              {matchingNav.map((item, i) => {
                const Icon = item.icon
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectNav(item.path)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-zinc-800/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 group-hover:text-brand-400 group-hover:bg-brand-950/60 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors block">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-zinc-500">{item.category}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/80 text-[11px] text-zinc-500 flex items-center justify-between px-4">
          <span>Type to instantly find any faculty, note, or college service</span>
          <span className="hidden sm:inline-block font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  )
}
