import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatIndianDate } from '../utils/format'
import { 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Check
} from 'lucide-react'

interface LogDutyLeaveModalProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: string
}

const QUICK_REASONS = [
  'NSS Special Camp',
  'Sports Tournament',
  'College Tech Fest Organizing',
  'Arts Fest / Cultural Event',
  'College Union Activity',
  'Department Symposium'
]

const PERIOD_TIMES: Record<number, string> = {
  1: '09:00 - 09:55 AM',
  2: '09:55 - 10:50 AM',
  3: '11:05 - 12:00 PM',
  4: '12:00 - 12:55 PM',
  5: '01:45 - 02:40 PM',
  6: '02:40 - 03:35 PM'
}

export const LogDutyLeaveModal: React.FC<LogDutyLeaveModalProps> = ({
  isOpen,
  onClose,
  initialDate
}) => {
  const { timetable, addPendingDutyLeave } = useAuth()

  const todayStr = new Date().toISOString().split('T')[0]
  const [reason, setReason] = useState('')
  const [date, setDate] = useState(initialDate || todayStr)
  const [selectedHours, setSelectedHours] = useState<number[]>([4, 5, 6])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  if (!isOpen) return null

  // Lookup scheduled periods for the chosen date
  const daySchedule = (timetable || []).find(d => d.date === date)?.sub || []
  const getSubjectForHour = (hourNum: number) => {
    const period = daySchedule.find(p => p.hour === hourNum)
    return period ? (period.subject_code || period.subject) : null
  }

  const toggleHour = (hourNum: number) => {
    setSelectedHours(prev => {
      if (prev.includes(hourNum)) {
        return prev.filter(h => h !== hourNum)
      } else {
        return [...prev, hourNum].sort((a, b) => a - b)
      }
    })
  }

  const selectPreset = (preset: 'all' | 'afternoon' | 'morning' | 'clear') => {
    if (preset === 'all') setSelectedHours([1, 2, 3, 4, 5, 6])
    else if (preset === 'afternoon') setSelectedHours([4, 5, 6])
    else if (preset === 'morning') setSelectedHours([1, 2, 3])
    else setSelectedHours([])
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!reason.trim()) {
      setError('Please provide a reason or event name.')
      return
    }

    if (!date) {
      setError('Please pick a valid date.')
      return
    }

    if (selectedHours.length === 0) {
      setError('Please select at least one hour of the day.')
      return
    }

    addPendingDutyLeave({
      reason: reason.trim(),
      date,
      hours: selectedHours.length,
      selectedHours: [...selectedHours].sort((a, b) => a - b),
      notes: notes.trim() || undefined
    })

    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 700)
  }

  const sortedSelected = [...selectedHours].sort((a, b) => a - b)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white dark:text-white light:text-slate-900 leading-tight">
                Log Pending Duty Leave
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                Toggle the exact hours missed to project your actual attendance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-5 md:p-6 space-y-4 text-xs overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Reason Chips */}
          <div>
            <label className="block font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5">
              Event / Activity Reason *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_REASONS.map((qr) => (
                <button
                  type="button"
                  key={qr}
                  onClick={() => setReason(qr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    reason === qr
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50'
                  }`}
                >
                  {qr}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. NSS Orientation Camp, Sports Tournament..."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1.5 flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Duty Leave Date *</span>
              </span>
              {date && (
                <span className="text-xs font-mono font-bold text-amber-400">
                  {formatIndianDate(date, 'day-short')}
                </span>
              )}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* Hour Selector with Toggleable Buttons & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Toggle Hours of the Day *</span>
              </label>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => selectPreset('all')}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  All (1–6)
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset('afternoon')}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  Afternoon (4–6)
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset('morning')}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  Morning (1–3)
                </button>
              </div>
            </div>

            {/* 6 Toggleable Hour Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((hourNum) => {
                const isSelected = selectedHours.includes(hourNum)
                const scheduledSub = getSubjectForHour(hourNum)
                const timeSlot = PERIOD_TIMES[hourNum]

                return (
                  <button
                    type="button"
                    key={hourNum}
                    onClick={() => toggleHour(hourNum)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black uppercase ${isSelected ? 'text-black font-extrabold' : 'text-white dark:text-white light:text-slate-900'}`}>
                        Hour {hourNum}
                      </span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-black text-amber-400 font-bold' : 'border border-zinc-700 text-transparent'
                      }`}>
                        ✓
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono block ${isSelected ? 'text-black/80' : 'text-zinc-400'}`}>
                      {timeSlot}
                    </span>

                    {scheduledSub && (
                      <span className={`text-[10px] font-semibold truncate block mt-1 ${
                        isSelected ? 'text-black/90 font-bold' : 'text-brand-400'
                      }`}>
                        {scheduledSub}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Selected Hours Summary Badge */}
            <div className="p-2.5 rounded-xl bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                Selected Periods:
              </span>
              <span className="text-xs font-bold text-amber-400 dark:text-amber-400 light:text-amber-700">
                {sortedSelected.length > 0 
                  ? `${sortedSelected.length} ${sortedSelected.length === 1 ? 'Hour' : 'Hours'} (Hour ${sortedSelected.join(', ')})`
                  : 'None selected (tap hours above to toggle)'}
              </span>
            </div>
          </div>


          {/* Notes (Optional) */}
          <div>
            <label className="block font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 mb-1">
              Submission Reference / Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Form signed by Staff Advisor, submitted to department..."
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-200 dark:text-zinc-200 light:text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Reassurance Banner */}
          <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-2.5 text-amber-200/90 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Self-Reported Simulation</p>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">
                Applies to Hours <strong>{sortedSelected.length > 0 ? sortedSelected.join(', ') : 'none'}</strong> on <strong>{formatIndianDate(date, 'short')}</strong>. Once faculty officially enters the duty leave in ETLab, ETBridge will automatically reconcile it.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved || selectedHours.length === 0}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Log Hours ({selectedHours.length}h)</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
