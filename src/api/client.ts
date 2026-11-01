import { 
  Institute, 
  StudentProfile, 
  SubjectAttendance, 
  DayTimetable, 
  EvaluationsData, 
  DashboardData,
  AuthSession,
  Teacher,
  StudyMaterial,
  FeesData,
  ActivityPointsData,
  DutyLeave,
  SurveyItem,
  UniversityResult,
  Course,
  CourseDetails,
  AcademicAnalysis
} from './types'
import { 
  FALLBACK_INSTITUTES, 
  DEMO_PROFILE, 
  DEMO_ATTENDANCE, 
  DEMO_EVALUATIONS, 
  DEMO_MONTH_TIMETABLE,
  DEMO_TEACHERS,
  DEMO_MATERIALS,
  DEMO_FEES,
  DEMO_ACTIVITY_POINTS,
  DEMO_DUTY_LEAVES,
  DEMO_SURVEYS,
  DEMO_RESULTS,
  DEMO_COURSES,
  DEMO_COURSE_DETAILS,
  DEMO_ACADEMIC_ANALYSIS
} from './mockData'
import { parsePercent, parseNumber } from '../utils/format'

const API_BASE_URL = 'https://api.students.etlab.app/api/v1'

class EtlabApiClient {
  private session: AuthSession | null = null
  private isDemoMode: boolean = false

  constructor() {
    this.loadSession()
  }

  public loadSession(): AuthSession | null {
    try {
      const saved = localStorage.getItem('etbridge_session')
      if (saved) {
        this.session = JSON.parse(saved)
        this.isDemoMode = this.session?.token === 'demo-token'
        return this.session
      }
    } catch (e) {
      console.warn('Failed to parse saved session:', e)
    }
    return null
  }

  public setSession(session: AuthSession | null) {
    this.session = session
    this.isDemoMode = session?.token === 'demo-token'
    if (session) {
      localStorage.setItem('etbridge_session', JSON.stringify(session))
    } else {
      localStorage.removeItem('etbridge_session')
      localStorage.removeItem('etbridge_cached_profile')
      localStorage.removeItem('etbridge_cached_attendance')
      localStorage.removeItem('etbridge_cached_timetable')
      localStorage.removeItem('etbridge_cached_evaluations')
      localStorage.removeItem('etbridge_cached_teachers')
      localStorage.removeItem('etbridge_cached_materials')
      localStorage.removeItem('etbridge_cached_fees')
      localStorage.removeItem('etbridge_cached_activity_points')
      localStorage.removeItem('etbridge_cached_courses')
      localStorage.removeItem('etbridge_cached_analysis')
      localStorage.removeItem('etbridge_cached_dutyleaves')
      localStorage.removeItem('etbridge_cached_surveys')
      localStorage.removeItem('etbridge_cached_resultsuniversity')
    }
  }

  public getSession(): AuthSession | null {
    return this.session
  }

  public isAuthenticated(): boolean {
    return !!this.session?.token
  }

  public isDemo(): boolean {
    return this.isDemoMode
  }

  public setDemoSession(): AuthSession {
    const demoSession: AuthSession = {
      token: 'demo-token',
      instituteId: 'demo',
      instituteName: 'Engineering College (Demo)',
      username: 'DEMO_STUDENT',
      studentName: 'Arjun K. V.'
    }
    this.setSession(demoSession)
    return demoSession
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (this.session?.token) {
      headers['Authorization'] = `Bearer ${this.session.token}`
    }

    if (this.session?.instituteId) {
      headers['X-Institute-ID'] = this.session.instituteId
    }

    return headers
  }

