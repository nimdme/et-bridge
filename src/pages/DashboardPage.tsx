import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { etlabClient } from '../api/client'
import { AttendanceRing } from '../components/AttendanceRing'
import { BunkBadge } from '../components/BunkBadge'
import { SubjectAttendanceModal } from '../components/SubjectAttendanceModal'
import { AssignmentModal } from '../components/AssignmentModal'
import { LogDutyLeaveModal } from '../components/LogDutyLeaveModal'
import { FeedbackModal } from '../components/FeedbackModal'
import { SubjectAttendance, Assignment, DayTimetable, TimetablePeriod } from '../api/types'
import { parsePercent, parseNumber, formatPercent, getDaysRemaining, formatSemester, formatIndianDate } from '../utils/format'
import { calculateSubjectProjection } from '../utils/attendance'
import { downloadFileWithAuth } from '../utils/download'
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  ChevronRight,
  TrendingUp, 
  Bell,
  Sparkles,
  Award,
  BookMarked,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Zap,
  HelpCircle,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const { profile, attendance, session, timetable, courses, academicAnalysis, evaluations, pendingDutyLeaves, totalPendingDlHours } = useAuth()
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SubjectAttendance | null>(null)
  const [selectedAssignmentModal, setSelectedAssignmentModal] = useState<Assignment | null>(null)
  const [showDutyLeaveModal, setShowDutyLeaveModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [downloadingAsgId, setDownloadingAsgId] = useState<string | number | null>(null)
  const [semesterTimetable, setSemesterTimetable] = useState<DayTimetable[]>(() => timetable || [])

  const handleDownloadAssignmentPaper = async (asg: Assignment, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!asg.url) return
    setDownloadingAsgId(asg.id)
    try {
      await downloadFileWithAuth(
        asg.url,
        `${asg.subject_code}_Assignment_${(asg.title || 'Paper').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      )
    } catch (err) {
      console.error('Failed to download assignment PDF:', err)
      window.alert('Failed to download question paper. Please check connection and login session.')
    } finally {
      setDownloadingAsgId(null)
    }
  }

  // Deadlines calculation
  const allAssignments = evaluations?.assignments || []
  const pendingDeadlines = allAssignments
    .filter(asg => asg.status?.toUpperCase() !== 'SUBMITTED' && !asg.mark)
    .map(asg => {
      const days = getDaysRemaining(asg.last_date)
      let dueTimestamp = Infinity
      if (asg.last_date) {
        const parsed = new Date(asg.last_date.replace(' ', 'T')).getTime()
        if (!isNaN(parsed)) dueTimestamp = parsed
      }
      return { ...asg, daysInfo: days, dueTimestamp }
    })
    .sort((a, b) => a.dueTimestamp - b.dueTimestamp)

  const urgentDeadlinesCount = pendingDeadlines.filter(d => d.daysInfo.isUrgent || d.daysInfo.isOverdue).length

  useEffect(() => {
    let isMounted = true
    etlabClient.getSemesterTimetable().then(data => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setSemesterTimetable(data)
      }
    }).catch(console.warn)
    return () => { isMounted = false }
  }, [timetable])

  // Calculate Overall Bunk Buffer across all subjects
  const overallAttended = parseNumber(profile?.attendance?.classes_attended, 0)
  const overallTotal = parseNumber(profile?.attendance?.total_classes, 0)
  const rawOverallPercentage = profile?.attendance?.percentage != null
    ? parsePercent(profile.attendance.percentage, 0)
    : (overallTotal > 0 ? (overallAttended / overallTotal) * 100 : 0)
  const overallPercentage = parseFloat(rawOverallPercentage.toFixed(1))

  const projectedAttended = overallAttended + totalPendingDlHours
  const rawProjectedPercentage = overallTotal > 0 ? (projectedAttended / overallTotal) * 100 : rawOverallPercentage
  const projectedPercentage = parseFloat(Math.min(100, rawProjectedPercentage).toFixed(1))

  // Bunk formula for overall 75%:
  const canMissOverall = overallPercentage >= 75
    ? Math.max(0, Math.floor((overallAttended - 0.75 * overallTotal) / 0.75))
    : 0

  const mustAttendOverall = overallPercentage < 75
    ? Math.max(0, Math.ceil((0.75 * overallTotal - overallAttended) / 0.25))
    : 0

  // Time & Schedule calculation
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const timeInMinutes = currentHour * 60 + currentMinute

  // Normal college hours: 9:00 AM (540m) to 4:15 PM (975m)
  // Determine if college day is concluded
  const isPastCollegeHours = timeInMinutes >= 975 // After 4:15 PM

  const getLocalDateStr = (d: Date = new Date()) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayDateStr = getLocalDateStr(now)
  const todayDayName = now.toLocaleDateString('en-IN', { weekday: 'long' })

  // Find rich entry for today from monthly timetable first (has substitutions & status)
  const todaySchedule = timetable?.find(d => d.date === todayDateStr) || 
    semesterTimetable?.find(d => d.date === todayDateStr) ||
    timetable?.find(d => d.day?.toLowerCase() === todayDayName.toLowerCase())

  const todayClasses = (todaySchedule && todaySchedule.sub.length > 0)
    ? todaySchedule.sub
    : (profile?.timetable || [])

  // Tomorrow's classes resolution
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const tomorrowDateStr = getLocalDateStr(tomorrow)
  const tomorrowDayName = tomorrow.toLocaleDateString('en-IN', { weekday: 'long' })

  // Find tomorrow's timetable from monthly timetable if available
  const tomorrowSchedule = timetable?.find(d => d.date === tomorrowDateStr) || 
    semesterTimetable?.find(d => d.date === tomorrowDateStr) ||
    timetable?.find(d => d.day?.toLowerCase() === tomorrowDayName.toLowerCase())

  // Which schedule are we highlighting?
  const isShowingTomorrow = isPastCollegeHours && !!tomorrowSchedule && tomorrowSchedule.sub.length > 0
  const activeScheduleList: TimetablePeriod[] = (isShowingTomorrow && tomorrowSchedule) ? tomorrowSchedule.sub : todayClasses
  const scheduleDayLabel = isShowingTomorrow ? `Tomorrow's Schedule (${tomorrowDayName})` : "Today's Schedule"

  // Active period slot
  let activePeriodNumber = 0
  if (!isShowingTomorrow) {
    if (timeInMinutes >= 540 && timeInMinutes < 595) activePeriodNumber = 1
    else if (timeInMinutes >= 595 && timeInMinutes < 650) activePeriodNumber = 2
    else if (timeInMinutes >= 665 && timeInMinutes < 720) activePeriodNumber = 3
    else if (timeInMinutes >= 720 && timeInMinutes < 775) activePeriodNumber = 4
    else if (timeInMinutes >= 825 && timeInMinutes < 880) activePeriodNumber = 5
    else if (timeInMinutes >= 880 && timeInMinutes < 935) activePeriodNumber = 6
  }

  const activePeriod = activeScheduleList.find(p => p.hour === activePeriodNumber)
  const nextPeriod = isShowingTomorrow 
    ? activeScheduleList[0] 
    : activeScheduleList.find(p => p.hour > activePeriodNumber)

  // Deduplicate periods by hour to prevent repeating Hour 1 pills
  const uniquePeriodsMap = new Map<number, typeof activeScheduleList[0]>()
  activeScheduleList.forEach(p => {
    if (!uniquePeriodsMap.has(p.hour)) {
      uniquePeriodsMap.set(p.hour, p)
    }
  })
  const uniquePeriods = Array.from(uniquePeriodsMap.values()).sort((a, b) => a.hour - b.hour)

  // Quick stats
  const coursesAtRiskCount = academicAnalysis?.courses_at_risk?.length || 0

  return (
    <div className="w-full px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-28 md:pb-12 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Greeting & Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight truncate">
            Hello, {profile?.name ? profile.name.split(' ')[0] : session?.studentName || 'Student'} 👋
          </h1>
          <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-0.5 flex items-center gap-1.5 truncate">
            <span className="font-medium truncate">{profile?.course || 'Engineering'}</span>
            <span>•</span>
            <span className="font-semibold text-brand-400 shrink-0">
              {formatSemester(profile?.curnt_sem, 'Sem')}
            </span>
            {profile?.roll_no && (
              <>
                <span>•</span>
                <span className="font-mono text-zinc-400 shrink-0">Roll {profile.roll_no}</span>
              </>
            )}
          </div>
        </div>

        {/* Date Badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 px-3 py-1.5 rounded-xl shadow-sm shrink-0">
          <Calendar className="w-3.5 h-3.5 text-brand-400" />
          <span>
            {formatIndianDate(new Date(), 'day-short')}
          </span>
        </div>
      </div>

      {/* Quick Action Bar for Instant Access on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {/* Log Duty Leave Button */}
        <button
          type="button"
          onClick={() => setShowDutyLeaveModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-bold shrink-0 transition-all active:scale-95 shadow-sm"
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>+ Log Duty Leave</span>
          {totalPendingDlHours > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black">
              +{totalPendingDlHours}h
            </span>
          )}
        </button>

        {/* Full Schedule shortcut */}
        <Link
          to="/timetable"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white font-semibold shrink-0 transition-all active:scale-95"
        >
          <Calendar className="w-3.5 h-3.5 text-brand-400" />
          <span>Schedule</span>
        </Link>

        {/* Attendance shortcut */}
        <Link
          to="/attendance"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white font-semibold shrink-0 transition-all active:scale-95"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Attendance ({overallPercentage}%)</span>
        </Link>

        {/* Something Missing? mobile shortcut */}
        <button
          type="button"
          onClick={() => setShowFeedbackModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-slate-100 border border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-300 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-zinc-200 font-medium shrink-0 transition-all active:scale-95"
        >
          <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
          <span>Feedback</span>
        </button>
      </div>

      {/* Slim Academic Risk Warning Banner (Compact, non-intrusive) */}
      {coursesAtRiskCount > 0 && (
        <Link
          to="/analysis"
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-rose-950/30 dark:bg-rose-950/30 light:bg-rose-50 border border-rose-800/40 light:border-rose-200 text-xs text-rose-300 dark:text-rose-300 light:text-rose-900 hover:bg-rose-950/50 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate text-rose-200 dark:text-rose-200 light:text-rose-950">
                {coursesAtRiskCount} course{coursesAtRiskCount > 1 ? 's' : ''} at academic risk
              </p>
              <p className="text-[11px] text-rose-400/80 dark:text-rose-400/80 light:text-rose-700 truncate hidden xs:block">
                Attendance below 75% cutoff or low internal marks
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[11px] font-bold text-rose-400 dark:text-rose-400 light:text-rose-700 flex items-center gap-0.5 ml-2">
            <span>Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      )}

      {/* Top Hero Grid: Live Class Card & Attendance Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Timetable & Live Period Status */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-4 sm:p-6 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Header with High-Contrast Full Timetable Button */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {isShowingTomorrow ? "Tomorrow's Schedule" : activePeriod ? "Ongoing Class" : "Next Up"}
              </span>

              {/* High-Visibility Full Timetable Button */}
              <Link 
                to="/timetable" 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/20 hover:scale-[1.02]"
              >
                <span>Full Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Current or Next Up Hero Display */}
            {activePeriod ? (
              <div className="p-4 md:p-5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-brand-500/40 mb-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">
                        Period {activePeriod.hour} • Currently In Progress
                      </span>
                      {(activePeriod.change === 'substitution' || activePeriod.regular_subject) && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 dark:text-amber-300 light:text-amber-800">
                          Substitution
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-extrabold text-white dark:text-white light:text-slate-900 mt-1">
                      {activePeriod.subject}
                    </h3>
                    {(activePeriod.change === 'substitution' || activePeriod.regular_subject) && activePeriod.regular_subject && (
                      <p className="text-xs text-amber-400 dark:text-amber-300 light:text-amber-800 font-medium mt-1 flex items-center gap-1.5">
                        <span>was: <strong className="font-bold">{activePeriod.regular_subject}</strong></span>
                        {activePeriod.in_place_of && <span className="opacity-80"> (in place of {activePeriod.in_place_of})</span>}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-brand-300 dark:text-brand-300 light:text-brand-700 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 px-2 py-0.5 rounded border border-brand-800/40 light:border-brand-200">
                        {activePeriod.subject_code}
                      </span>
                      <span>•</span>
                      <span>Faculty: {activePeriod.teacher_name}</span>
                    </p>
                  </div>
                  {activePeriod.attendance_status && (
                    <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border shrink-0 ${
                      activePeriod.attendance_status === 'present'
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                        : activePeriod.attendance_status === 'absent'
                        ? 'bg-rose-950/80 border-rose-700 text-rose-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                    }`}>
                      {activePeriod.attendance_status}
                    </span>
                  )}
                </div>
              </div>
            ) : nextPeriod ? (
              <div className="p-4 md:p-5 rounded-2xl bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-300 mb-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500 uppercase tracking-wider">
                        {isShowingTomorrow ? `Tomorrow • Hour ${nextPeriod.hour}` : `Next Period • Hour ${nextPeriod.hour}`}
                      </span>
                      {(nextPeriod.change === 'substitution' || nextPeriod.regular_subject) && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 dark:text-amber-300 light:text-amber-800">
                          Substitution
                        </span>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white dark:text-white light:text-slate-900 mt-1">
                      {nextPeriod.subject}
                    </h3>
                    {(nextPeriod.change === 'substitution' || nextPeriod.regular_subject) && nextPeriod.regular_subject && (
                      <p className="text-xs text-amber-400 dark:text-amber-300 light:text-amber-800 font-medium mt-1 flex items-center gap-1.5">
                        <span>was: <strong className="font-bold">{nextPeriod.regular_subject}</strong></span>
                        {nextPeriod.in_place_of && <span className="opacity-80"> (in place of {nextPeriod.in_place_of})</span>}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1.5 flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700">{nextPeriod.subject_code}</span>
                      <span>•</span>
                      <span>Faculty: {nextPeriod.teacher_name}</span>
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-white px-2.5 py-1 rounded-lg border border-zinc-700 dark:border-zinc-700 light:border-slate-300">
                    Upcoming
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-300 mb-4 text-center">
                <p className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-semibold">
                  All classes concluded for today
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-500 mt-1">
                  Enjoy your evening or prepare for upcoming coursework and exams!
                </p>
              </div>
            )}

            {/* Clean Periods Rail (Fixed Hour Listing & Highlighted Current) */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-semibold mb-2">
                <span>{scheduleDayLabel}</span>
                <span>{uniquePeriods.length} hours scheduled</span>
              </div>

              <div className="flex items-stretch gap-2 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-6 sm:overflow-visible">
                {uniquePeriods.map((period) => {
                  const isCurrent = period.hour === activePeriodNumber
                  const isPresent = period.attendance_status === 'present'
                  const isAbsent = period.attendance_status === 'absent'
                  const isSub = period.change === 'substitution' || !!period.regular_subject

                  return (
                    <div
                      key={period.hour}
                      title={`${period.subject} - ${period.teacher_name}${isSub && period.regular_subject ? ` (Substitution for ${period.regular_subject})` : ''}`}
                      className={`p-2.5 rounded-2xl border text-center transition-all min-w-[105px] sm:min-w-0 flex-1 flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-brand-600/25 dark:bg-brand-600/25 light:bg-brand-50 border-brand-500 text-white dark:text-white light:text-brand-900 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/50'
                          : isSub
                          ? 'bg-amber-950/20 dark:bg-amber-950/20 light:bg-amber-50/60 border-amber-500/40 text-zinc-300 dark:text-zinc-300 light:text-slate-700'
                          : 'bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider block ${
                          isCurrent ? 'text-brand-400' : 'text-zinc-500 dark:text-zinc-500 light:text-slate-400'
                        }`}>
                          Hour {period.hour}
                        </span>
                        {isSub && (
                          <span className="text-[8px] font-extrabold uppercase px-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Sub
                          </span>
                        )}
                      </div>

                      {/* Display full clean subject code rather than truncated digits */}
                      <span className="text-xs font-bold block truncate mt-1 text-white dark:text-white light:text-slate-900">
                        {period.subject_code || period.subject}
                      </span>

                      {/* Period Subject name subtext */}
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 block truncate mt-0.5">
                        {period.subject.split(' ')[0]}
                      </span>

                      {/* Attendance indicator */}
                      <span className="text-[10px] mt-1.5 block">
                        {isPresent ? (
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">Present</span>
                        ) : isAbsent ? (
                          <span className="text-rose-400 font-bold bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40">Absent</span>
                        ) : (
                          <span className="text-zinc-500 dark:text-zinc-500 light:text-slate-400 font-medium">—</span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Attendance Hero with Quick Link to Details */}
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-sm">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
              Overall Attendance
            </span>
            <Link
              to="/attendance"
              className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-0.5 transition-colors"
            >
              <span>Full Details</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* SVG Ring */}
          <div className="py-1 sm:py-2">
            <AttendanceRing
              percentage={overallPercentage}
              attended={overallAttended}
              total={overallTotal}
              size={135}
              strokeWidth={11}
            />
          </div>

          {/* Bunk Buffer Badge & Link */}
          <div className="w-full mt-2 space-y-2">
            <BunkBadge
              percentage={overallPercentage}
              canMiss={canMissOverall}
              mustAttend={mustAttendOverall}
              target={75}
              size="md"
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400">
              {overallAttended} of {overallTotal} total periods recorded
            </p>
            {totalPendingDlHours > 0 && (
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Projected: {projectedPercentage}% (+{totalPendingDlHours}h pending DL)</span>
                </span>
              </div>
            )}

            {/* Direct Quick Action Buttons inside Card 2 */}
            <div className="w-full pt-2 flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowDutyLeaveModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold transition-all active:scale-95"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Duty Leave</span>
              </button>

              <Link
                to="/attendance"
                className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold transition-all active:scale-95"
              >
                <span>By Subject</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Upcoming Deadlines & Action Items */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2">
                <span>Upcoming Deadlines</span>
                {urgentDeadlinesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950/80 border border-rose-700 text-rose-300 animate-pulse">
                    {urgentDeadlinesCount} Urgent
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                Assignment submissions and coursework deadlines tracked in real-time
              </p>
            </div>
          </div>

          <Link
            to="/academics?tab=assignments"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Assignments ({allAssignments.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingDeadlines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {pendingDeadlines.slice(0, 3).map((asg) => {
              const days = asg.daysInfo
              const isUrgent = days.isUrgent || days.isOverdue

              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAssignmentModal(asg)}
                  className="glass-panel rounded-2xl p-4 md:p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/50 cursor-pointer transition-all flex flex-col justify-between shadow-sm group hover:-translate-y-0.5 relative overflow-hidden"
                >
                  {isUrgent && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div>
                    {/* Header: Subject Code & Countdown Pill */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded-md">
                        {asg.subject_code}
                      </span>

                      {days.text && (
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border shrink-0 ${
                            isUrgent
                              ? 'bg-rose-950/90 border-rose-700 text-rose-300 shadow-sm animate-pulse'
                              : 'bg-amber-950/70 border-amber-800/80 text-amber-300'
                          }`}
                        >
                          {days.text}
                        </span>
                      )}
                    </div>

                    {/* Course Title */}
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600 line-clamp-1">
                      {asg.subject_name || asg.subject}
                    </p>

                    {/* Assignment Title */}
                    <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 group-hover:text-brand-300 transition-colors mt-1 line-clamp-2 leading-snug">
                      {asg.title}
                    </h3>
                  </div>

                  {/* Footer Row: Due Date & Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="truncate">Due {asg.last_date ? formatIndianDate(asg.last_date, 'numeric') : 'Soon'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* PDF Question Paper download button if available */}
                      {asg.url && (
                        <button
                          type="button"
                          onClick={(e) => handleDownloadAssignmentPaper(asg, e)}
                          disabled={downloadingAsgId === asg.id}
                          title="Download Assignment Question Paper PDF"
                          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 light:bg-slate-100 light:hover:bg-slate-200 border border-zinc-700 dark:border-zinc-700 light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700 transition-colors disabled:opacity-50"
                        >
                          <Download className={`w-3.5 h-3.5 ${downloadingAsgId === asg.id ? 'animate-bounce text-brand-400' : ''}`} />
                        </button>
                      )}

                      {/* Direct Submit/Open button */}
                      <button
                        type="button"
                        onClick={() => setSelectedAssignmentModal(asg)}
                        className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm shadow-brand-500/20"
                      >
                        <span>Submit</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                  All caught up! No pending deadlines
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                  All assignment coursework and reports for your registered subjects have been submitted.
                </p>
              </div>
            </div>

            <Link
              to="/academics?tab=assignments"
              className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 light:bg-slate-100 light:hover:bg-slate-200 text-zinc-200 dark:text-zinc-200 light:text-slate-800 border border-zinc-700 dark:border-zinc-700 light:border-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span>View History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards: Attendance, Courses, Analysis, Exams */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Link
          to="/attendance"
          className="p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              %
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 block">Attendance & Calendar</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">By-course stats & dates</span>
          </div>
        </Link>

        <Link
          to="/courses"
          className="p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold">
              <BookMarked className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-400 transition-colors" />
          </div>
          <div>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 block">Courses & Syllabus</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">Topics, outcomes & books</span>
          </div>
        </Link>

        <Link
          to="/analysis"
          className="p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <div>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 block">Academic Analysis</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">CGPA, risk & performance</span>
          </div>
        </Link>

        <Link
          to="/academics?tab=exams"
          className="p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/40 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 block">Exams & Assignments</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-500">Series 1 & 2, downloads</span>
          </div>
        </Link>
      </div>

      {/* Section: Subject Attendance Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
              Subject Attendance & Bunk Allowance
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              Live Safe bunk calculation calibrated against the 75% KTU minimum criteria
            </p>
          </div>
          <Link
            to="/attendance"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid of Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendance && attendance.length > 0 ? (
            attendance.map((sub) => {
              const per = parsePercent(sub.percentage, 0)
              const target = parseNumber(sub.attendance_target, 75)
              const canMiss = parseNumber(sub.can_miss_hours, 0)
              const mustAttend = parseNumber(sub.must_attend_hours, 0)

              // Projected stats with pending duty leaves
              const proj = calculateSubjectProjection(sub, pendingDutyLeaves, timetable, target)

              let barColor = 'bg-emerald-500'
              if (per < 75) barColor = 'bg-rose-500'
              else if (per < 80) barColor = 'bg-amber-500'

              return (
                <div
                  key={sub.code || sub.key}
                  onClick={() => setSelectedSubjectModal(sub)}
                  className="glass-panel rounded-2xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/50 cursor-pointer transition-all flex flex-col justify-between shadow-sm group hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-brand-400 font-mono uppercase bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded-md">
                        {sub.code || sub.display_code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-white dark:text-white light:text-slate-900">
                          {formatPercent(per)}%
                        </span>
                        {proj.pendingDlHours > 0 && (
                          <span 
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800/70 px-1.5 py-0.5 rounded-md shadow-sm"
                            title={`Projected: ${formatPercent(proj.projectedPercentage)}% with ${proj.pendingDlHours}h pending DL`}
                          >
                            <Zap className="w-2.5 h-2.5 text-amber-400" />
                            <span>{formatPercent(proj.projectedPercentage)}%</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 dark:text-zinc-100 light:text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-300 transition-colors">
                      {sub.subject}
                    </h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 truncate">
                      {sub.teacher_name}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-2">
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 overflow-hidden mb-3">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, Math.max(0, per))}%` }}
                      />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                        Attended: <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">{parseNumber(sub.class_attended)}</strong> / {parseNumber(sub.total_classes)}
                        {proj.pendingDlHours > 0 && (
                          <span className="ml-1 text-amber-400 text-[11px] font-semibold">(+{proj.pendingDlHours} DL)</span>
                        )}
                      </span>
                      {parseNumber(sub.absent_hours) > 0 && (
                        <span className="text-rose-400 text-[11px] font-semibold">
                          {parseNumber(sub.absent_hours)} missed
                        </span>
                      )}
                    </div>

                    {/* Bunk margin badge */}
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

                    {/* Absent dates drilldown prompt */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-brand-400 group-hover:text-brand-300 pt-1 transition-colors">
                      <span>View absent dates & topics</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No attendance records available for this semester</p>
            </div>
          )}
        </div>
      </div>

      {/* Section: Recent Notices Preview */}
      {profile?.notices && profile.notices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-400" />
              <span>Campus Announcements</span>
            </h2>
            <Link to="/notices" className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white flex items-center gap-1 transition-colors">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.notices.slice(0, 2).map((notice) => (
              <div
                key={notice.id}
                className="glass-panel rounded-2xl p-4 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 mb-1.5">
                    <span>{notice.posted_by || 'Notice Board'}</span>
                    <span>{notice.date ? formatIndianDate(notice.date, 'numeric') : ''}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mb-1.5">{notice.title}</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 line-clamp-2 leading-relaxed">{notice.content}</p>
                </div>
              </div>
            ))}
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

      {/* Assignment Modal for submitting & viewing details directly from Dashboard */}
      {selectedAssignmentModal && (
        <AssignmentModal
          assignment={selectedAssignmentModal}
          onClose={() => setSelectedAssignmentModal(null)}
        />
      )}

      {/* Duty Leave Logging Modal for Mobile and Quick Access */}
      <LogDutyLeaveModal
        isOpen={showDutyLeaveModal}
        onClose={() => setShowDutyLeaveModal(false)}
      />

      {/* Something Missing Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}
