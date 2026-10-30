import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  AuthSession, 
  StudentProfile, 
  SubjectAttendance, 
  DayTimetable, 
  EvaluationsData,
  Teacher,
  StudyMaterial,
  FeesData,
  ActivityPointsData,
  DutyLeave,
  PendingDutyLeave,
  SurveyItem,
  UniversityResult,
  Course,
  AcademicAnalysis
} from '../api/types'
import { etlabClient } from '../api/client'

interface AuthContextType {
  session: AuthSession | null
  isAuthenticated: boolean
  isDemo: boolean
  isStandalone: boolean
  loading: boolean
  profile: StudentProfile | null
  attendance: SubjectAttendance[] | null
  timetable: DayTimetable[] | null
  evaluations: EvaluationsData | null
  teachers: Teacher[]
  materials: StudyMaterial[]
  fees: FeesData | null
  activityPoints: ActivityPointsData | null
  dutyLeaves: DutyLeave[]
  pendingDutyLeaves: PendingDutyLeave[]
  totalPendingDlHours: number
  addPendingDutyLeave: (item: Omit<PendingDutyLeave, 'id' | 'createdAt' | 'reconciled'>) => void
  deletePendingDutyLeave: (id: string) => void
  clearReconciledDutyLeaves: () => void
  surveys: SurveyItem[]
  universityResults: UniversityResult[]
  courses: Course[]
  academicAnalysis: AcademicAnalysis | null
  isCommandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  login: (username: string, pass: string, instId: string, instName?: string) => Promise<void>
  loginDemo: () => void
  logout: () => void
  refreshData: (force?: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => etlabClient.getSession())
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [attendance, setAttendance] = useState<SubjectAttendance[] | null>(null)
  const [timetable, setTimetable] = useState<DayTimetable[] | null>(null)
  const [evaluations, setEvaluations] = useState<EvaluationsData | null>(null)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [fees, setFees] = useState<FeesData | null>(null)
  const [activityPoints, setActivityPoints] = useState<ActivityPointsData | null>(null)
  const [dutyLeaves, setDutyLeaves] = useState<DutyLeave[]>([])
  const [pendingDutyLeaves, setPendingDutyLeaves] = useState<PendingDutyLeave[]>(() => {
    try {
      const studentKey = session?.username || 'default'
      const saved = localStorage.getItem(`etbridge_pending_dl_${studentKey}`)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [surveys, setSurveys] = useState<SurveyItem[]>([])
  const [universityResults, setUniversityResults] = useState<UniversityResult[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [academicAnalysis, setAcademicAnalysis] = useState<AcademicAnalysis | null>(null)
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
  })

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)')
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Save pending duty leaves to localStorage when state or student changes
  useEffect(() => {
    try {
      const studentKey = session?.username || 'default'
      localStorage.setItem(`etbridge_pending_dl_${studentKey}`, JSON.stringify(pendingDutyLeaves))
    } catch (e) {
      console.warn('Failed to save pending duty leaves:', e)
    }
  }, [pendingDutyLeaves, session?.username])

  // Auto-reconciliation: check if faculty has officially entered these into ETLab
  useEffect(() => {
    if (!pendingDutyLeaves.length) return

    let changed = false
    const updated = pendingDutyLeaves.map(p => {
      if (p.reconciled) return p

      // 1. Match against official duty leaves array from ETLab
      const isOfficial = dutyLeaves.some(official => {
        if (!official.from_date) return false
        const fDate = official.from_date.split(' ')[0]
        const tDate = (official.to_date || official.from_date).split(' ')[0]
        return p.date >= fDate && p.date <= tDate
      })

      // 2. Match against timetable periods marked 'duty_leave'
      const isOfficialInTimetable = (timetable || []).some(day => {
        if (day.date !== p.date) return false
        return day.sub?.some(period => {
          if (period.attendance_status === 'duty_leave') {
            if (Array.isArray(p.selectedHours) && p.selectedHours.length > 0) {
              if (p.selectedHours.includes(period.hour)) return true
            }
            if (!p.subject_code) return true
            const c1 = (period.subject_code || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
            const c2 = p.subject_code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
            return c1 === c2
          }
          return false
        })
      })

      if (isOfficial || isOfficialInTimetable) {
        changed = true
        return {
          ...p,
          reconciled: true,
          reconciledAt: new Date().toISOString()
        }
      }

      return p
    })

    if (changed) {
      setPendingDutyLeaves(updated)
    }
  }, [dutyLeaves, timetable, pendingDutyLeaves])

  const totalPendingDlHours = pendingDutyLeaves
    .filter(p => !p.reconciled)
    .reduce((acc, p) => acc + (p.hours || 0), 0)

  const addPendingDutyLeave = (item: Omit<PendingDutyLeave, 'id' | 'createdAt' | 'reconciled'>) => {
    const newItem: PendingDutyLeave = {
      ...item,
      id: `pdl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      reconciled: false
    }
    setPendingDutyLeaves(prev => [newItem, ...prev])
  }

  const deletePendingDutyLeave = (id: string) => {
    setPendingDutyLeaves(prev => prev.filter(p => p.id !== id))
  }

  const clearReconciledDutyLeaves = () => {
    setPendingDutyLeaves(prev => prev.filter(p => !p.reconciled))
  }

  const refreshData = useCallback(async (force = false) => {
    if (!etlabClient.isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Stream and hydrate each endpoint as soon as it resolves
      const profPromise = etlabClient.getProfile(force).then(data => { if (data) setProfile(data); return data }).catch(() => null)
      const attPromise = etlabClient.getAttendance(undefined, force).then(data => { if (data) setAttendance(data); return data }).catch(() => null)
      const ttPromise = etlabClient.getMonthlyTimetable(undefined, force).then(data => { if (data) setTimetable(data); return data }).catch(() => null)
      const evPromise = etlabClient.getEvaluations(undefined, force).then(data => { if (data) setEvaluations(data); return data }).catch(() => null)
      const teachersPromise = etlabClient.getTeachers(force).then(data => { if (data) setTeachers(data); return data }).catch(() => [])
      const materialsPromise = etlabClient.getStudyMaterials(force).then(data => { if (data) setMaterials(data); return data }).catch(() => [])
      const feesPromise = etlabClient.getFees(force).then(data => { if (data) setFees(data); return data }).catch(() => null)
      const actPromise = etlabClient.getActivityPoints(force).then(data => { if (data) setActivityPoints(data); return data }).catch(() => null)
      const dutyPromise = etlabClient.getDutyLeaves(force).then(data => { if (data) setDutyLeaves(data); return data }).catch(() => [])
      const surveyPromise = etlabClient.getSurveys(force).then(data => { if (data) setSurveys(data); return data }).catch(() => [])
      const resPromise = etlabClient.getUniversityResults(force).then(data => { if (data) setUniversityResults(data); return data }).catch(() => [])
      const coursesPromise = etlabClient.getCourses(force).then(data => { if (data) setCourses(data); return data }).catch(() => [])
      const analysisPromise = etlabClient.getAcademicAnalysis(force).then(data => { if (data) setAcademicAnalysis(data); return data }).catch(() => null)

      // Ensure core dashboard metrics settle first
      await Promise.allSettled([profPromise, attPromise, ttPromise, evPromise])
      // Await all background collections
      await Promise.allSettled([
        teachersPromise,
        materialsPromise,
        feesPromise,
        actPromise,
        dutyPromise,
        surveyPromise,
        resPromise,
        coursesPromise,
        analysisPromise
      ])
    } catch (err) {
      console.error('Error refreshing student data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) {
      refreshData(false)
    } else {
      setLoading(false)
    }
  }, [session, refreshData])

  const login = async (username: string, pass: string, instId: string, instName?: string) => {
    setLoading(true)
    try {
      const newSession = await etlabClient.login(username, pass, instId, instName)
      setSession(newSession)
      await refreshData(true)
    } finally {
      setLoading(false)
    }
  }

  const loginDemo = () => {
    const demo = etlabClient.setDemoSession()
    setSession(demo)
    refreshData(true)
  }

  const logout = () => {
    etlabClient.setSession(null)
    setSession(null)
    setProfile(null)
    setAttendance(null)
    setTimetable(null)
    setEvaluations(null)
    setTeachers([])
    setMaterials([])
    setFees(null)
    setActivityPoints(null)
    setDutyLeaves([])
    setSurveys([])
    setUniversityResults([])
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session?.token,
        isDemo: etlabClient.isDemo(),
        isStandalone,
        loading,
        profile,
        attendance,
        timetable,
        evaluations,
        teachers,
        materials,
        fees,
        activityPoints,
        dutyLeaves,
        pendingDutyLeaves,
        totalPendingDlHours,
        addPendingDutyLeave,
        deletePendingDutyLeave,
        clearReconciledDutyLeaves,
        surveys,
        universityResults,
        courses,
        academicAnalysis,
        isCommandPaletteOpen,
        openCommandPalette: () => setIsCommandPaletteOpen(true),
        closeCommandPalette: () => setIsCommandPaletteOpen(false),
        login,
        loginDemo,
        logout,
        refreshData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
