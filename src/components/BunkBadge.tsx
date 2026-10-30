import React from 'react'
import { CheckCircle2, ShieldAlert, Zap } from 'lucide-react'
import { parsePercent, parseNumber } from '../utils/format'

export interface BunkBadgeProps {
  percentage: number | string
  canMiss: number | string
  mustAttend: number | string
  target?: number
  size?: 'sm' | 'md' | 'lg'
  projectedMustAttend?: number
  projectedCanMiss?: number
  pendingDlHours?: number
  projectedSafe?: boolean
}

export const BunkBadge: React.FC<BunkBadgeProps> = ({
  percentage,
  canMiss,
  mustAttend,
  target = 75,
  size = 'md',
  projectedMustAttend,
  projectedCanMiss,
  pendingDlHours = 0,
  projectedSafe
}) => {
  const numPer = parsePercent(percentage, 0)
  const numCanMiss = parseNumber(canMiss, 0)
  const numMustAttend = parseNumber(mustAttend, 0)

  const isSafe = numPer >= target

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2'
  }[size]

  const officialBadge = isSafe ? (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 ${sizeClasses}`}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      {numCanMiss > 0 ? (
        <span>
          Can skip <strong>{numCanMiss}</strong> {numCanMiss === 1 ? 'class' : 'classes'}
        </span>
      ) : (
        <span>On track ({numPer.toFixed(1)}%)</span>
      )}
    </span>
  ) : (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/50 ${sizeClasses}`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      <span>
        Attend next <strong>{numMustAttend}</strong> {numMustAttend === 1 ? 'hour' : 'hours'}
      </span>
    </span>
  )

  if (!pendingDlHours || pendingDlHours <= 0) {
    return officialBadge
  }

  // Projected badge when pending duty leave exists
  const projSafe = projectedSafe ?? (isSafe || (projectedMustAttend === 0))
  const numProjCanMiss = projectedCanMiss ?? 0
  const numProjMustAttend = projectedMustAttend ?? 0

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {officialBadge}

      <span
        className={`inline-flex items-center font-medium rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 shadow-sm ${sizeClasses}`}
        title={`Projected calculation after crediting ${pendingDlHours}h pending duty leave`}
      >
        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
        {isSafe ? (
          numProjCanMiss > numCanMiss ? (
            <span>
              With DL: Can skip <strong>{numProjCanMiss}</strong> {numProjCanMiss === 1 ? 'class' : 'classes'}
            </span>
          ) : (
            <span>With DL: Safe (+{pendingDlHours}h)</span>
          )
        ) : projSafe ? (
          <span>
            With DL: <strong>Safe</strong> (≥{target}%)
          </span>
        ) : (
          <span>
            With DL: Attend next <strong>{numProjMustAttend}</strong> {numProjMustAttend === 1 ? 'hour' : 'hours'}
          </span>
        )}
      </span>
    </div>
  )
}