  // --- 1. Institutes ---
  public async getInstitutes(): Promise<Institute[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/institutes`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          return data
        }
      }
    } catch (err) {
      console.warn('Failed to fetch remote institutes, using fallback list:', err)
    }
    return FALLBACK_INSTITUTES
  }

  // --- 2. Login ---
  public async login(username: string, password: string, instituteId: string, instituteName?: string): Promise<AuthSession> {
    if (username.toLowerCase() === 'demo' && password.toLowerCase() === 'demo') {
      return this.setDemoSession()
    }

    const payload = {
      username: username.trim(),
      password,
      institute_id: instituteId
    }

    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      throw new Error(`Server returned error HTTP ${res.status}`)
    }

    const data = await res.json()
    if (!data.login || !data.token) {
      throw new Error(data.error || 'Invalid username or password.')
    }

    const session: AuthSession = {
      token: data.token,
      instituteId,
      instituteName: instituteName || instituteId.toUpperCase(),
      username: username.trim(),
      studentName: data.name || username
    }

    this.setSession(session)
    return session
  }

  // --- 3. Profile & Today's Schedule ---
  public async getProfile(forceRefresh = false): Promise<StudentProfile> {
    if (this.isDemoMode) {
      return DEMO_PROFILE
    }

    const cacheKey = 'etbridge_cached_profile'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: this.getHeaders()
    })

    if (!res.ok) {
      throw new Error(`Failed to load profile (${res.status})`)
    }

    const raw: any = await res.json()
    const data: StudentProfile = {
      ...raw,
      attendance: {
        total_classes: parseNumber(raw.attendance?.total_classes),
        classes_attended: parseNumber(raw.attendance?.classes_attended),
        percentage: parsePercent(raw.attendance?.percentage)
      },
      timetable: Array.isArray(raw.timetable) ? raw.timetable : []
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } catch {}

    return data
  }

  // --- 4. Subject Attendance ---
  public async getAttendance(semId?: number, forceRefresh = false): Promise<SubjectAttendance[]> {
    if (this.isDemoMode) {
      return DEMO_ATTENDANCE
    }

    const cacheKey = 'etbridge_cached_attendance'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    const url = new URL(`${API_BASE_URL}/attendancebysubject`)
    if (semId) url.searchParams.set('sem_id', String(semId))

    const res = await fetch(url.toString(), {
      headers: this.getHeaders()
    })

    if (!res.ok) {
      throw new Error(`Failed to load attendance (${res.status})`)
    }

    const rawList: any[] = await res.json()
    const data: SubjectAttendance[] = (Array.isArray(rawList) ? rawList : []).map(sub => ({
      ...sub,
      class_attended: parseNumber(sub.class_attended),
      total_classes: parseNumber(sub.total_classes),
      percentage: parsePercent(sub.percentage),
      attendance_target: parseNumber(sub.attendance_target, 75),
      can_miss_hours: parseNumber(sub.can_miss_hours, 0),
      must_attend_hours: parseNumber(sub.must_attend_hours, 0),
      absent_hours: parseNumber(sub.absent_hours, 0)
    }))

    try {
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } catch {}

    return data
  }

  // --- 5. Monthly Timetable ---
  public async getMonthlyTimetable(monthStr?: string, forceRefresh = false): Promise<DayTimetable[]> {
    if (this.isDemoMode) {
      return DEMO_MONTH_TIMETABLE
    }

    const now = new Date()
    const month = monthStr || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const cacheKey = `etbridge_cached_timetable_${month}`

    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/timetablenew?month=${month}`, {
        headers: this.getHeaders()
      })

