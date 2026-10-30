import { SubjectAttendance, PendingDutyLeave, DayTimetable } from '../api/types'
import { parseNumber, parsePercent } from './format'

export interface SubjectProjection {
  currentAttended: number
  totalClasses: number
  currentPercentage: number
  pendingDlHours: number
  projectedAttended: number
  projectedPercentage: number
  currentCanMiss: number
  currentMustAttend: number
  projectedCanMiss: number
  projectedMustAttend: number
  isCurrentlySafe: boolean
  isProjectedSafe: boolean
  target: number
}

/**
 * Calculates how many pending duty leave hours apply to a given subject.
 * Matches by date + hour against timetable periods, or by subject code.
 */
export function getPendingDlHoursForSubject(
  subject: SubjectAttendance,
  pendingDutyLeaves: PendingDutyLeave[],
  timetable?: DayTimetable[] | null
): number {
  if (!pendingDutyLeaves || pendingDutyLeaves.length === 0) return 0

  const cleanCode = (c?: string) => (c || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const cleanName = (n?: string) => (n || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

  const targetCode = cleanCode(subject.code || subject.display_code)
  const targetName = cleanName(subject.subject)

  let matchedHours = 0

  for (const pdl of pendingDutyLeaves) {
    if (pdl.reconciled) continue

    const hoursToInspect = (Array.isArray(pdl.selectedHours) && pdl.selectedHours.length > 0)
      ? pdl.selectedHours
      : []

    const dayEntry = timetable?.find(d => d.date === pdl.date)

    if (dayEntry && hoursToInspect.length > 0) {
      for (const h of hoursToInspect) {
        const period = dayEntry.sub?.find(p => p.hour === h)
        if (period) {
          const pCode = cleanCode(period.subject_code)
          const pName = cleanName(period.subject)

          const matchesSubject = (targetCode && pCode && targetCode === pCode) ||
            (targetName && pName && (targetName === pName || targetName.includes(pName) || pName.includes(targetName)))

          if (matchesSubject) {
            matchedHours++
          }
        }
      }
    } else {
      // Fallback: If no timetable entry or selectedHours, match by pdl.subject_code if present
      if (pdl.subject_code && targetCode && cleanCode(pdl.subject_code) === targetCode) {
        matchedHours += (pdl.hours || 1)
      }
    }
  }

  return matchedHours
}

/**
 * Computes official and projected attendance stats and bunk margins (can miss vs must attend)
 * for a subject, taking into account target attendance percentage (default: 75%).
 */
export function calculateSubjectProjection(
  subject: SubjectAttendance,
  pendingDutyLeaves: PendingDutyLeave[] = [],
  timetable?: DayTimetable[] | null,
  overrideTarget?: number
): SubjectProjection {
  const currentAttended = parseNumber(subject.class_attended, 0)
  const totalClasses = parseNumber(subject.total_classes, 0)
  const target = overrideTarget ?? parseNumber(subject.attendance_target, 75)
  const currentPercentage = totalClasses > 0 ? (currentAttended / totalClasses) * 100 : parsePercent(subject.percentage, 0)

  const pendingDlHours = getPendingDlHoursForSubject(subject, pendingDutyLeaves, timetable)
  const projectedAttended = Math.min(totalClasses > 0 ? totalClasses : currentAttended + pendingDlHours, currentAttended + pendingDlHours)
  const projectedPercentage = totalClasses > 0 ? (projectedAttended / totalClasses) * 100 : currentPercentage

  const tFrac = target / 100

  // 1. Current Bunk margins
  let currentCanMiss = 0
  let currentMustAttend = 0
  const isCurrentlySafe = currentPercentage >= target

  if (totalClasses > 0) {
    if (isCurrentlySafe) {
      currentCanMiss = Math.max(0, Math.floor(currentAttended / tFrac - totalClasses))
    } else {
      currentMustAttend = Math.max(0, Math.ceil((tFrac * totalClasses - currentAttended) / (1 - tFrac)))
    }
  }

  // 2. Projected Bunk margins with pending duty leave
  let projectedCanMiss = 0
  let projectedMustAttend = 0
  const isProjectedSafe = projectedPercentage >= target

  if (totalClasses > 0) {
    if (isProjectedSafe) {
      projectedCanMiss = Math.max(0, Math.floor(projectedAttended / tFrac - totalClasses))
    } else {
      projectedMustAttend = Math.max(0, Math.ceil((tFrac * totalClasses - projectedAttended) / (1 - tFrac)))
    }
  }

  return {
    currentAttended,
    totalClasses,
    currentPercentage,
    pendingDlHours,
    projectedAttended,
    projectedPercentage,
    currentCanMiss,
    currentMustAttend,
    projectedCanMiss,
    projectedMustAttend,
    isCurrentlySafe,
    isProjectedSafe,
    target
  }
}
