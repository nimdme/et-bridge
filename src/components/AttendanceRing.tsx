import React from 'react'
import { parsePercent } from '../utils/format'

interface AttendanceRingProps {
  percentage: number | string
  attended: number | string
  total: number | string
  size?: number
  strokeWidth?: number
  label?: string
}

export const AttendanceRing: React.FC<AttendanceRingProps> = ({
  percentage,
  attended,
  total,
  size = 140,
  strokeWidth = 11,
  label = 'Overall'
}) => {
  const numPer = parsePercent(percentage, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedPer = Math.min(100, Math.max(0, numPer))
  const strokeDashoffset = circumference - (clampedPer / 100) * circumference

  // Color logic
  let strokeColor = '#10b981' // emerald
  let glowColor = 'rgba(16, 185, 129, 0.25)'
  if (numPer < 75) {
    strokeColor = '#f43f5e' // rose
    glowColor = 'rgba(244, 63, 94, 0.25)'
  } else if (numPer < 80) {
    strokeColor = '#f59e0b' // amber
    glowColor = 'rgba(245, 158, 11, 0.25)'
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </svg>
      {/* Content in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          {numPer.toFixed(1)}
          <span className="text-sm font-normal text-zinc-400">%</span>
        </span>
        <span className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase mt-0.5">
          {attended}/{total} hrs
        </span>
      </div>
    </div>
  )
}
