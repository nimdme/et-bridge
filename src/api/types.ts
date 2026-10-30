export interface Institute {
  id: string
  name: string
  shortName?: string
  apiBaseUrl?: string
  domains?: string[]
  keywords?: string[]
}

export interface AuthSession {
  token: string
  instituteId: string
  instituteName: string
  username: string
  studentName?: string
}

export interface TimetablePeriod {
  hour: number
  date?: string
  day?: string
  type?: string
  subject_type?: string
  subject: string
  subject_code: string
  teacher_name: string
  attendance_status?: 'present' | 'absent' | 'duty_leave' | 'not_marked' | string
  covered_topics?: string[]
  change?: 'substitution' | 'special' | string
  in_place_of?: string
  regular_subject?: string
  suspended?: boolean
  suspension_reason?: string
}

export interface DayTimetable {
  date: string
  day: string
  sub: TimetablePeriod[]
  all_hours_suspended?: boolean
}

export interface StudentProfile {
  login: boolean
  name: string
  student_id: number | string
  roll_no: string
  admission_no: string
  register_no: string
  curnt_sem: string | number
  sem_id: number
  batch_id: number
  course: string
  email: string
  phone: string
  gender?: string
  attendance: {
    total_classes: number
    classes_attended: number
    percentage: number
  }
  timetable: TimetablePeriod[]
  notices?: NoticeItem[]
  circulars?: CircularItem[]
}

export interface SubjectAttendance {
  key: string
  subject: string
  code: string
  display_code?: string
  subject_type: string
  teacher_name: string
  class_attended: number
  total_classes: number
  total_subject?: string | number
  percentage: number
  regular_hours?: number
  regular_present_hours?: number
  absent_hours: number
  attendance_target: number
  can_miss_hours: number
  must_attend_hours: number
}

export interface SeriesExam {
  id: number | string
  subject: string
  subject_code: string
  subject_name?: string
  title: string
  date: string
  period?: number
  maximum_mark: number
  mark: number | string
  status: string
  exam_type?: string
}

export interface Assignment {
  id: number | string
  subject: string
  subject_code: string
  subject_name?: string
  subject_type?: string
  title: string
  details?: string
  issue_date?: string
  last_date: string
  status: string
  can_download?: boolean
  can_submit?: boolean
  upload?: boolean
  url?: string
  can_delete_submission?: boolean
  submission_mode?: string
  max_mark?: string | number
  mark?: string | number
  submission_kinds?: string[]
}

export interface EvaluationsData {
  login: boolean
  series_exams?: SeriesExam[]
  assignments?: Assignment[]
  homeworks?: any[]
  module_tests?: any[]
  internal_marks?: any[]
  class_projects?: any[]
}

export interface Teacher {
  id: number | string
  user_id?: number
  name: string
  email?: string
  phone?: string
  subject?: string
  photo?: string
  designation?: string
  is_hod?: boolean
  is_staff_advisor?: boolean
  is_mentor?: boolean
  role_label?: string
}

export interface StudyMaterial {
  id: number | string
  title: string
  details?: string
  subject: string
  teacher?: string
  file_name?: string
  link?: string
  module?: string | number
  files?: string[]
  added_on: string
}

export interface FeesData {
  login: boolean
  total_fee: number
  total_paid: number
  total_balance: number
  has_due: boolean
  can_pay: boolean
  fees?: any[]
  items?: any[]
  receipts?: any[]
  fee_types?: Array<{
    fee_type_id: number
    fee_type_name: string
    installments?: any[]
  }>
}

export interface ActivityPointsData {
  flow?: string
  total_points_awarded: number | string
  awarded?: Array<{
    id: number | string
    activity_name: string
    category?: string
    points: number | string
    semester?: string
    status?: string
    date?: string
  }>
  semesters?: Array<{
    id: number
    name: string
  }>
}

export interface DutyLeave {
  id: number | string
  reason?: string
  from_date?: string
  to_date?: string
  status?: string
  hours?: number
  approved_by?: string
  submitted_on?: string
}

export interface PendingDutyLeave {
  id: string
  reason: string
  date: string
  endDate?: string
  hours: number
  selectedHours: number[]
  subject_code?: string
  subject_name?: string
  notes?: string
  createdAt: string
  reconciled?: boolean
  reconciledAt?: string
}

export interface SurveyItem {
  id: number | string
  name: string
  subject?: string
  teacher_names?: string
  session?: string
  status?: string
  start_date?: string
  deadline?: string
  is_open?: boolean
}

export interface UniversityResult {
  exam_id?: number | string
  exam_name: string
  semester?: string | number
  sgpa?: number | string
  cgpa?: number | string
  results?: Array<{
    course_code: string
    course_name: string
    grade: string
    credits: number
  }>
}

export interface NoticeItem {
  id: number | string
  title: string
  content?: string
  date: string
  source?: string
  posted_by?: string
  created_at?: string
}

export interface CircularItem {
  id: number | string
  title: string
  description?: string
  url?: string
  date: string
}

export interface DashboardData {
  notices: NoticeItem[]
  circulars: CircularItem[]
  teachers?: Teacher[]
  study_materials?: StudyMaterial[]
}

export interface Course {
  id: number | string
  name: string
  code: string
  credits: number
  type: string
  type_code?: number
  slot?: string
  semester_id?: number
  hours?: number
  teacher_name?: string
  teacher_id?: number
  atten_text?: string
  atten_per?: string | number
  route_token?: string
  route_path?: string
}

export interface SyllabusTopic {
  id: number | string
  module: number
  topic: string
  covered: boolean
  hours: number
  topic_type?: number
  is_extra?: boolean
}

export interface CourseOutcome {
  id: number | string
  code: string // e.g. CO1, CO2
  description: string
  bloom_level?: string
}

export interface CourseExecution {
  id: number | string
  date: string
  hour: number
  topic: string
  status: 'conducted' | 'pending' | string
}

export interface SourceBook {
  id: number | string
  title: string
  author: string
  publisher?: string
  edition?: string
  is_reference?: boolean
}

export interface CourseDetails {
  id: number | string
  name: string
  code: string
  syllabus: SyllabusTopic[]
  outcomes?: CourseOutcome[]
  execution?: CourseExecution[]
  source_books?: SourceBook[]
}

export interface CourseRisk {
  code: string
  name: string
  semester: string
  attendance_per: number
  evaluation_avg: number
  risk_level: number // 1 to 5
  reasons?: string[]
}

export interface SemesterAnalysis {
  position: number
  semester: string
  sgpa: number | string
  gpa?: number | string
  credit: number
  is_passed: number
  result: string
  attendance?: {
    present: number
    total: number
    percent: number
  }
  cumulative_cgpa?: number
  cumulative_credit?: number
  total_backlogs?: number
  total_courses?: number
  subjects?: any[]
}

export interface AcademicAnalysis {
  name: string
  cgpa: number
  earned_credit: number
  total_credit: number
  total_backlogs: number
  total_passed: number
  total_exams: number
  student?: {
    name: string
    admissionNo: string
    batch: string
    current_sem: number | string
    cgpa: number
    cumulative_credit: number
    total_backlogs: number
    current_backlogs: number
  }
  courses_at_risk?: CourseRisk[]
  semesters: SemesterAnalysis[]
}
