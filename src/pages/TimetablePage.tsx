import React, { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatIndianDate } from '../utils/format'
import { 
  CalendarDays, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertTriangle
} from 'lucide-react'

export const TimetablePage: React.FC = () => {
  const { timetable, profile, loading } = useAuth()

  // Helper for safe local YYYY-MM-DD
  const getLocalDateStr = (d: Date = new Date()) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayDateStr = getLocalDateStr(new Date())

  // State for week offset (0 = current week, -1 = last week, +1 = next week)
  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr)

  // Standard period times
  const periodTimes: Record<number, string> = {
    1: '09:00 - 09:55 AM',
    2: '09:55 - 10:50 AM',
    3: '11:05 - 12:00 PM',
    4: '12:00 - 12:55 PM',
    5: '01:45 - 02:40 PM',
    6: '02:40 - 03:35 PM'
  }

  // Calculate the 6 days (Mon-Sat) for the active weekOffset
  const currentWeekDays = useMemo(() => {
    const now = new Date()
    // Shift by weekOffset weeks
    now.setDate(now.getDate() + weekOffset * 7)

    const day = now.getDay() // 0 = Sun, 1 = Mon...
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1)

    const monday = new Date(now)
    monday.setDate(diffToMonday)

    const days = []
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = getLocalDateStr(d)
      const dayName = d.toLocaleDateString('en-IN', { weekday: 'long' })
      const shortDay = d.toLocaleDateString('en-IN', { weekday: 'short' })
      const dayNum = d.getDate()
      const isToday = dateStr === todayDateStr

      days.push({
        dateStr,
        dayName,
        shortDay,
        dayNum,
        isToday,
        dateObj: d
      })
    }
    return days
  }, [weekOffset, todayDateStr])

  // Resolve active schedule for selectedDate
  const activeDayEntry = useMemo(() => {
    if (!timetable || timetable.length === 0) return null
    return timetable.find(d => d.date === selectedDate)
  }, [timetable, selectedDate])

  const selectedDayInfo = useMemo(() => {
    return currentWeekDays.find(d => d.dateStr === selectedDate) || {
      dateStr: selectedDate,
      dayName: new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long' }),
      shortDay: new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short' }),
      dayNum: new Date(selectedDate).getDate(),
      isToday: selectedDate === todayDateStr
    }
  }, [currentWeekDays, selectedDate, todayDateStr])

  // Fallback to profile timetable if selected day is today or day-of-week match
  const displayPeriods = useMemo(() => {
    if (activeDayEntry && Array.isArray(activeDayEntry.sub) && activeDayEntry.sub.length > 0) {
      return activeDayEntry.sub
    }
    // Fallback: match by day name from monthly timetable
    const byDayName = (timetable || []).filter(d => d.day?.toLowerCase() === selectedDayInfo.dayName?.toLowerCase())
    if (byDayName.length > 0) {
      return byDayName[byDayName.length - 1].sub
    }
    // Final fallback to profile
    if (selectedDayInfo.isToday && profile?.timetable) {
      return profile.timetable
    }
    return []
  }, [activeDayEntry, timetable, selectedDayInfo, profile])

  const substitutionsCount = displayPeriods.filter(p => p.change === 'substitution' || p.regular_subject).length

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-brand-400" />
            <span>Class Timetable</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
            Period-by-period schedule with live faculty substitutions and attendance status
          </p>
        </div>

        {/* Week Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 p-1 rounded-2xl shadow-sm">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              title="Previous Week"
              className="p-1.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setWeekOffset(0)
                setSelectedDate(todayDateStr)
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                weekOffset === 0 && selectedDate === todayDateStr
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Today
            </button>

            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              title="Next Week"
              className="p-1.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Days Selector Bar */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2">
        {currentWeekDays.map((d) => {
          const isSelected = d.dateStr === selectedDate
          // Check if this day has any substitutions in timetable
          const matchingEntry = timetable?.find(t => t.date === d.dateStr)
          const hasSub = matchingEntry?.sub?.some(p => p.change === 'substitution' || p.regular_subject)
          const isSuspended = matchingEntry?.all_hours_suspended || matchingEntry?.sub?.every(p => p.suspended)

          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              className={`p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all relative flex flex-col items-center justify-between gap-0.5 sm:gap-1 ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20 ring-1 sm:ring-2 ring-brand-500/30'
                  : 'bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {/* Day Name & Today dot */}
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <span>{d.shortDay}</span>
                {d.isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} />
                )}
              </div>

              {/* Day Number */}
              <span className={`text-sm sm:text-lg font-black ${
                isSelected ? 'text-white' : 'text-zinc-100 dark:text-zinc-100 light:text-slate-900'
              }`}>
                {d.dayNum}
              </span>

              {/* Status / Substitution badge on day pill */}
              <div className="h-3.5 sm:h-4 flex items-center justify-center">
                {hasSub ? (
                  <span className={`text-[8px] sm:text-[9px] font-extrabold px-1 sm:px-1.5 py-0.2 rounded-full uppercase ${
                    isSelected 
                      ? 'bg-amber-300 text-amber-950 font-black' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    Sub
                  </span>
                ) : isSuspended ? (
                  <span className={`text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.2 rounded-full uppercase ${
                    isSelected ? 'bg-rose-300 text-rose-950' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    Off
                  </span>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Day Status Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <span>{selectedDayInfo.dayName}, {formatIndianDate(selectedDate, 'short')}</span>
              {selectedDayInfo.isToday && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              {displayPeriods.length} periods scheduled
              {substitutionsCount > 0 && (
                <span className="text-amber-400 font-semibold ml-2">
                  • {substitutionsCount} faculty substitution{substitutionsCount > 1 ? 's' : ''} active
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Day Suspension Banner (if all hours suspended) */}
      {activeDayEntry?.all_hours_suspended && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-200">All Classes Suspended for this Day</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
              College holiday or institutional suspension. Regular academic periods will resume next working day.
            </p>
          </div>
        </div>
      )}

      {/* Timeline of Periods */}
      <div className="space-y-4">
        {displayPeriods && displayPeriods.length > 0 ? (
          displayPeriods.map((period, idx) => {
            const timeSlot = periodTimes[period.hour] || `Hour ${period.hour}`
            const status = period.attendance_status
            const isSub = period.change === 'substitution' || !!period.regular_subject
            const isSpecial = period.change === 'special'
            const isSuspended = period.suspended

            let statusBadge = (
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-500 light:text-slate-500 px-2.5 py-1 rounded-full bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300">
                Scheduled
              </span>
            )

            if (status === 'present') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Present</span>
                </span>
              )
            } else if (status === 'absent') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/70 border border-rose-800/60 px-2.5 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </span>
              )
            } else if (status === 'duty_leave') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 bg-purple-950/70 border border-purple-800/60 px-2.5 py-1 rounded-full">
                  <span>Duty Leave</span>
                </span>
              )
            } else if (isSuspended) {
              statusBadge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2.5 py-1 rounded-full">
                  <span>Suspended</span>
                </span>
              )
            }

            return (
              <div key={`${period.hour}-${idx}`} className="flex gap-3 sm:gap-4 group">
                {/* Timeline Left: Hour & Vertical Guide Line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex flex-col items-center justify-center font-black text-xs sm:text-sm border transition-all ${
                    isSub
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm'
                      : 'bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700'
                  }`}>
                    <span className="text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-500 light:text-slate-400 leading-none">Hr</span>
                    <span className="leading-tight mt-0.5">{period.hour}</span>
                  </div>
                  <div className="w-0.5 flex-1 bg-zinc-800/80 dark:bg-zinc-800/80 light:bg-slate-200 my-2 group-last:hidden" />
                </div>

                {/* Main Card */}
                <div className={`flex-1 mb-2 rounded-2xl p-4 md:p-5 glass-panel border transition-all relative overflow-hidden shadow-sm ${
                  isSub
                    ? 'border-amber-500/40 hover:border-amber-500/70'
                    : 'border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-zinc-700'
                }`}>
                  {isSub && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      {/* Code, Subject Type & Time Slot Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold uppercase text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded">
                          {period.subject_code || 'LAB / OTHER'}
                        </span>

                        {(period.subject_type || period.type) && (
                          <span className="text-[11px] font-semibold text-brand-300 dark:text-brand-300 light:text-brand-700 bg-brand-500/10 px-2 py-0.5 rounded">
                            {period.subject_type || period.type}
                          </span>
                        )}

                        <span className="text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {timeSlot}
                        </span>
                      </div>

                      {/* Subject Title */}
                      <h3 className="text-base md:text-lg font-bold text-white dark:text-white light:text-slate-900 leading-snug">
                        {period.subject}
                      </h3>

                      {/* Faculty Name */}
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{period.teacher_name || 'Faculty'}</span>
                      </p>
                    </div>

                    {/* Attendance status badge */}
                    <div className="self-start sm:self-center shrink-0">
                      {statusBadge}
                    </div>
                  </div>

                  {/* SUBSTITUTION BADGE & WAS ROW (Matches user screenshot) */}
                  {isSub && (
                    <div className="mt-3.5 pt-3 border-t border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shadow-sm shrink-0">
                        Substitution
                      </span>
                      {period.regular_subject && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                          was: <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-semibold">{period.regular_subject}</strong>
                          {period.in_place_of && (
                            <span className="opacity-80"> (in place of {period.in_place_of})</span>
                          )}
                        </span>
                      )}
                    </div>
                  )}

                  {/* SPECIAL CLASS BADGE */}
                  {isSpecial && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-500/15 border border-purple-500/40 text-purple-400 shadow-sm">
                        Special Class
                      </span>
                    </div>
                  )}

                  {/* SUSPENDED BADGE */}
                  {isSuspended && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-sm">
                        Suspended: {period.suspension_reason || 'Holiday'}
                      </span>
                    </div>
                  )}

                  {/* Covered topics (if any recorded) */}
                  {period.covered_topics && period.covered_topics.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/70 dark:border-zinc-800/70 light:border-slate-200 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                      <strong className="text-zinc-300 dark:text-zinc-300 light:text-slate-700">Topics Covered: </strong>
                      <span>{period.covered_topics.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-16 text-center text-zinc-500 glass-panel rounded-3xl border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
            <p className="text-base font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-800">
              No scheduled periods for {selectedDayInfo.dayName}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-500 mt-1">
              Enjoy your day off or review lecture notes and upcoming assignments!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
