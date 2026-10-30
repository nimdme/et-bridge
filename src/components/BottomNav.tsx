import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CalendarDays, 
  GraduationCap, 
  PieChart, 
  BookMarked 
} from 'lucide-react'

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/attendance', label: 'Attendance', icon: PieChart },
    { to: '/timetable', label: 'Schedule', icon: CalendarDays },
    { to: '/courses', label: 'Courses', icon: BookMarked },
    { to: '/academics', label: 'Academics', icon: GraduationCap },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 backdrop-blur-md border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 px-2 py-1.5 md:hidden transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-brand-400 font-bold'
                    : 'text-zinc-500 dark:text-zinc-500 light:text-slate-500 hover:text-zinc-300 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-brand-500/15 text-brand-400 scale-105' : ''
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
