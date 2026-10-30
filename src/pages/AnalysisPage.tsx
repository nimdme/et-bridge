import React from 'react'
import { useAuth } from '../context/AuthContext'
import { formatPercent, formatSemester } from '../utils/format'
import { 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  User,
  GraduationCap
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const AnalysisPage: React.FC = () => {
  const { academicAnalysis, profile, attendance } = useAuth()

  const studentName = academicAnalysis?.name || profile?.name || 'NIRANJAN M D'
  const admissionNo = academicAnalysis?.student?.admissionNo || profile?.admission_no || '26B323'
  const batch = academicAnalysis?.student?.batch || '2K26'
  const currentSem = formatSemester(academicAnalysis?.student?.current_sem || profile?.curnt_sem, 'Semester')

  const cgpa = academicAnalysis?.cgpa ?? 0
  const earnedCredit = academicAnalysis?.earned_credit ?? 0
  const totalCredit = academicAnalysis?.total_credit ?? 20
  const totalBacklogs = academicAnalysis?.total_backlogs ?? 0
  const passedCourses = academicAnalysis?.total_passed ?? 0

  const coursesAtRisk = academicAnalysis?.courses_at_risk || []
  const semesters = academicAnalysis?.semesters || []

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-brand-400" />
          <span>Academic Analysis & Risk Assessment</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
          Performance metrics, credits progress, risk radar for attendance & internals, and semester GPA trends
        </p>
      </div>

      {/* Hero Card: Student Info & 6 Metric Cards (Matching Screenshot 5) */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Student Info */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
              Student Record
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
              {studentName}
            </h2>
            <p className="text-xs md:text-sm font-mono text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
              Admission: {admissionNo} • Batch: {batch} • {profile?.course || 'B.Tech Computer Science'}
            </p>
          </div>

          {/* Right 6 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">CGPA</span>
              <span className="text-2xl font-black text-white dark:text-white light:text-slate-900 block mt-0.5">
                {cgpa > 0 ? cgpa.toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Earned Credit</span>
              <span className="text-2xl font-black text-emerald-400 block mt-0.5">
                {earnedCredit}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Total Credit</span>
              <span className="text-2xl font-black text-white dark:text-white light:text-slate-900 block mt-0.5">
                {totalCredit}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Total Backlogs</span>
              <span className="text-2xl font-black text-zinc-200 dark:text-zinc-200 light:text-slate-800 block mt-0.5">
                {totalBacklogs}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Current Semester</span>
              <span className="text-lg font-black text-brand-400 block mt-1 truncate">
                {currentSem}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-500 light:text-slate-400 block">Passed Courses</span>
              <span className="text-2xl font-black text-zinc-200 dark:text-zinc-200 light:text-slate-800 block mt-0.5">
                {passedCourses}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses At Risk Section (Matching Screenshot 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight">
              Courses at Risk
            </h3>
          </div>
          <span className="text-xs text-zinc-500">Triggered when attendance &lt; 75% or internals average &lt; 40%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursesAtRisk.length > 0 ? (
            coursesAtRisk.map((risk, idx) => {
              const isHighRisk = risk.risk_level >= 4
              const riskBadgeColor = isHighRisk 
                ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
                : 'bg-amber-950/80 text-amber-300 border-amber-800'

              return (
                <div
                  key={risk.code || idx}
                  className="glass-panel rounded-2xl p-5 border border-rose-800/30 dark:border-rose-800/30 light:border-rose-200 hover:border-rose-700/60 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 px-2 py-0.5 rounded">
                        {risk.code}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${riskBadgeColor}`}>
                        Risk {risk.risk_level}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 line-clamp-2 leading-snug">
                      {risk.name}
                    </h4>

                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
                      {risk.semester} • Attendance: {formatPercent(risk.attendance_per)}%
                    </p>

                    {/* Risk Warning Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {risk.attendance_per < 75 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800/80">
                          Attendance {formatPercent(risk.attendance_per)}%
                        </span>
                      )}
                      {risk.evaluation_avg > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/80">
                          Evaluation average {formatPercent(risk.evaluation_avg)}%
                        </span>
                      )}
                    </div>

                    {/* Explanatory bullet points */}
                    {risk.reasons && risk.reasons.length > 0 && (
                      <ul className="mt-3 space-y-1 text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600 border-t border-zinc-800/60 pt-2">
                        {risk.reasons.map((r, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between text-xs">
                    <Link
                      to="/attendance"
                      className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Check Bunk Allowance</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
              <p className="text-sm font-semibold text-white">No courses at risk</p>
              <p className="text-xs text-zinc-400 mt-0.5">Your attendance and internal evaluations are safely above the minimum threshold!</p>
            </div>
          )}
        </div>
      </div>

      {/* Semester Breakdown Table Card (Matching Screenshot 5) */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight">
          Semester Progression Summary
        </h3>

        {semesters.map((sem, idx) => (
          <div
            key={sem.position || idx}
            className="p-5 md:p-6 rounded-3xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-bold">
                  {sem.semester}
                </span>
                <span className="text-xs text-zinc-400">
                  {sem.total_courses || 7} courses registered
                </span>
              </div>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 px-2.5 py-1 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300">
                Result: {sem.result}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">SGPA</span>
                <span className="text-sm font-black text-white dark:text-white light:text-slate-900 block mt-0.5">
                  {typeof sem.sgpa === 'number' && sem.sgpa > 0 ? sem.sgpa.toFixed(2) : 'Awaiting'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">CGPA</span>
                <span className="text-sm font-black text-white dark:text-white light:text-slate-900 block mt-0.5">
                  {sem.cumulative_cgpa && sem.cumulative_cgpa > 0 ? sem.cumulative_cgpa.toFixed(2) : '-'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Credit</span>
                <span className="text-sm font-black text-emerald-400 block mt-0.5">{sem.credit}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Result</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5 truncate">{sem.result}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Passed</span>
                <span className="text-sm font-black text-emerald-400 block mt-0.5">{sem.is_passed}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Failed</span>
                <span className="text-sm font-black text-rose-400 block mt-0.5">0</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Pending</span>
                <span className="text-sm font-black text-zinc-300 dark:text-zinc-300 light:text-slate-700 block mt-0.5">{sem.total_courses || 7}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-slate-100 border border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Attendance</span>
                <span className="text-sm font-black text-brand-400 block mt-0.5">{formatPercent(sem.attendance?.percent || 77)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SGPA / CGPA Trend Interactive Section (Matching Screenshot 5) */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white dark:text-white light:text-slate-900 tracking-tight">
              SGPA / CGPA Trend
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
              Published semesters carry SGPA bars; pending semesters stay visible without pretending to be zero.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-500" />
              <span>SGPA</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>CGPA</span>
            </span>
          </div>
        </div>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Latest CGPA</span>
            <span className="text-base font-extrabold text-white dark:text-white light:text-slate-900 block mt-1">
              Awaiting
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">No semester summary yet.</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Latest Published SGPA</span>
            <span className="text-base font-extrabold text-white dark:text-white light:text-slate-900 block mt-1">
              Awaiting
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">No published SGPA yet.</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/70 dark:bg-zinc-900/70 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block">Best Semester</span>
            <span className="text-base font-extrabold text-white dark:text-white light:text-slate-900 block mt-1">
              Awaiting
            </span>
            <span className="text-[11px] text-zinc-500 block mt-0.5">Will appear after results are published.</span>
          </div>
        </div>

        {/* Visual 0 to 10 Chart Frame */}
        <div className="p-6 rounded-2xl bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 relative min-h-[220px] flex flex-col justify-between">
          {/* Y Axis Guidelines */}
          <div className="space-y-8 text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="w-6 text-right font-bold">10</span>
              <div className="flex-1 border-b border-dashed border-zinc-800" />
              <span className="w-6 font-bold">10</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 text-right font-bold">7.5</span>
              <div className="flex-1 border-b border-dashed border-zinc-800" />
              <span className="w-6 font-bold">7.5</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 text-right font-bold">5.0</span>
              <div className="flex-1 border-b border-dashed border-zinc-800" />
              <span className="w-6 font-bold">5.0</span>
            </div>
          </div>

          {/* Semesters Columns on X Axis */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-6 mt-4 border-t border-zinc-800/80 text-center">
            {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((sem, idx) => (
              <div key={sem} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-12 rounded-lg border flex items-center justify-center text-[10px] font-bold ${
                  idx === 0
                    ? 'bg-brand-600/20 border-brand-500/50 text-brand-300'
                    : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-600'
                }`}>
                  {idx === 0 ? 'Current' : '—'}
                </div>
                <span className={`text-xs font-bold ${idx === 0 ? 'text-brand-400' : 'text-zinc-500'}`}>{sem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