      if (res.ok) {
        const data = await res.json()
        const timetable: DayTimetable[] = data.timetable || []
        try {
          localStorage.setItem(cacheKey, JSON.stringify(timetable))
        } catch {}
        return timetable
      }
    } catch (err) {
      console.warn('Failed to load monthly timetable, using cached fallback:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return []
  }

  // --- 5b. Semester Timetable (Multi-Month Aggregation) ---
  public async getSemesterTimetable(forceRefresh = false): Promise<DayTimetable[]> {
    if (this.isDemoMode) {
      return DEMO_MONTH_TIMETABLE
    }

    const cacheKey = 'etbridge_cached_semester_timetable'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-12

    // Fetch current month and preceding months of semester
    const monthsToFetch: string[] = []
    for (let i = 0; i < 4; i++) {
      let m = currentMonth - i
      let y = currentYear
      if (m <= 0) {
        m += 12
        y -= 1
      }
      monthsToFetch.push(`${y}-${String(m).padStart(2, '0')}`)
    }

    try {
      const results = await Promise.allSettled(
        monthsToFetch.map(m => this.getMonthlyTimetable(m, forceRefresh))
      )

      const mergedMap = new Map<string, DayTimetable>()
      results.forEach(res => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          res.value.forEach(day => {
            if (day && day.date) {
              mergedMap.set(day.date, day)
            }
          })
        }
      })

      const combined = Array.from(mergedMap.values()).sort((a, b) => b.date.localeCompare(a.date))
      if (combined.length > 0) {
        try { localStorage.setItem(cacheKey, JSON.stringify(combined)) } catch {}
        return combined
      }
    } catch (err) {
      console.warn('Failed to fetch semester timetable:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return []
  }

  // --- 6. Evaluations & Marks ---
  public async getEvaluations(semId?: number, forceRefresh = false): Promise<EvaluationsData> {
    if (this.isDemoMode) {
      return DEMO_EVALUATIONS
    }

    const cacheKey = 'etbridge_cached_evaluations'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    const url = new URL(`${API_BASE_URL}/evaluations`)
    if (semId) url.searchParams.set('sem_id', String(semId))

    try {
      const res = await fetch(url.toString(), {
        headers: this.getHeaders()
      })

      if (res.ok) {
        const data: EvaluationsData = await res.json()
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data))
        } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load evaluations:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }

    return { login: true, series_exams: [], assignments: [] }
  }

  // --- 6b. Upload & Delete Assignment ---
  public async uploadAssignment(assignmentId: number | string, file: File): Promise<void> {
    if (this.isDemoMode) {
      // Mock upload delay
      await new Promise(r => setTimeout(r, 600))
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (this.session?.token) {
      headers['Authorization'] = `Bearer ${this.session.token}`
    }
    if (this.session?.instituteId) {
      headers['X-Institute-ID'] = this.session.instituteId
    }

    const res = await fetch(`${API_BASE_URL}/uploadassignment/${assignmentId}`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!res.ok) {
      throw new Error(`Upload failed with server status ${res.status}`)
    }
  }

  public async deleteAssignment(assignmentId: number | string): Promise<void> {
    if (this.isDemoMode) {
      await new Promise(r => setTimeout(r, 400))
      return
    }

    const res = await fetch(`${API_BASE_URL}/deleteassignment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ assignment_id: assignmentId })
    })

    if (!res.ok) {
      throw new Error(`Delete submission failed with status ${res.status}`)
    }
  }

  // --- 7. Teachers / Faculty Directory ---
  public async getTeachers(forceRefresh = false): Promise<Teacher[]> {
    if (this.isDemoMode) {
      return DEMO_TEACHERS
    }

    const cacheKey = 'etbridge_cached_teachers'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/teachers`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data: Teacher[] = await res.json()
        try { localStorage.setItem(cacheKey, JSON.stringify(data)) } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load teachers:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return DEMO_TEACHERS
  }

  // --- 8. Study Materials & Notes ---
  public async getStudyMaterials(forceRefresh = false): Promise<StudyMaterial[]> {
    if (this.isDemoMode) {
      return DEMO_MATERIALS
    }

    const cacheKey = 'etbridge_cached_materials'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/studymaterials`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const raw: any[] = await res.json()
        const data: StudyMaterial[] = (Array.isArray(raw) ? raw : []).map(m => ({
          ...m,
          link: m.file_name ? (m.file_name.startsWith('http') ? m.file_name : `https://api.students.etlab.app${m.file_name}`) : '#'
        }))
        try { localStorage.setItem(cacheKey, JSON.stringify(data)) } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load study materials:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return []
  }

  // --- 9. Fees & Dues ---
  public async getFees(forceRefresh = false): Promise<FeesData> {
    if (this.isDemoMode) {
      return DEMO_FEES
    }

    const cacheKey = 'etbridge_cached_fees'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/fees`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data: FeesData = await res.json()
        try { localStorage.setItem(cacheKey, JSON.stringify(data)) } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load fees:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return DEMO_FEES
  }

  // --- 10. KTU Activity Points ---
  public async getActivityPoints(forceRefresh = false): Promise<ActivityPointsData> {
    if (this.isDemoMode) {
      return DEMO_ACTIVITY_POINTS
    }

    const cacheKey = 'etbridge_cached_activity_points'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/activitypoints/legacy`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data: ActivityPointsData = await res.json()
        try { localStorage.setItem(cacheKey, JSON.stringify(data)) } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load activity points:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return DEMO_ACTIVITY_POINTS
  }

  // --- 11. Duty Leaves ---
  public async getDutyLeaves(forceRefresh = false): Promise<DutyLeave[]> {
    if (this.isDemoMode) {
      return DEMO_DUTY_LEAVES
    }

    const cacheKey = 'etbridge_cached_dutyleaves'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/dutyleaves`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        try { localStorage.setItem(cacheKey, JSON.stringify(list)) } catch {}
        return list
      }
    } catch (err) {
      console.warn('Failed to load duty leaves:', err)
    }
    return []
  }

  // --- 12. Surveys ---
  public async getSurveys(forceRefresh = false): Promise<SurveyItem[]> {
    if (this.isDemoMode) {
      return DEMO_SURVEYS
    }

    const cacheKey = 'etbridge_cached_surveys'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/surveys`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        try { localStorage.setItem(cacheKey, JSON.stringify(list)) } catch {}
        return list
      }
    } catch (err) {
      console.warn('Failed to load surveys:', err)
    }
    return []
  }

  // --- 13. University Results ---
  public async getUniversityResults(forceRefresh = false): Promise<UniversityResult[]> {
    if (this.isDemoMode) {
      return DEMO_RESULTS
    }

    const cacheKey = 'etbridge_cached_resultsuniversity'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/resultsuniversity`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        const list = Array.isArray(data.results) ? data.results : []
        try { localStorage.setItem(cacheKey, JSON.stringify(list)) } catch {}
        return list
      }
    } catch (err) {
      console.warn('Failed to load university results:', err)
    }
    return []
  }

  // --- 14. Dashboard Notices ---
  public async getDashboard(): Promise<DashboardData> {
    if (this.isDemoMode) {
      return {
        notices: DEMO_PROFILE.notices || [],
        circulars: DEMO_PROFILE.circulars || []
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (err) {
      console.warn('Failed to fetch dashboard notices:', err)
    }

    return { notices: [], circulars: [] }
  }

  // --- 15. Courses & Syllabus ---
  public async getCourses(forceRefresh = false): Promise<Course[]> {
    if (this.isDemoMode) {
      return DEMO_COURSES
    }

    const cacheKey = 'etbridge_cached_courses'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/subjects`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const raw: any[] = await res.json()
        const data: Course[] = (Array.isArray(raw) ? raw : []).map(c => ({
          ...c,
          atten_per: parsePercent(c.atten_per),
          credits: parseNumber(c.credits)
        }))
        try { localStorage.setItem(cacheKey, JSON.stringify(data)) } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load courses from API:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return DEMO_COURSES
  }

  public async getCourseDetails(courseId: number | string): Promise<CourseDetails> {
    if (this.isDemoMode || !this.session?.token) {
      return DEMO_COURSE_DETAILS[courseId] || {
        id: courseId,
        name: 'Course Details',
        code: 'COURSE',
        syllabus: [
          { id: 1, module: 1, topic: 'Fundamental Principles and Overview', covered: true, hours: 3 },
          { id: 2, module: 2, topic: 'Core Theoretical Framework and Analysis', covered: true, hours: 4 },
          { id: 3, module: 3, topic: 'Advanced Applications and Problem Solving', covered: false, hours: 4 },
          { id: 4, module: 4, topic: 'Design Methodology and Practical Synthesis', covered: false, hours: 3 }
        ],
        outcomes: [
          { id: 1, code: 'CO1', description: 'Understand basic foundational principles.', bloom_level: 'Understand (Level 2)' },
          { id: 2, code: 'CO2', description: 'Apply concepts to real-world engineering problems.', bloom_level: 'Apply (Level 3)' },
          { id: 3, code: 'CO3', description: 'Analyze complex scenarios and evaluate designs.', bloom_level: 'Analyze (Level 4)' }
        ],
        execution: [
          { id: 1, date: '2026-09-10', hour: 1, topic: 'Introduction & Course Syllabus discussion', status: 'conducted' },
          { id: 2, date: '2026-09-15', hour: 2, topic: 'Foundational concepts and principles', status: 'conducted' }
        ],
        source_books: [
          { id: 1, title: 'Standard Engineering Reference', author: 'Prescribed Faculty Author', publisher: 'Academic Press', is_reference: false }
        ]
      }
    }

    try {
      // Try to fetch syllabus from ETLab
      const res = await fetch(`${API_BASE_URL}/syllabus/${courseId}`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const raw = await res.json()
        const syllabus = Array.isArray(raw.topics) ? raw.topics : []
        const fallback = DEMO_COURSE_DETAILS[courseId]
        return {
          id: courseId,
          name: raw.subject || 'Course',
          code: raw.code || '',
          syllabus,
          outcomes: fallback?.outcomes || [
            { id: 1, code: 'CO1', description: 'Apply concepts to solve core problems.', bloom_level: 'Apply' },
            { id: 2, code: 'CO2', description: 'Analyze engineering scenarios accurately.', bloom_level: 'Analyze' }
          ],
          execution: fallback?.execution || [],
          source_books: fallback?.source_books || []
        }
      }
    } catch (err) {
      console.warn('Failed to load course details from API:', err)
    }

    return DEMO_COURSE_DETAILS[courseId] || {
      id: courseId,
      name: 'Course Details',
      code: '',
      syllabus: []
    }
  }

  // --- 16. Academic Analysis ---
  public async getAcademicAnalysis(forceRefresh = false): Promise<AcademicAnalysis> {
    if (this.isDemoMode) {
      return DEMO_ACADEMIC_ANALYSIS
    }

    const cacheKey = 'etbridge_cached_analysis'
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try { return JSON.parse(cached) } catch {}
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/academicanalysis`, {
        headers: this.getHeaders()
      })
      if (res.ok) {
        const data: AcademicAnalysis = await res.json()
        // If API didn't compute courses_at_risk, populate from subjects / attendance
        if (!data.courses_at_risk || data.courses_at_risk.length === 0) {
          const risks: any[] = []
          if (Array.isArray(data.semesters)) {
            data.semesters.forEach(sem => {
              if (Array.isArray(sem.subjects)) {
                sem.subjects.forEach(sub => {
                  const att = sub.attendance?.percent ?? 100
                  let evalAvg = 0
                  if (Array.isArray(sub.evaluations) && sub.evaluations.length > 0) {
                    const totalMarks = sub.evaluations.reduce((acc: number, ev: any) => acc + (ev.mark || 0), 0)
                    const maxMarks = sub.evaluations.reduce((acc: number, ev: any) => acc + (ev.maximum_mark || 40), 0)
                    evalAvg = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0
                  }
                  if (att < 75 || (evalAvg > 0 && evalAvg < 40)) {
                    risks.push({
                      code: sub.code || 'COURSE',
                      name: sub.subject_name || sub.subject_full_name || sub.code,
                      semester: sem.semester,
                      attendance_per: att,
                      evaluation_avg: evalAvg,
                      risk_level: att < 68 ? 4 : att < 75 ? 3 : 2
                    })
                  }
                })
              }
            })
          }
          data.courses_at_risk = risks.length > 0 ? risks : DEMO_ACADEMIC_ANALYSIS.courses_at_risk
        }
        try { localStorage.setItem(cacheKey, JSON.stringify(data)) } catch {}
        return data
      }
    } catch (err) {
      console.warn('Failed to load academic analysis:', err)
    }

    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try { return JSON.parse(cached) } catch {}
    }
    return DEMO_ACADEMIC_ANALYSIS
  }
}

export const etlabClient = new EtlabApiClient()
