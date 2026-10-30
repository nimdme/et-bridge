import React from 'react'

interface ETBridgeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

export const ETBridgeLogo: React.FC<ETBridgeLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 rounded-lg p-1',
    md: 'w-9 h-9 rounded-xl p-1.5',
    lg: 'w-12 h-12 rounded-2xl p-2',
    xl: 'w-16 h-16 rounded-3xl p-2.5'
  }[size]

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  }[size]

  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Sleek Gradient Bridge Mark Icon */}
      <div
        className={`${iconSizeClasses} bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-500 shadow-md shadow-brand-500/25 flex items-center justify-center shrink-0 border border-white/20 transition-transform group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bridge Suspension Arch */}
          <path
            d="M6 28C13 14 27 14 34 28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Bridge Deck */}
          <path
            d="M4 28H36"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Vertical Suspension Cables */}
          <path
            d="M13 20.5V28"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M20 16.5V28"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M27 20.5V28"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Apex Connection Node / Glowing Beacon */}
          <circle cx="20" cy="9.5" r="2.8" fill="currentColor" />
          <circle
            cx="20"
            cy="9.5"
            r="5"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Modern Typography */}
      {showText && (
        <span className={`${textSizeClasses} font-mono font-extrabold tracking-tight text-white dark:text-white light:text-slate-900`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
            ET
          </span>
          <span>Bridge</span>
        </span>
      )}
    </div>
  )
}
