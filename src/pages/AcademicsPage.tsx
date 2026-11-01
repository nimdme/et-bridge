import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Assignment, SeriesExam, StudyMaterial } from '../api/types'
import { AssignmentModal } from '../components/AssignmentModal'
import { getDaysRemaining, formatIndianDate } from '../utils/format'
import { downloadFileWithAuth } from '../utils/download'
import { 
  GraduationCap, 
  FileText, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users,
  BookOpen,
  Phone,
  Mail,
  Download,
  TrendingUp,
  Filter,
  CheckCircle,
  FileCheck,
  AlertCircle
} from 'lucide-react'

export const AcademicsPage: React.FC = () => {
  const { evaluations, teachers, materials, universityResults, profile } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null)

  const handleDownloadAssignment = async (asg: Assignment, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!asg.url) return
    setDownloadingId(asg.id)
    try {
      await downloadFileWithAuth(
        asg.url,
        `${asg.subject_code}_Assignment_${asg.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      )
    } catch (err) {
      console.error('Failed to download assignment attachment:', err)
      window.alert('Failed to download assignment PDF. Please check your connection and login session.')
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDownloadMaterial = async (m: StudyMaterial) => {
    const url = m.link || m.file_name
    if (!url) return
    setDownloadingId(m.id)
    try {
      await downloadFileWithAuth(
        url,
        `${m.subject}_${m.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      )
    } catch (err) {
      console.error('Failed to download study material:', err)
      window.alert('Failed to download study material. Please check your connection and login session.')
    } finally {
      setDownloadingId(null)
    }
  }

  // Primary Tabs: exams, assignments, teachers, materials, results
  const validTabs = ['exams', 'series', 'assignments', 'teachers', 'materials', 'results'] as const
  type TabType = 'exams' | 'assignments' | 'teachers' | 'materials' | 'results'

  const rawTab = searchParams.get('tab') || 'exams'
  const initialTab: TabType = rawTab === 'series' ? 'exams' : (validTabs.includes(rawTab as any) ? rawTab as TabType : 'exams')
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)

  // Sub-filter for Examinations: all, series1, series2, model, university
  const [examSubFilter, setExamSubFilter] = useState<'all' | 'series1' | 'series2' | 'model' | 'university'>('all')

  // Sub-filter for Assignments: all, open, submitted, marked
  const [assignmentCategory, setAssignmentCategory] = useState<'all' | 'open' | 'submitted' | 'marked'>('open')

  // Global Semester & Year filter
  const [selectedSemester, setSelectedSemester] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('2026-27')

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'series') {
      setActiveTab('exams')
    } else if (tabParam && ['exams', 'assignments', 'teachers', 'materials', 'results'].includes(tabParam)) {
      setActiveTab(tabParam as TabType)
    }
  }, [searchParams])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setSearchParams({ tab: tab === 'exams' ? 'exams' : tab })
  }

  const seriesExams = evaluations?.series_exams || []
  const assignments = evaluations?.assignments || []

  // Filter exams based on examSubFilter
  const filteredExams = seriesExams.filter(exam => {
    const title = (exam.title || '').toLowerCase()
    if (examSubFilter === 'series1') return title.includes('1') || title.includes('first') || title.includes('series 1')
    if (examSubFilter === 'series2') return title.includes('2') || title.includes('second') || title.includes('series 2')
    if (examSubFilter === 'model') return title.includes('model') || title.includes('retest')
    return true
  })

  // Categorize assignments
  const openAssignments = assignments.filter(asg => {
    const isSubmitted = asg.status?.toUpperCase() === 'SUBMITTED'
    const hasMark = !!asg.mark
    return !isSubmitted && !hasMark
  })

  const submittedAssignments = assignments.filter(asg => {
    const isSubmitted = asg.status?.toUpperCase() === 'SUBMITTED'
    return isSubmitted && !asg.mark
  })

  const markedAssignments = assignments.filter(asg => {
    return !!asg.mark
  })

  // Selected assignments to display
  const displayedAssignments = 
    assignmentCategory === 'open' ? openAssignments :
    assignmentCategory === 'submitted' ? submittedAssignments :
    assignmentCategory === 'marked' ? markedAssignments :
    assignments

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-brand-400" />
            <span>Academics & Evaluations</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
            Examinations, categorized assignments, faculty contact directory, and study materials
          </p>
        </div>

        {/* Global Semester & Year Filter Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent text-xs font-bold text-white dark:text-white light:text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">All Semesters</option>
              <option value="1" className="bg-zinc-900 text-white">Semester 1 (Current)</option>
              <option value="2" className="bg-zinc-900 text-white">Semester 2</option>
              <option value="3" className="bg-zinc-900 text-white">Semester 3</option>
              <option value="4" className="bg-zinc-900 text-white">Semester 4</option>
            </select>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600 shadow-sm">
            <span>AY: 2026-27</span>
          </div>
        </div>
      </div>

      {/* Primary Category Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => handleTabChange('exams')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-sm ${
            activeTab === 'exams'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Examinations ({seriesExams.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('assignments')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-sm ${
            activeTab === 'assignments'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignments ({assignments.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('teachers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-sm ${
            activeTab === 'teachers'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Directory ({teachers.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('materials')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-sm ${
            activeTab === 'materials'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Notes ({materials.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('results')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-sm ${
            activeTab === 'results'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>University Results</span>
        </button>
      </div>

      {/* --- TAB 1: EXAMINATIONS (Series 1, Series 2, Model, University) --- */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {/* Sub-Filters Pill Bar */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 w-fit max-w-full overflow-x-auto scrollbar-none no-scrollbar">
            <button
              onClick={() => setExamSubFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                examSubFilter === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              All Examinations
            </button>
            <button
              onClick={() => setExamSubFilter('series1')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                examSubFilter === 'series1'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              Series Exam 1
            </button>
            <button
              onClick={() => setExamSubFilter('series2')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                examSubFilter === 'series2'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              Series Exam 2
            </button>
            <button
              onClick={() => setExamSubFilter('model')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                examSubFilter === 'model'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              Model Exam
            </button>
          </div>

          {/* Exams List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => {
                const numericMark = typeof exam.mark === 'number' ? exam.mark : parseFloat(String(exam.mark)) || 0
                const percentage = exam.maximum_mark > 0 ? (numericMark / exam.maximum_mark) * 100 : 0
                
                let scoreColor = 'text-emerald-400'
                if (percentage < 40) scoreColor = 'text-rose-400'
                else if (percentage < 65) scoreColor = 'text-amber-400'

                return (
                  <div
                    key={exam.id}
                    className="glass-panel rounded-2xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-brand-300 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-bold uppercase text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded">
                          {exam.subject_code}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-semibold">
                          {exam.title}
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-white dark:text-white light:text-slate-900 leading-snug">
                        {exam.subject}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {exam.date ? formatIndianDate(exam.date, 'short') : 'TBA'}
                        </span>
                        <span>•</span>
                        <span>Status: <strong className="text-zinc-300 dark:text-zinc-300 light:text-slate-700">{exam.status}</strong></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500">Marks Obtained</span>
                      <div className="text-right">
                        <span className={`text-xl md:text-2xl font-black ${scoreColor}`}>
                          {exam.mark}
                        </span>
                        <span className="text-xs text-zinc-500"> / {exam.maximum_mark}</span>
                        <span className="block text-[11px] font-bold text-zinc-400">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-16 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
                <p className="text-sm font-medium text-zinc-400">
                  No examination marks found for {examSubFilter === 'all' ? 'this semester' : examSubFilter}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: ASSIGNMENTS (Categorized by Open, Submitted, Marked) --- */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {/* Category Tabs: Open, Submitted, Marked */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-200 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 w-fit max-w-full overflow-x-auto scrollbar-none no-scrollbar">
            <button
              onClick={() => setAssignmentCategory('open')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                assignmentCategory === 'open'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Open & Due ({openAssignments.length})</span>
            </button>

            <button
              onClick={() => setAssignmentCategory('submitted')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                assignmentCategory === 'submitted'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Submitted ({submittedAssignments.length})</span>
            </button>

            <button
              onClick={() => setAssignmentCategory('marked')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                assignmentCategory === 'marked'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Graded & Marked ({markedAssignments.length})</span>
            </button>

            <button
              onClick={() => setAssignmentCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                assignmentCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              All ({assignments.length})
            </button>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedAssignments.length > 0 ? (
              displayedAssignments.map((asg) => {
                const daysInfo = getDaysRemaining(asg.last_date)
                const isSubmitted = asg.status?.toUpperCase() === 'SUBMITTED'
                const isMissed = !isSubmitted && daysInfo.isOverdue
                const downloadUrl = asg.url ? (
                  asg.url.startsWith('http') ? asg.url : `https://api.students.etlab.app${asg.url}`
                ) : null

                return (
                  <div
                    key={asg.id}
                    onClick={() => setSelectedAssignment(asg)}
                    className="glass-panel rounded-2xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/50 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
                  >
                    <div>
                      {/* Top Header Row with Code & Countdown Pill */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded">
                            {asg.subject_code}
                          </span>
                          {asg.subject_type && (
                            <span className="text-[10px] text-zinc-400 font-medium">
                              • {asg.subject_type}
                            </span>
                          )}
                        </div>

                        {/* Authenticated PDF Question Paper Download Button */}
                        {asg.url && (
                          <button
                            type="button"
                            onClick={(e) => handleDownloadAssignment(asg, e)}
                            disabled={downloadingId === asg.id}
                            title="Download Assignment Question Paper PDF"
                            className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/60 transition-colors disabled:opacity-50"
                          >
                            <Download className={`w-3.5 h-3.5 ${downloadingId === asg.id ? 'animate-bounce' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Course Name */}
                      <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-600 line-clamp-1">
                        {asg.subject_name || asg.subject}
                      </h4>

                      {/* Assignment Title */}
                      <h3 className="text-sm md:text-base font-bold text-white dark:text-white light:text-slate-900 group-hover:text-brand-400 transition-colors mt-1.5">
                        {asg.title}
                      </h3>

                      {/* Countdown & Status Row */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {/* Status badge */}
                        {asg.mark ? (
                          <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                            Score: {asg.mark} / {asg.max_mark || '20'}
                          </span>
                        ) : isSubmitted ? (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
                            ✓ Submitted
                          </span>
                        ) : isMissed ? (
                          <span className="text-[11px] font-bold text-rose-400 bg-rose-950/70 border border-rose-800/60 px-2.5 py-0.5 rounded-lg">
                            Past Due
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2.5 py-0.5 rounded-lg">
                            Pending Submission
                          </span>
                        )}

                        {/* "X DAYS LEFT" BADGE (Red if <= 3 days) */}
                        {daysInfo.text && !isSubmitted && (
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${
                            daysInfo.isUrgent
                              ? 'bg-rose-950/90 border-rose-700 text-rose-300 shadow-sm animate-pulse'
                              : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
                          }`}>
                            {daysInfo.text}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Meta Row */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>
                        Due: <strong className={daysInfo.isUrgent && !isSubmitted ? 'text-rose-400 font-bold' : 'text-zinc-300 dark:text-zinc-300 light:text-slate-700'}>
                          {asg.last_date ? formatIndianDate(asg.last_date, 'numeric') : 'N/A'}
                        </strong>
                      </span>

                      <span className="text-brand-400 font-bold group-hover:underline flex items-center gap-1">
                        <span>Details & Upload</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-16 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
                <p className="text-sm font-medium text-zinc-400">
                  No assignments under '{assignmentCategory}' category
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: FACULTY DIRECTORY (With Photos) --- */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.length > 0 ? (
            teachers.map((t) => {
              const isLead = t.is_hod || t.is_staff_advisor
              const initials = t.name.split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('')

              // Photo URL
              const photoUrl = t.photo ? (
                t.photo.startsWith('http') ? t.photo : `https://api.students.etlab.app/uploads/${t.photo.replace(/^\/+/, '')}`
              ) : null

              return (
                <div
                  key={t.id}
                  className={`glass-panel rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-sm ${
                    isLead ? 'border-brand-500/40 bg-zinc-900/90' : 'border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5 mb-2">
                    {/* Faculty Photo / Avatar */}
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-brand-950/80 border border-brand-800/60 text-brand-300 font-bold text-sm flex items-center justify-center shrink-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={t.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : null}
                      <span className="uppercase">{initials || 'FC'}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 truncate">{t.name}</h3>
                        {t.role_label && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/70 border border-brand-800/60 px-2 py-0.5 rounded-md">
                            {t.role_label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-0.5 line-clamp-2">
                        {t.subject || 'Faculty Member'}
                      </p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center gap-2">
                    {t.phone ? (
                      <a
                        href={`tel:${t.phone}`}
                        className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 hover:bg-zinc-800 text-xs font-semibold text-brand-300 dark:text-brand-300 light:text-brand-700 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Call ({t.phone})</span>
                      </a>
                    ) : null}

                    {t.email ? (
                      <a
                        href={`mailto:${t.email}`}
                        className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 dark:bg-zinc-900 light:bg-slate-100 hover:bg-zinc-800 text-zinc-300 dark:text-zinc-300 light:text-slate-700 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 transition-colors"
                        title={t.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-16 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
              <p className="text-sm font-medium text-zinc-400">No faculty directory available</p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 4: STUDY MATERIALS & NOTES --- */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.length > 0 ? (
              materials.map((m) => (
                <div
                  key={m.id}
                  className="glass-panel rounded-2xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 light:border-brand-200 px-2 py-0.5 rounded">
                      {m.subject}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-white dark:text-white light:text-slate-900 mt-2">
                      {m.title}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1 line-clamp-2">
                      {m.details || 'Course notes and reference materials'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-500 light:text-slate-400 truncate max-w-[140px]">
                      {m.teacher}
                    </span>

                    {(m.link || m.file_name) && (
                      <button
                        type="button"
                        onClick={() => handleDownloadMaterial(m)}
                        disabled={downloadingId === m.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Download className={`w-3.5 h-3.5 ${downloadingId === m.id ? 'animate-bounce' : ''}`} />
                        <span>{downloadingId === m.id ? 'Downloading...' : 'Download'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
                <p className="text-sm font-medium text-zinc-400">No study materials shared yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: UNIVERSITY RESULTS --- */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {universityResults.length > 0 ? (
            universityResults.map((exam, idx) => (
              <div
                key={exam.exam_id || idx}
                className="glass-panel rounded-3xl p-6 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
                  <div>
                    <h3 className="text-lg font-extrabold text-white dark:text-white light:text-slate-900">
                      {exam.exam_name}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-0.5">
                      Semester {exam.semester} • Official KTU Board Published Result
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {exam.sgpa && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 block">Semester SGPA</span>
                        <span className="text-xl font-black text-brand-400">{exam.sgpa}</span>
                      </div>
                    )}
                    {exam.cgpa && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 block">Cumulative CGPA</span>
                        <span className="text-xl font-black text-emerald-400">{exam.cgpa}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject Grades Table */}
                {exam.results && exam.results.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
                          <th className="py-2 px-3">Code</th>
                          <th className="py-2 px-3">Course Name</th>
                          <th className="py-2 px-3 text-center">Credits</th>
                          <th className="py-2 px-3 text-right">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {exam.results.map((res, i) => (
                          <tr key={i} className="hover:bg-zinc-900/40">
                            <td className="py-3 px-3 font-mono font-bold text-brand-400">{res.course_code}</td>
                            <td className="py-3 px-3 font-medium text-white dark:text-white light:text-slate-900">{res.course_name}</td>
                            <td className="py-3 px-3 text-center font-bold text-zinc-400">{res.credits}</td>
                            <td className="py-3 px-3 text-right">
                              <span className="font-extrabold px-2.5 py-1 rounded-md bg-zinc-800 text-emerald-400 text-xs">
                                {res.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
              <p className="text-sm font-medium text-zinc-400">No university results published yet for this batch</p>
            </div>
          )}
        </div>
      )}

      {/* Assignment Modal (Upload / Download PDF / Countdown) */}
      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  )
}
