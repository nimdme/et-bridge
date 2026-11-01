import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { parseNumber, formatIndianDate } from '../utils/format'
import { 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  FileQuestion, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building,
  Calendar,
  Check,
  Receipt,
  Plus,
  Trash2
} from 'lucide-react'
import { LogDutyLeaveModal } from '../components/LogDutyLeaveModal'

export const CampusPage: React.FC = () => {
  const { activityPoints, fees, dutyLeaves, surveys, pendingDutyLeaves, deletePendingDutyLeave, totalPendingDlHours } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showLogModal, setShowLogModal] = useState(false)

  const validTabs = ['points', 'fees', 'duty', 'surveys'] as const
  type TabType = typeof validTabs[number]

  const initialTab = (searchParams.get('tab') as TabType) || 'points'
  const [activeTab, setActiveTab] = useState<TabType>(validTabs.includes(initialTab) ? initialTab : 'points')

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  // Activity points calculations
  const totalPoints = parseNumber(activityPoints?.total_points_awarded, 0)
  const targetPoints = 100
  const remainingPoints = Math.max(0, targetPoints - totalPoints)
  const pointsPercentage = Math.min(100, Math.max(0, (totalPoints / targetPoints) * 100))

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Building className="w-7 h-7 text-brand-400" />
          <span>Campus & Services</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-1">
          Activity points meter, semester fee clearance, duty leaves, and feedback surveys
        </p>
      </div>

      {/* Mobile-friendly Horizontal Tabs Rail */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar scrollbar-none max-w-full">
        <button
          onClick={() => handleTabChange('points')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'points'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border border-brand-500'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Activity Points ({totalPoints}/100)</span>
        </button>

        <button
          onClick={() => handleTabChange('fees')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'fees'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border border-brand-500'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fees & Dues</span>
        </button>

        <button
          onClick={() => handleTabChange('duty')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'duty'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border border-brand-500'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Duty Leaves ({dutyLeaves.length + pendingDutyLeaves.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('surveys')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'surveys'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border border-brand-500'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5 text-amber-400" />
          <span>Surveys ({surveys.length})</span>
        </button>
      </div>

      {/* --- TAB 1: KTU ACTIVITY POINTS --- */}
      {activeTab === 'points' && (
        <div className="space-y-6">
          {/* Hero Points Progress Card */}
          <div className="glass-panel rounded-3xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-1">
                  KTU Mandatory Requirement
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                  Student Activity Points
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  100 points required for B.Tech degree eligibility
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-brand-950/70 border border-brand-800/60 text-right">
                  <span className="text-2xl md:text-3xl font-black text-brand-300 block leading-tight">
                    {totalPoints}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-semibold">of 100 points</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${pointsPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{pointsPercentage.toFixed(0)}% Completed</span>
              {remainingPoints > 0 ? (
                <span className="text-amber-400 font-medium">
                  {remainingPoints} points needed before final semester
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100 Points Milestone Reached
                </span>
              )}
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 px-1">
              Awarded Activities ({activityPoints?.awarded?.length || 0})
            </h4>

            {activityPoints?.awarded && activityPoints.awarded.length > 0 ? (
              activityPoints.awarded.map((act) => (
                <div
                  key={act.id}
                  className="glass-panel rounded-2xl p-4 md:p-5 border border-zinc-800/80 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {act.category && (
                        <span className="text-[10px] font-bold uppercase text-brand-400 bg-brand-950/60 border border-brand-800/40 px-2 py-0.5 rounded">
                          {act.category}
                        </span>
                      )}
                      {act.semester && (
                        <span className="text-xs text-zinc-500">{act.semester}</span>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-white">{act.activity_name}</h5>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base md:text-lg font-black text-emerald-400 block">
                      +{act.points} pts
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium uppercase">
                      {act.status || 'Approved'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No activity certificates submitted or approved yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: FEES & DUES --- */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Fees Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-zinc-800">
              <span className="text-xs text-zinc-500 font-semibold block uppercase">Total Semester Fee</span>
              <span className="text-xl md:text-2xl font-black text-white mt-1 block">
                ₹{fees?.total_fee?.toLocaleString('en-IN') || 0}
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-zinc-800">
              <span className="text-xs text-zinc-500 font-semibold block uppercase">Total Paid</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400 mt-1 block">
                ₹{fees?.total_paid?.toLocaleString('en-IN') || 0}
              </span>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-zinc-800">
              <span className="text-xs text-zinc-500 font-semibold block uppercase">Outstanding Balance</span>
              <span className={`text-xl md:text-2xl font-black mt-1 block ${
                (fees?.total_balance || 0) > 0 ? 'text-rose-400' : 'text-zinc-400'
              }`}>
                ₹{fees?.total_balance?.toLocaleString('en-IN') || 0}
              </span>
            </div>
          </div>

          {/* Dues Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            fees?.has_due
              ? 'bg-rose-950/60 border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
          }`}>
            <div className="flex items-center gap-3">
              {fees?.has_due ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {fees?.has_due ? 'Outstanding Dues Pending' : 'No Dues Clearance: Active'}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {fees?.has_due 
                    ? 'Clear remaining balance before semester exam hall ticket generation.'
                    : 'All tuition and departmental dues cleared for this semester.'}
                </p>
              </div>
            </div>
          </div>

          {/* Fee Installments Breakdown */}
          {fees?.fee_types && fees.fee_types.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 px-1">
                Installment Details
              </h4>
              {fees.fee_types.map((ft) => (
                <div key={ft.fee_type_id} className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-3">
                  <h5 className="text-sm font-bold text-white">{ft.fee_type_name}</h5>
                  {ft.installments && ft.installments.length > 0 ? (
                    <div className="divide-y divide-zinc-800/50">
                      {ft.installments.map((inst, i) => (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-zinc-200 block">{inst.name}</span>
                            {inst.receipt_no && (
                              <span className="text-[11px] text-zinc-500 font-mono">Receipt: {inst.receipt_no}</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white block">₹{inst.amount?.toLocaleString('en-IN')}</span>
                            <span className={`text-[10px] font-bold uppercase ${
                              inst.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>{inst.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">No installments recorded</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: DUTY LEAVES --- */}
      {activeTab === 'duty' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl glass-panel border border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                  Duty Leave Tracker
                </h4>
                {totalPendingDlHours > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300">
                    +{totalPendingDlHours}h Pending Entry
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-0.5">
                Official duty leaves are verified by faculty. You can also self-log pending claims to preview projected attendance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Log Pending Duty Leave</span>
            </button>
          </div>

          {/* Self-Reported Pending Claims */}
          {pendingDutyLeaves.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Self-Reported Pending Claims ({pendingDutyLeaves.length})</span>
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-500">
                  Auto-reconciles once faculty enters in ETLab
                </span>
              </div>

              <div className="space-y-2.5">
                {pendingDutyLeaves.map((pdl) => (
                  <div
                    key={pdl.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      pdl.reconciled
                        ? 'bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50 border-emerald-800/40'
                        : 'bg-amber-950/15 dark:bg-amber-950/15 light:bg-amber-50 border-dashed border-amber-800/60 dark:border-amber-800/60 light:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                          {pdl.hours} {pdl.hours === 1 ? 'Hour' : 'Hours'}
                          {pdl.selectedHours && pdl.selectedHours.length > 0 && (
                            <span className="text-amber-300 font-semibold ml-1">
                              (Hour {pdl.selectedHours.join(', ')})
                            </span>
                          )}
                        </span>
                        {pdl.subject_code && (
                          <span className="text-[11px] font-mono font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-700 bg-zinc-800/80 px-2 py-0.5 rounded">
                            {pdl.subject_code}
                          </span>
                        )}
                        {pdl.reconciled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/70 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Reconciled & Credited in ETLab</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800/70 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Self-Reported • Awaiting Faculty Entry</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mt-1.5">
                        {pdl.reason}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-zinc-500" /> {formatIndianDate(pdl.date, 'numeric')}
                        </span>
                        {pdl.subject_name && (
                          <span>• Subject: {pdl.subject_name}</span>
                        )}
                        {pdl.notes && (
                          <span>• Note: {pdl.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => deletePendingDutyLeave(pdl.id)}
                        title="Remove Claim"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Duty Leaves from ETLab */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Official ETLab Register ({dutyLeaves.length})
            </span>

            {dutyLeaves.length > 0 ? (
              dutyLeaves.map((dl) => (
                <div
                  key={dl.id}
                  className="glass-panel rounded-2xl p-5 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
                      {dl.hours ? `${dl.hours} Hours` : 'Exemption'}
                    </span>
                    <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 mt-1.5">{dl.reason}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {formatIndianDate(dl.from_date, 'numeric')}{dl.to_date && dl.to_date !== dl.from_date ? ` to ${formatIndianDate(dl.to_date, 'numeric')}` : ''}
                      </span>
                      {dl.approved_by && (
                        <span>• Approved by: {dl.approved_by}</span>
                      )}
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{dl.status || 'ETLab Approved'}</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800 dark:border-zinc-800 light:border-slate-200">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                <p className="text-xs font-medium text-zinc-400">No official duty leaves approved in ETLab yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: SURVEYS --- */}
      {activeTab === 'surveys' && (
        <div className="space-y-4">
          {surveys.length > 0 ? (
            surveys.map((sv) => (
              <div
                key={sv.id}
                className="glass-panel rounded-2xl p-5 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-zinc-400 font-semibold">{sv.session || 'Course Survey'}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{sv.name}</h3>
                  {sv.teacher_names && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      Faculty evaluated: {sv.teacher_names}
                    </p>
                  )}
                  {sv.deadline && (
                    <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Deadline: {sv.deadline}
                    </p>
                  )}
                </div>

                <div className="self-end sm:self-center shrink-0">
                  {sv.status === 'Completed' || !sv.is_open ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800">
                      <span>Action Required</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
              <FileQuestion className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-zinc-400">No active faculty feedback surveys required</p>
            </div>
          )}
        </div>
      )}

      {/* Log Pending Duty Leave Modal */}
      <LogDutyLeaveModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
      />
    </div>
  )
}
