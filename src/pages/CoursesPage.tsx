import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Course, CourseDetails, SyllabusTopic, CourseOutcome, CourseExecution, SourceBook } from '../api/types'
import { etlabClient } from '../api/client'
import { formatIndianDate } from '../utils/format'
import { 
  BookMarked, 
  FileText, 
  Award, 
  Calendar, 
  BookOpen, 
  X, 
  User, 
  CheckCircle2, 
  Circle, 
  Layers,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react'

export const CoursesPage: React.FC = () => {
  const { courses } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [activeModalType, setActiveModalType] = useState<'syllabus' | 'outcomes' | 'execution' | 'books' | null>(null)
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const handleOpenModal = async (course: Course, type: 'syllabus' | 'outcomes' | 'execution' | 'books') => {
    setSelectedCourse(course)
    setActiveModalType(type)
    setLoadingDetails(true)
    try {
      const details = await etlabClient.getCourseDetails(course.id)
      setCourseDetails(details)
    } catch (e) {
      console.warn('Failed to load course details:', e)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleCloseModal = () => {
    setActiveModalType(null)
    setSelectedCourse(null)
    setCourseDetails(null)
  }

  // Search filter
  const filteredCourses = (courses || []).filter(c => {
    const q = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.teacher_name && c.teacher_name.toLowerCase().includes(q))
    )
  })

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookMarked className="w-7 h-7 text-brand-400" />
              <span>Courses & Syllabus</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 text-xs font-bold">
              {courses?.length || 0}
            </span>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-1">
            Registered semester courses, curriculum syllabus, course outcomes, execution log, and prescribed source books
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, subject, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-xs text-white dark:text-white light:text-slate-900 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Course Cards Grid (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => {
            const attPer = typeof c.atten_per === 'number' ? c.atten_per : parseFloat(String(c.atten_per)) || 0
            let ringColor = 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40'
            if (attPer < 75) ringColor = 'text-rose-400 border-rose-500/60 bg-rose-950/40'
            else if (attPer < 85) ringColor = 'text-amber-400 border-amber-500/60 bg-amber-950/40'

            // First character of course type for avatar icon (Theory -> T, Practical -> P, No University -> N)
            const typeInitial = c.type.startsWith('Practical') ? 'P' : c.type.includes('No University') ? 'N' : 'T'
            const initialBg = typeInitial === 'T' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' :
                              typeInitial === 'P' ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' :
                              'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'

            return (
              <div
                key={c.id}
                className="glass-panel rounded-3xl p-5 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 hover:border-brand-500/40 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden group"
              >
                <div>
                  {/* Top Bar: Letter Avatar, Title, Code & Circular Attendance Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 uppercase ${initialBg}`}>
                        {typeInitial}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm md:text-base font-extrabold text-white dark:text-white light:text-slate-900 line-clamp-2 leading-snug">
                          {c.name}
                        </h3>
                        <span className="font-mono text-xs font-bold text-brand-400 block mt-0.5">
                          {c.code}
                        </span>
                      </div>
                    </div>

                    {/* Circular Attendance Badge */}
                    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 font-black text-xs ${ringColor}`}>
                      {Math.round(attPer)}%
                    </div>
                  </div>

                  {/* Metadata Badges: Type, Slot, Hours/wk, Credits */}
                  <div className="flex flex-wrap items-center gap-1.5 my-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                      {c.type}
                    </span>
                    {c.slot && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400">
                        Slot {c.slot}
                      </span>
                    )}
                    {c.hours && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400">
                        {c.hours} Hrs/wk
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 border border-brand-800/40 text-brand-400">
                      {c.credits} Credits
                    </span>
                  </div>

                  {/* Instructor & Attendance Counter */}
                  <div className="space-y-1 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 mt-2">
                    <p className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{c.teacher_name || 'Faculty Assigned'}</span>
                    </p>
                    {c.atten_text && (
                      <p className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Attendance: {c.atten_text} hours</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 4 Action Buttons: Syllabus, Course Outcome, Execution, Source Books */}
                <div className="mt-5 pt-3.5 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenModal(c, 'syllabus')}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/40 text-[11px] font-bold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Syllabus</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(c, 'outcomes')}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 text-[11px] font-bold transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Outcomes</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(c, 'execution')}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-800/40 text-[11px] font-bold transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Execution</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(c, 'books')}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/40 text-[11px] font-bold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Source Books</span>
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-16 text-center text-zinc-500 glass-panel rounded-3xl border border-zinc-800">
            <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-40 text-brand-400" />
            <p className="text-sm font-medium text-zinc-400">No courses match your query</p>
          </div>
        )}
      </div>

      {/* Interactive Modal for Syllabus / Outcomes / Execution / Source Books */}
      {activeModalType && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-brand-400 bg-brand-950/60 dark:bg-brand-950/60 light:bg-brand-50 px-2 py-0.5 rounded border border-brand-800/40">
                  {selectedCourse.code}
                </span>
                <h3 className="text-base md:text-lg font-bold text-white dark:text-white light:text-slate-900 mt-1">
                  {selectedCourse.name}
                </h3>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {loadingDetails ? (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs">Loading course details from ETLab...</p>
                </div>
              ) : (
                <>
                  {/* MODAL 1: SYLLABUS */}
                  {activeModalType === 'syllabus' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-300 dark:text-zinc-300 light:text-slate-700">Course Syllabus Modules</span>
                        <span>{courseDetails?.syllabus?.length || 0} Topics Defined</span>
                      </div>

                      <div className="space-y-2.5">
                        {courseDetails?.syllabus && courseDetails.syllabus.length > 0 ? (
                          courseDetails.syllabus.map((t, idx) => (
                            <div
                              key={t.id || idx}
                              className="p-3.5 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-start gap-3"
                            >
                              <div className="mt-0.5">
                                {t.covered ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                                    Module {t.module || 1}
                                  </span>
                                  {t.hours && (
                                    <span className="text-[10px] text-zinc-500 font-semibold">{t.hours} hrs</span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800 mt-0.5">
                                  {t.topic}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="py-8 text-center text-xs text-zinc-500">No syllabus topics listed</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODAL 2: COURSE OUTCOMES */}
                  {activeModalType === 'outcomes' && (
                    <div className="space-y-4">
                      <div className="text-xs text-zinc-400">
                        Learning outcomes mapped to Bloom's Taxonomy
                      </div>

                      <div className="space-y-3">
                        {courseDetails?.outcomes && courseDetails.outcomes.length > 0 ? (
                          courseDetails.outcomes.map((co) => (
                            <div
                              key={co.id}
                              className="p-4 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                                  {co.code}
                                </span>
                                {co.bloom_level && (
                                  <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                                    {co.bloom_level}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                                {co.description}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="py-8 text-center text-xs text-zinc-500">Course outcomes not published</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODAL 3: COURSE EXECUTION */}
                  {activeModalType === 'execution' && (
                    <div className="space-y-4">
                      <div className="text-xs text-zinc-400">
                        Recorded lectures timeline and topics completed
                      </div>

                      <div className="space-y-2.5">
                        {courseDetails?.execution && courseDetails.execution.length > 0 ? (
                          courseDetails.execution.map((ex) => (
                            <div
                              key={ex.id}
                              className="p-3.5 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 flex items-center justify-between gap-3"
                            >
                              <div>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                  <span className="font-bold text-brand-400 font-mono">{formatIndianDate(ex.date, 'short')}</span>
                                  <span>•</span>
                                  <span>Hour {ex.hour}</span>
                                </div>
                                <p className="text-xs font-semibold text-zinc-200 dark:text-zinc-200 light:text-slate-800 mt-0.5">
                                  {ex.topic}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded shrink-0">
                                Conducted
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="py-8 text-center text-xs text-zinc-500">No execution logs found</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MODAL 4: SOURCE BOOKS */}
                  {activeModalType === 'books' && (
                    <div className="space-y-4">
                      <div className="text-xs text-zinc-400">
                        Standard prescribed textbooks & reference books
                      </div>

                      <div className="space-y-3">
                        {courseDetails?.source_books && courseDetails.source_books.length > 0 ? (
                          courseDetails.source_books.map((b) => (
                            <div
                              key={b.id}
                              className="p-4 rounded-2xl bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-slate-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-bold text-white dark:text-white light:text-slate-900">
                                  {b.title}
                                </h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  b.is_reference ? 'bg-zinc-800 text-zinc-300' : 'bg-amber-950/70 border border-amber-800/50 text-amber-300'
                                }`}>
                                  {b.is_reference ? 'Reference' : 'Textbook'}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                                Author: <strong className="text-zinc-300 dark:text-zinc-300 light:text-slate-700">{b.author}</strong>
                                {b.publisher && ` • ${b.publisher}`}
                                {b.edition && ` • ${b.edition}`}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="py-8 text-center text-xs text-zinc-500">Source books not defined</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
