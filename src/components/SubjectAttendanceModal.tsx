import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { SubjectAttendance, TimetablePeriod, DayTimetable } from '../api/types'
import { parsePercent, parseNumber, formatPercent, formatIndianDate } from '../utils/format'
import { calculateSubjectProjection } from '../utils/attendance'
import { BunkBadge } from './BunkBadge'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  AlertTriangle,
  BookOpen,
  Filter,
  CheckCircle,
  TrendingUp,
  Layers,
  Zap
} from 'lucide-react'

interface SubjectAttendanceModalProps {
  subject: SubjectAttendance | null
  timetableHistory: DayTimetable[]
  onClose: () => void
}

interface ClassRecord {
  date: string
  day: string
  hour: number
  subject_name?: string
  subject_code?: string
  teacher_name?: string
  attendance_status: string
  covered_topics?: string[]
  change?: string
  regular_subject?: string
  in_place_of?: string
}

export const SubjectAttendanceModal: React.FC<SubjectAttendanceModalProps> = ({
  subject,
  timetableHistory,
  onClose
}) => {
  const { pendingDutyLeaves } = useAuth()
  const [filterMode, setFilterMode] = useState<'absent' | 'present' | 'all'>('absent')

  if (!subject) return null

  const percentage = parsePercent(subject.percentage, 0)
  const attended = parseNumber(subject.class_attended, 0)
  const total = parseNumber(subject.total_classes, 0)
  const absentHours = parseNumber(subject.absent_hours, Math.max(0, total - attended))
  const target = parseNumber(subject.attendance_target, 75)
  const canMiss = parseNumber(subject.can_miss_hours, 0)
  const mustAttend = parseNumber(subject.must_attend_hours, 0)

  // Calculate projected stats with pending duty leaves
  const proj = calculateSubjectProjection(subject, pendingDutyLeaves, timetableHistory, target)

  // Standard period times (approx)
  const periodTimes: Record<number, string> = {
    1: '09:00 - 09:55 AM',
    2: '09:55 - 10:50 AM',
    3: '11:05 - 12:00 PM',
    4: '12:00 - 12:55 PM',
    5: '01:45 - 02:40 PM',
    6: '02:40 - 03:35 PM'
  }

  // Helper to normalize course codes (e.g. "GMEST103" / "gmest103" / " GMEST-103 ")
  const cleanCode = (val?: string) => (val || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().trim()

  // Helper to normalize subject title text for comparison
  const normalizeSubject = (val?: string) =>
    (val || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const targetCode = cleanCode(subject.code || subject.display_code)
  const targetName = normalizeSubject(subject.subject)

  const allRecords: ClassRecord[] = []
  timetableHistory.forEach(dayEntry => {
    if (Array.isArray(dayEntry.sub)) {
      dayEntry.sub.forEach(p => {
        const pCode = cleanCode(p.subject_code)
        const pName = normalizeSubject(p.subject)
        const pRegularName = normalizeSubject(p.regular_subject)

        // Strict Matching:
        // 1. Primary match by exact course code (e.g. GMEST103 === GMEST103)
        // 2. Or exact subject title match if codes are missing
        // 3. Or if this period was a substitution replacing this target subject
        let isMatch = false
        if (targetCode && pCode) {
          isMatch = (pCode === targetCode)
        } else if (targetName && pName) {
          isMatch = (pName === targetName)
        }

        // Also check if this period was a substitution replacing this target subject
        if (!isMatch && targetName && pRegularName) {
          isMatch = (pRegularName === targetName)
        }

        if (isMatch) {
          allRecords.push({
            date: dayEntry.date,
            day: dayEntry.day,
            hour: p.hour,
            subject_name: p.subject,
            subject_code: p.subject_code,
            teacher_name: p.teacher_name || subject.teacher_name,
            attendance_status: p.attendance_status || 'not_marked',
            covered_topics: p.covered_topics || [],
            change: p.change,
            regular_subject: p.regular_subject,
            in_place_of: p.in_place_of
          })
        }
      })
    }
  })

  // Sort descending by date, then by hour
  allRecords.sort((a, b) => {
    const dComp = b.date.localeCompare(a.date)
    if (dComp !== 0) return dComp
    return b.hour - a.hour
  })

  // Separate absent vs present
  const absentRecords = allRecords.filter(r => r.attendance_status === 'absent')
  const presentRecords = allRecords.filter(r => r.attendance_status === 'present')

  const displayedRecords =
    filterMode === 'absent' ? absentRecords :
    filterMode === 'present' ? presentRecords :
    allRecords

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-mono text-xs font-bold text-brand-400 bg-brand-950/70 dark:bg-brand-950/70 light:bg-brand-50 border border-brand-800/40 px-2 py-0.5 rounded">
                {subject.code || subject.display_code}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-100 px-2 py-0.5 rounded border border-zinc-700/60 dark:border-zinc-700/60 light:border-slate-300">
                {subject.subject_type || 'Theory'}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-extrabold text-white dark:text-white light:text-slate-900 leading-snug">
              {subject.subject}
            </h3>

            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>{subject.teacher_name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Summary Card with Bunk Badge & Metrics */}
          <div className="p-4 md:p-5 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Attendance</span>
                <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                  <span className="text-3xl font-black text-white dark:text-white light:text-slate-900">
                    {formatPercent(percentage)}%
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    ({attended} of {total} classes attended)
                  </span>
                  {proj.pendingDlHours > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-800/70 px-2.5 py-0.5 rounded-full shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Projected: {formatPercent(proj.projectedPercentage)}% (+{proj.pendingDlHours}h DL)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Absents</span>
                <p className="text-xl font-black text-rose-400 mt-0.5">
                  {absentHours} {absentHours === 1 ? 'hour' : 'hours'} missed
                </p>
              </div>
            </div>

            {/* Bunk Allowance Indicator */}
            <div className="pt-2 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
              <BunkBadge
                percentage={percentage}
                canMiss={canMiss}
                mustAttend={mustAttend}
                projectedCanMiss={proj.projectedCanMiss}
                projectedMustAttend={proj.projectedMustAttend}
                pendingDlHours={proj.pendingDlHours}
                projectedSafe={proj.isProjectedSafe}
                target={target}
                size="md"
              />
            </div>
          </div>

          {/* Filter Navigation: Absent Records vs Present vs All */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300">
              <button
                onClick={() => setFilterMode('absent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterMode === 'absent'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Absent Dates ({absentRecords.length})</span>
              </button>

              <button
                onClick={() => setFilterMode('present')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterMode === 'present'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Attended ({presentRecords.length})</span>
              </button>

              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterMode === 'all'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
                }`}
              >
                All History ({allRecords.length})
              </button>
            </div>
          </div>

          {/* Records Timeline List */}
          <div className="space-y-3">
            {displayedRecords.length > 0 ? (
              displayedRecords.map((record, idx) => {
                const isAbsent = record.attendance_status === 'absent'
                const isPresent = record.attendance_status === 'present'
                const timeSlot = periodTimes[record.hour] || `Hour ${record.hour}`

                const matchingPendingDL = isAbsent && pendingDutyLeaves.find(p => {
                  if (p.reconciled) return false
                  if (p.date !== record.date) return false
                  // Check if this specific hour was toggled/claimed for duty leave
                  if (Array.isArray(p.selectedHours) && p.selectedHours.length > 0) {
                    if (!p.selectedHours.includes(record.hour)) return false
                  }
                  if (p.subject_code) {
                    return cleanCode(p.subject_code) === cleanCode(subject.code || subject.display_code)
                  }
                  return true
                })

                // Format friendly Indian date (e.g. "Thu, 24 Oct 2026")
                const formattedDate = formatIndianDate(record.date, 'day-short')

                return (
                  <div
                    key={`${record.date}-${record.hour}-${idx}`}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAbsent
                        ? 'bg-rose-950/25 dark:bg-rose-950/25 light:bg-rose-50 border-rose-800/40 dark:border-rose-800/40 light:border-rose-200'
                        : 'bg-zinc-950/50 dark:bg-zinc-950/50 light:bg-slate-50 border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Date and Hour */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-brand-400" />
                            <span>{formattedDate}</span>
                          </span>

                          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>Hour {record.hour} ({timeSlot})</span>
                          </span>
                        </div>

                        {record.teacher_name && (
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
                            <span>Faculty: <strong className="text-zinc-300 dark:text-zinc-300 light:text-slate-800 font-semibold">{record.teacher_name}</strong></span>
                            {record.teacher_name !== subject.teacher_name && !record.change && !record.in_place_of && (
                              <span className="text-[10px] text-zinc-500 italic">(Hour instructor)</span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Status Tag */}
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                        isAbsent
                          ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                          : isPresent
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      }`}>
                        {record.attendance_status}
                      </span>
                    </div>

                    {/* Self-Reported Duty Leave Indicator */}
                    {matchingPendingDL && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Self-Reported Duty Leave: {matchingPendingDL.reason} (Hour {record.hour}, pending faculty entry)</span>
                        </span>
                      </div>
                    )}

                    {/* Substitution indicator */}
                    {(record.change === 'substitution' || record.regular_subject || record.in_place_of) && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200 flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 border border-amber-500/40 text-amber-400 dark:text-amber-300 light:text-amber-800 flex items-center gap-1">
                          <span>🔄 Substitution</span>
                        </span>
                        {record.regular_subject && (
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                            was: <strong className="text-zinc-300 dark:text-zinc-200 light:text-slate-800">{record.regular_subject}</strong>
                          </span>
                        )}
                        {record.in_place_of && (
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                            (in place of <strong className="text-zinc-300 dark:text-zinc-200 light:text-slate-800">{record.in_place_of}</strong>)
                          </span>
                        )}
                        {record.subject_name && record.subject_name !== subject.subject && (
                          <span className="text-[11px] text-amber-400/90 font-medium">
                            • Held: {record.subject_name}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Covered Topics in this Session */}
                    {record.covered_topics && record.covered_topics.length > 0 ? (
                      <div className="mt-3 pt-2.5 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-slate-200">
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                          isAbsent ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {isAbsent ? 'Topics Missed:' : 'Topics Covered:'}
                        </span>
                        <ul className="space-y-1 text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                          {record.covered_topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-brand-400 font-bold">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 italic">
                        Topics not logged for this hour
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="py-12 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p className="text-xs font-semibold text-white">No {filterMode} sessions recorded</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {filterMode === 'absent'
                    ? 'Congratulations! You have not missed any recorded classes for this course.'
                    : 'No attendance records match the selected filter.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
