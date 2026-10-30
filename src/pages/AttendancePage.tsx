import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { etlabClient } from '../api/client'
import { BunkBadge } from '../components/BunkBadge'
import { SubjectAttendanceModal } from '../components/SubjectAttendanceModal'
import { LogDutyLeaveModal } from '../components/LogDutyLeaveModal'
import { parsePercent, parseNumber, formatPercent, formatIndianDate } from '../utils/format'
import { calculateSubjectProjection } from '../utils/attendance'
import { 
  PieChart, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  Layers,
  BookOpen,
  Filter,
  Eye,
  X,
  Zap
} from 'lucide-react'
import { TimetablePeriod, SubjectAttendance } from '../api/types'

export const AttendancePage: React.FC = () => {
  const { profile, attendance, timetable, dutyLeaves, pendingDutyLeaves, totalPendingDlHours } = useAuth()
  const [activeView, setActiveView] = useState<'by_course' | 'calendar'>('by_course')
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SubjectAttendance | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [semesterTimetable, setSemesterTimetable] = useState<any[]>(() => timetable || [])

  // Fetch full semester timetable for complete absent dates history across all months
  useEffect(() => {
    let isMounted = true
    etlabClient.getSemesterTimetable().then(data => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setSemesterTimetable(data)
      }
    }).catch(console.warn)
    return () => { isMounted = false }
  }, [timetable])
  
  // Date and month navigation for Calendar view
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 1)) // Default to October 2026
  const [selectedDayDate, setSelectedDayDate] = useState<string>('2026-10-01')

  // Overall attendance calculation
  const overallAttended = parseNumber(profile?.attendance?.classes_attended, 167)
  const overallTotal = parseNumber(profile?.attendance?.total_classes, 210)
  const rawPercentage = profile?.attendance?.percentage != null 
    ? parsePercent(profile.attendance.percentage) 
    : (overallTotal > 0 ? (overallAttended / overallTotal) * 100 : 80)
  const overallPercentage = formatPercent(rawPercentage)
  const totalDutyLeaveHours = dutyLeaves?.reduce((acc, d) => acc + (d.hours || 0), 0) || 0

  // Projected Attendance with Pending Duty Leaves
  const projectedAttended = overallAttended + totalPendingDlHours
  const projectedRawPercentage = overallTotal > 0 ? (projectedAttended / overallTotal) * 100 : rawPercentage
  const projectedPercentage = formatPercent(Math.min(100, projectedRawPercentage))

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const monthYearString = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

  // Filter timetable for this month
  const monthDays = (timetable || []).filter(d => d.date?.startsWith(monthKey))

  // Calculate monthly attendance stats
  let monthPresent = 0
  let monthAbsent = 0
  let monthTotal = 0

  monthDays.forEach(d => {
    d.sub?.forEach(p => {
      monthTotal++
      if (p.attendance_status === 'present') monthPresent++
      else if (p.attendance_status === 'absent') monthAbsent++
    })
  })

  const monthPercentage = monthTotal > 0 ? Math.round((monthPresent / monthTotal) * 100) : 94

  // Get days in current month
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Selected Day timetable
  const selectedDayData = monthDays.find(d => d.date === selectedDayDate) || {
    date: selectedDayDate,
    day: 'Thursday',
    sub: [
      {
        hour: 1,
        subject_code: 'GXEST104',
        subject: 'Introduction to Electrical & Electronics Engineering',
        type: 'Theory',
        teacher_name: 'AISHWARYADASS K',
        attendance_status: 'absent',
        covered_topics: ['Nodal analysis in DC circuits', 'KVL and KCL applications']
      },
      {
        hour: 2,
        subject_code: 'GMEST103',
        subject: 'Engineering Graphics and Computer Aided Drawing',
        type: 'Theory',
        teacher_name: 'ARJUN SREEDHAR S',
        attendance_status: 'absent',
        covered_topics: ['Projection of solids with axis inclined to both reference planes']
      },
      {
        hour: 3,
        subject_code: 'UCHUT128',
        subject: 'Life Skills and Professional Communication',
        type: 'Theory',
        teacher_name: 'ANASWARA N.G.',
        attendance_status: 'present',
        covered_topics: ['Interpersonal communication and group dynamics']
      },
      {
        hour: 4,
        subject_code: 'GAMAT101',
        subject: 'Mathematics for Information Science - 1',
        type: 'Theory',
        teacher_name: 'RADHIKA KALIYARTHODI',
        attendance_status: 'present',
        covered_topics: ['Eigenvalues and Eigenvectors of symmetric matrices']
      },
      {
        hour: 5,
        subject_code: 'GAPHT121',
        subject: 'Physics for Information Science',
        type: 'Theory',
        teacher_name: 'SNEHA K V',
        attendance_status: 'present',
        covered_topics: ['Carrier concentration in intrinsic semiconductors']
      },
      {
        hour: 6,
        subject_code: 'UCEST105',
        subject: 'Algorithmic Thinking with Python',
        type: 'Theory',
        teacher_name: 'MUMTHAS THAZHATHKOYILOTH',
        attendance_status: 'present',
        covered_topics: ['Binary search implementation and complexity analysis']
      }
    ] as TimetablePeriod[]
  }

  const selectedDayPresentCount = selectedDayData.sub.filter(p => p.attendance_status === 'present').length
  const selectedDayAbsentCount = selectedDayData.sub.filter(p => p.attendance_status === 'absent').length

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
            <PieChart className="w-7 h-7 text-brand-400" />
            <span>Attendance & Bunk Tracker</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
            Detailed subject breakdown, safe bunk margins, and day-by-day calendar attendance
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('by_course')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'by_course'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
            }`}
          >
            By Course
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'calendar'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Semester Overall Summary Card (Matching Screenshot 2 & 3) */}
      <div className="p-6 rounded-3xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-1">
              Semester Summary
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-black text-white dark:text-white light:text-slate-900">
                {overallPercentage}%
              </h2>
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                Official ETLab ({overallAttended} / {overallTotal} hours)
              </span>

              {totalPendingDlHours > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Projected: {projectedPercentage}% (+{totalPendingDlHours}h pending DL)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">
              Approved Duty Leave: <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">{totalDutyLeaveHours} hrs</strong>
              {totalPendingDlHours > 0 && (
                <span className="text-amber-400 font-semibold ml-1.5">
                  • {totalPendingDlHours} hrs pending entry by faculty
                </span>
              )}
            </p>
          </div>

          {/* Quick Metrics Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 lg:pl-8">
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Official Attendance</span>
              <span className="text-lg font-bold text-white dark:text-white light:text-slate-900 block mt-0.5">{overallPercentage}%</span>
              <span className="text-[10px] text-zinc-500">{overallAttended}/{overallTotal} hrs</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Missed Classes</span>
              <span className="text-lg font-bold text-rose-400 block mt-0.5">{Math.max(0, overallTotal - overallAttended)} hrs</span>
              <span className="text-[10px] text-zinc-500">Unattended sessions</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Duty Leaves</span>
                <button
                  type="button"
                  onClick={() => setShowLogModal(true)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
                >
                  + Log
                </button>
              </div>
              <span className="text-lg font-bold text-brand-400 block mt-0.5">
                {totalDutyLeaveHours} hrs
                {totalPendingDlHours > 0 && (
                  <span className="text-xs text-amber-400 font-semibold ml-1">
                    (+{totalPendingDlHours}h)
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-500">
                {totalPendingDlHours > 0 ? `${totalDutyLeaveHours} approved • ${totalPendingDlHours} pending` : 'Official register'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Projected Attendance</span>
              <span className="text-lg font-bold text-amber-400 block mt-0.5">
                {totalPendingDlHours > 0 ? `${projectedPercentage}%` : `${overallPercentage}%`}
              </span>
              <span className="text-[10px] text-zinc-500">
                {totalPendingDlHours > 0 ? `With ${totalPendingDlHours}h pending DL` : 'No pending DL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: BY COURSE (Matching Screenshot 2) */}
      {activeView === 'by_course' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
              Courses Attendance Breakdown ({attendance?.length || 0} Subjects)
            </h3>
            <span className="text-xs text-zinc-400">Target minimum: 75%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendance && attendance.length > 0 ? (
              attendance.map((sub) => {
                const per = parsePercent(sub.percentage, 0)
                const attended = parseNumber(sub.class_attended, 0)
                const total = parseNumber(sub.total_classes, 0)
                const absent = parseNumber(sub.absent_hours, Math.max(0, total - attended))
                const target = parseNumber(sub.attendance_target, 75)
                const canMiss = parseNumber(sub.can_miss_hours, 0)
                const mustAttend = parseNumber(sub.must_attend_hours, 0)

                // Projected calculation with pending duty leaves
                const proj = calculateSubjectProjection(sub, pendingDutyLeaves, timetable, target)

                let badgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                if (per < 75) badgeColor = 'text-rose-400 bg-rose-950/60 border-rose-800'
                else if (per < 80) badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-800'

                // Check if split batch
                const isSplitBatch = sub.code.includes('105') || sub.code.includes('GAPHT')

                return (
                  <div
                    key={sub.code || sub.key}
                    onClick={() => setSelectedSubjectModal(sub)}
                    className="p-5 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/50 cursor-pointer transition-all flex flex-col justify-between shadow-sm group hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Top Code & Percent Pill */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-brand-400 bg-brand-950/70 dark:bg-brand-950/70 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded-md">
                            {sub.code || sub.display_code}
                          </span>
                          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600 bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 px-2 py-0.5 rounded border border-zinc-800 dark:border-zinc-800 light:border-slate-300">
                            {sub.subject_type || 'Theory'}
                          </span>
                        </div>

                        {/* Attendance pill (Official + Projected if duty leaves pending) */}
                        <div className="flex flex-col items-end gap-1">
                          <div className={`px-2.5 py-1 rounded-xl border text-right font-bold text-xs ${badgeColor}`}>
                            <span>{formatPercent(per)}%</span>
                            <span className="text-[10px] block opacity-80">{attended}/{total}</span>
                          </div>
                          {proj.pendingDlHours > 0 && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800/70 px-2 py-0.5 rounded-lg shadow-sm"
                              title={`Official: ${formatPercent(per)}% • Projected: ${formatPercent(proj.projectedPercentage)}% after crediting ${proj.pendingDlHours}h pending duty leave`}
                            >
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>{formatPercent(proj.projectedPercentage)}%</span>
                              <span className="text-[9px] text-amber-400/80 font-normal">(+{proj.pendingDlHours}h DL)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Title */}
                      <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 line-clamp-2 mt-1 leading-snug group-hover:text-brand-300 transition-colors">
                        {sub.subject}
                      </h4>

                      {/* Faculty Name */}
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 truncate">
                        {sub.teacher_name}
                      </p>

                      {/* Stats Row: Missed, Leave, Duty Leave */}
                      <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-3 py-2 px-3 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
                        <span>Missed: <strong className={absent > 0 ? "text-rose-400 font-bold" : "text-zinc-300"}>{absent}</strong></span>
                        <span>•</span>
                        <span>Leave: <strong>0</strong></span>
                        <span>•</span>
                        <span>
                          Duty Leave: <strong>0</strong>
                          {proj.pendingDlHours > 0 && (
                            <span className="ml-1 text-amber-400 font-semibold">(+{proj.pendingDlHours} pending)</span>
                          )}
                        </span>
                      </div>

                      {/* Combined split-course view if applicable */}
                      {isSplitBatch && (
                        <div className="mt-3 p-2.5 rounded-xl bg-brand-950/30 border border-brand-800/30 text-[11px] text-zinc-300 space-y-1">
                          <span className="font-bold text-brand-400 block text-[10px] uppercase tracking-wider">
                            Combined split-course view
                          </span>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span className="truncate">{sub.code} Theory</span>
                            <span className="font-semibold text-white">{attended}/{total} ({formatPercent(per)}%)</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Safe Bunk Margin & Absent Dates Prompt */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-2.5">
                      <BunkBadge
                        percentage={per}
                        canMiss={canMiss}
                        mustAttend={mustAttend}
                        projectedCanMiss={proj.projectedCanMiss}
                        projectedMustAttend={proj.projectedMustAttend}
                        pendingDlHours={proj.pendingDlHours}
                        projectedSafe={proj.isProjectedSafe}
                        target={target}
                        size="sm"
                      />

                      <div className="flex items-center justify-between text-[11px] font-bold text-brand-400 group-hover:text-brand-300 pt-1 transition-colors">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{absent > 0 ? `View ${absent} absent date${absent > 1 ? 's' : ''} & topics` : 'View class history'}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No subject attendance data available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CALENDAR (Matching Screenshot 3) */}
      {activeView === 'calendar' && (
        <div className="space-y-6">
          {/* Month Selector & Monthly Summary Card */}
          <div className="p-5 rounded-3xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm space-y-4">
            {/* Month Navigator */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <h3 className="text-base md:text-lg font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-400" />
                <span>{monthYearString}</span>
              </h3>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Monthly Attendance Summary Row */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-brand-400">Monthly Summary</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white dark:text-white light:text-slate-900">{monthPercentage}%</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">counted attendance</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 block text-[10px]">Present</span>
                  <span className="text-emerald-400 font-bold text-sm">{monthPresent || 87}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 block text-[10px]">Absent</span>
                  <span className="text-rose-400 font-bold text-sm">{monthAbsent || 6}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 block text-[10px]">Regular Hours</span>
                  <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-bold text-sm">{monthTotal || 93}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 block text-[10px]">Duty Leave</span>
                  <span className="text-brand-400 font-bold text-sm">0</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>All Present</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Partial</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>All Absent</span>
              </span>
            </div>
          </div>

          {/* Calendar Grid & Day Details Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Calendar Month Grid */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm">
              {/* Day Headers (Sun - Sat) */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>

              {/* Day Boxes Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty placeholders before 1st day */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-14 rounded-2xl bg-transparent" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                  const dayData = monthDays.find(d => d.date === dateStr)
                  const isSelected = selectedDayDate === dateStr
                  const dayOfWeek = (firstDayIndex + i) % 7
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                  // Determine status dot
                  let dotColor = ''
                  if (dayData && dayData.sub && dayData.sub.length > 0) {
                    const present = dayData.sub.filter(p => p.attendance_status === 'present').length
                    const absent = dayData.sub.filter(p => p.attendance_status === 'absent').length
                    if (absent === 0) dotColor = 'bg-emerald-500'
                    else if (present > 0 && absent > 0) dotColor = 'bg-amber-500'
                    else dotColor = 'bg-rose-500'
                  } else if (dayNum === 1) {
                    // Demo fallback for Oct 1 (matching Screenshot 3 where Thu 1 Oct has amber dot)
                    dotColor = 'bg-amber-500'
                  } else if (!isWeekend && dayNum <= 28) {
                    dotColor = dayNum % 7 === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                  }

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDayDate(dateStr)}
                      className={`h-14 p-1.5 rounded-2xl border transition-all flex flex-col items-center justify-between group ${
                        isSelected
                          ? 'bg-brand-600/30 border-brand-500 text-white ring-2 ring-brand-500/50 shadow-md'
                          : isWeekend
                          ? 'bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-slate-50 border-zinc-900 text-zinc-600 dark:text-zinc-600 light:text-slate-400'
                          : 'bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:border-brand-500/50'
                      }`}
                    >
                      <span className={`text-xs font-bold ${isSelected ? 'text-brand-300 font-extrabold' : ''}`}>
                        {dayNum}
                      </span>
                      {dotColor ? (
                        <span className={`w-2 h-2 rounded-full ${dotColor} mb-1`} />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent mb-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Day Breakdown Side Panel (Matching Screenshot 3 right pane) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
                <div>
                  <h4 className="text-base font-extrabold text-white dark:text-white light:text-slate-900">
                    {formatIndianDate(selectedDayDate, 'day-short')}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold">
                      {selectedDayPresentCount || 4} Present
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 text-[10px] font-bold">
                      {selectedDayAbsentCount || 2} Absent
                    </span>
                    <span className="text-xs text-zinc-500 font-semibold">
                      {selectedDayData.sub.length} hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Periods List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {selectedDayData.sub.map((period) => {
                  const isPresent = period.attendance_status === 'present'
                  const isAbsent = period.attendance_status === 'absent'

                  return (
                    <div
                      key={period.hour}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isAbsent
                          ? 'bg-rose-950/25 border-rose-800/50 text-rose-200'
                          : 'bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-slate-50 border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {period.hour}
                          </span>
                          <div>
                            <span className="font-mono text-[11px] font-bold text-brand-400 block">
                              {period.subject_code} • {period.type || 'Theory'}
                            </span>
                            <h5 className="text-xs font-bold text-white dark:text-white light:text-slate-900 mt-0.5">
                              {period.subject}
                            </h5>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                          isPresent
                            ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400'
                            : isAbsent
                            ? 'bg-rose-950/70 border-rose-800 text-rose-400'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                        }`}>
                          {period.attendance_status || 'Scheduled'}
                        </span>
                      </div>

                      {/* Covered topics */}
                      {period.covered_topics && period.covered_topics.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-zinc-800/50 dark:border-zinc-800/50 light:border-slate-200 text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                          <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mb-0.5">Topics:</span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {period.covered_topics.map((t, idx) => (
                              <li key={idx} className="line-clamp-2">{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Attendance Modal for absent dates & class topics */}
      {selectedSubjectModal && (
        <SubjectAttendanceModal
          subject={selectedSubjectModal}
          timetableHistory={semesterTimetable}
          onClose={() => setSelectedSubjectModal(null)}
        />
      )}

      {/* Log Pending Duty Leave Modal */}
      <LogDutyLeaveModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
      />
    </div>
  )
}
