import { 
  StudentProfile, 
  SubjectAttendance, 
  DayTimetable, 
  EvaluationsData, 
  Institute, 
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

export const FALLBACK_INSTITUTES: Institute[] = [
  { id: 'cev', name: 'College of Engineering Vadakara', shortName: 'CEV' },
  { id: 'gcek', name: 'Government College of Engineering Kannur', shortName: 'GCEK' },
  { id: 'mace', name: 'Mar Athanasius College of Engineering', shortName: 'MACE' },
  { id: 'tkmce', name: 'TKM College of Engineering', shortName: 'TKMCE' },
  { id: 'jec', name: 'Jyothi Engineering College Thrissur', shortName: 'JEC' },
  { id: 'vjec', name: 'Vimal Jyothi College of Engineering', shortName: 'VJEC' },
  { id: 'gecw', name: 'Government Engineering College Wayanad', shortName: 'GECW' },
  { id: 'sbce', name: 'Sree Buddha College of Engineering', shortName: 'SBCE' },
  { id: 'baselius', name: 'Baselius College Kottayam', shortName: 'Baselius' },
  { id: 'asiet', name: 'Adi Shankara Institute of Engineering & Tech', shortName: 'ASIET' },
  { id: 'carmelcet', name: 'Carmel College of Engineering & Tech', shortName: 'CCET' },
  { id: 'christ', name: 'Christ College of Engineering Irinjalakuda', shortName: 'CCE' },
]

export const DEMO_PROFILE: StudentProfile = {
  login: true,
  name: 'Arjun K. V.',
  student_id: 12973,
  roll_no: '22',
  admission_no: 'KTU22CS045',
  register_no: 'KTU22CS045',
  curnt_sem: 'S5',
  sem_id: 5,
  batch_id: 2022,
  course: 'Computer Science and Engineering',
  email: 'arjun.cs22@engg.edu.in',
  phone: '+91 98765 43210',
  gender: 'Male',
  attendance: {
    total_classes: 184,
    classes_attended: 154,
    percentage: 83.7
  },
  timetable: [
    {
      hour: 1,
      type: 'T',
      subject_type: 'Theory',
      subject: 'Formal Languages and Automata Theory',
      subject_code: 'CST301',
      teacher_name: 'Dr. Suresh Kumar',
      attendance_status: 'present'
    },
    {
      hour: 2,
      type: 'T',
      subject_type: 'Theory',
      subject: 'Computer Networks',
      subject_code: 'CST303',
      teacher_name: 'Prof. Anjali Nair',
      attendance_status: 'present'
    },
    {
      hour: 3,
      type: 'T',
      subject_type: 'Theory',
      subject: 'System Software',
      subject_code: 'CST305',
      teacher_name: 'Dr. Manoj V.',
      attendance_status: 'absent'
    },
    {
      hour: 4,
      type: 'L',
      subject_type: 'Lab',
      subject: 'System Software & Microprocessors Lab',
      subject_code: 'CSL331',
      teacher_name: 'Prof. Divya R.',
      attendance_status: 'present'
    },
    {
      hour: 5,
      type: 'L',
      subject_type: 'Lab',
      subject: 'System Software & Microprocessors Lab',
      subject_code: 'CSL331',
      teacher_name: 'Prof. Divya R.',
      attendance_status: 'present'
    },
    {
      hour: 6,
      type: 'T',
      subject_type: 'Theory',
      subject: 'Management of Software Systems',
      subject_code: 'CST307',
      teacher_name: 'Dr. Radhika P.',
      attendance_status: 'not_marked'
    }
  ],
  notices: [
    {
      id: 1,
      title: 'Series Exam II Schedule Published',
      content: 'Series Examination 2 for S5 B.Tech will commence from next Monday. Timetable is available on the departmental notice board.',
      date: '2026-10-28',
      posted_by: 'Academic Cell'
    },
    {
      id: 2,
      title: 'Duty Leave submission deadline for Tech Fest',
      content: 'All volunteers and participants must submit duty leave forms before 4:00 PM this Friday.',
      date: '2026-10-25',
      posted_by: 'Staff Advisor'
    }
  ],
  circulars: [
    {
      id: 101,
      title: 'KTU Exam Registration Notification — Nov 2026',
      description: 'Registration for regular and supplementary university exams is open on KTU portal.',
      date: '2026-10-27',
      url: '#'
    }
  ]
}

export const DEMO_ATTENDANCE: SubjectAttendance[] = [
  {
    key: 'CST301',
    subject: 'Formal Languages and Automata Theory',
    code: 'CST301',
    display_code: 'CST301',
    subject_type: 'Theory',
    teacher_name: 'Dr. Suresh Kumar',
    class_attended: 31,
    total_classes: 36,
    percentage: 86.1,
    absent_hours: 5,
    attendance_target: 75,
    can_miss_hours: 5,
    must_attend_hours: 0
  },
  {
    key: 'CST303',
    subject: 'Computer Networks',
    code: 'CST303',
    display_code: 'CST303',
    subject_type: 'Theory',
    teacher_name: 'Prof. Anjali Nair',
    class_attended: 28,
    total_classes: 34,
    percentage: 82.35,
    absent_hours: 6,
    attendance_target: 75,
    can_miss_hours: 3,
    must_attend_hours: 0
  },
  {
    key: 'CST305',
    subject: 'System Software',
    code: 'CST305',
    display_code: 'CST305',
    subject_type: 'Theory',
    teacher_name: 'Dr. Manoj V.',
    class_attended: 24,
    total_classes: 32,
    percentage: 75.0,
    absent_hours: 8,
    attendance_target: 75,
    can_miss_hours: 0,
    must_attend_hours: 0
  },
  {
    key: 'CST307',
    subject: 'Management of Software Systems',
    code: 'CST307',
    display_code: 'CST307',
    subject_type: 'Theory',
    teacher_name: 'Dr. Radhika P.',
    class_attended: 20,
    total_classes: 28,
    percentage: 71.43,
    absent_hours: 8,
    attendance_target: 75,
    can_miss_hours: 0,
    must_attend_hours: 4
  },
  {
    key: 'CSL331',
    subject: 'System Software & Microprocessors Lab',
    code: 'CSL331',
    display_code: 'CSL331',
    subject_type: 'Lab',
    teacher_name: 'Prof. Divya R.',
    class_attended: 26,
    total_classes: 28,
    percentage: 92.86,
    absent_hours: 2,
    attendance_target: 75,
    can_miss_hours: 6,
    must_attend_hours: 0
  },
  {
    key: 'CSL333',
    subject: 'Database Management Systems Lab',
    code: 'CSL333',
    display_code: 'CSL333',
    subject_type: 'Lab',
    teacher_name: 'Prof. Rajesh K.',
    class_attended: 25,
    total_classes: 26,
    percentage: 96.15,
    absent_hours: 1,
    attendance_target: 75,
    can_miss_hours: 7,
    must_attend_hours: 0
  }
]

export const DEMO_EVALUATIONS: EvaluationsData = {
  login: true,
  series_exams: [
    {
      id: 1,
      subject: 'Formal Languages and Automata Theory',
      subject_code: 'CST301',
      title: 'Series Exam 1',
      date: '2026-09-15',
      period: 1,
      maximum_mark: 50,
      mark: 44,
      status: 'Evaluated'
    },
    {
      id: 2,
      subject: 'Computer Networks',
      subject_code: 'CST303',
      title: 'Series Exam 1',
      date: '2026-09-16',
      period: 1,
      maximum_mark: 50,
      mark: 41.5,
      status: 'Evaluated'
    },
    {
      id: 3,
      subject: 'System Software',
      subject_code: 'CST305',
      title: 'Series Exam 1',
      date: '2026-09-17',
      period: 1,
      maximum_mark: 50,
      mark: 38,
      status: 'Evaluated'
    },
    {
      id: 4,
      subject: 'Management of Software Systems',
      subject_code: 'CST307',
      title: 'Series Exam 1',
      date: '2026-09-18',
      period: 1,
      maximum_mark: 50,
      mark: 46,
      status: 'Evaluated'
    }
  ],
  assignments: [
    {
      id: 101,
      subject: 'Computer Networks',
      subject_code: 'CST303',
      title: 'Assignment 2: Subnetting & Routing Algorithms',
      details: 'Solve the provided subnet allocation problems and submit handwritten paper or PDF.',
      issue_date: '2026-10-15',
      last_date: '2026-10-31',
      status: 'Submitted',
      max_mark: 15
    },
    {
      id: 102,
      subject: 'Formal Languages & Automata',
      subject_code: 'CST301',
      title: 'Assignment 2: Turing Machine Design',
      details: 'Construct standard Turing Machines for palindrome recognition and unary multiplication.',
      issue_date: '2026-10-20',
      last_date: '2026-11-04',
      status: 'Pending',
      max_mark: 15
    }
  ]
}

export const DEMO_MONTH_TIMETABLE: DayTimetable[] = [
  {
    date: '2026-10-26',
    day: 'Monday',
    sub: [
      { hour: 1, subject: 'Formal Languages and Automata Theory', subject_code: 'CST301', teacher_name: 'Dr. Suresh Kumar', attendance_status: 'present' },
      { hour: 2, subject: 'Computer Networks', subject_code: 'CST303', teacher_name: 'Prof. Anjali Nair', attendance_status: 'present' },
      { hour: 3, subject: 'System Software', subject_code: 'CST305', teacher_name: 'Dr. Manoj V.', attendance_status: 'absent' },
      { hour: 4, subject: 'Management of Software Systems', subject_code: 'CST307', teacher_name: 'Dr. Radhika P.', attendance_status: 'present' },
      { hour: 5, subject: 'DBMS Lab', subject_code: 'CSL333', teacher_name: 'Prof. Rajesh K.', attendance_status: 'present' },
      { hour: 6, subject: 'DBMS Lab', subject_code: 'CSL333', teacher_name: 'Prof. Rajesh K.', attendance_status: 'present' }
    ]
  },
  {
    date: '2026-10-27',
    day: 'Tuesday',
    sub: [
      { hour: 1, subject: 'Computer Networks', subject_code: 'CST303', teacher_name: 'Prof. Anjali Nair', attendance_status: 'present' },
      { hour: 2, subject: 'System Software', subject_code: 'CST305', teacher_name: 'Dr. Manoj V.', attendance_status: 'present' },
      { hour: 3, subject: 'Formal Languages and Automata Theory', subject_code: 'CST301', teacher_name: 'Dr. Suresh Kumar', attendance_status: 'present' },
      { hour: 4, subject: 'Library / Seminar', subject_code: 'SEM301', teacher_name: 'Prof. Divya R.', attendance_status: 'present' },
      { hour: 5, subject: 'System Software Lab', subject_code: 'CSL331', teacher_name: 'Prof. Divya R.', attendance_status: 'present' },
      { hour: 6, subject: 'System Software Lab', subject_code: 'CSL331', teacher_name: 'Prof. Divya R.', attendance_status: 'present' }
    ]
  },
  {
    date: '2026-10-28',
    day: 'Wednesday',
    sub: [
      { hour: 1, subject: 'Management of Software Systems', subject_code: 'CST307', teacher_name: 'Dr. Radhika P.', attendance_status: 'present' },
      { hour: 2, subject: 'Formal Languages and Automata Theory', subject_code: 'CST301', teacher_name: 'Dr. Suresh Kumar', attendance_status: 'present' },
      { hour: 3, subject: 'Computer Networks', subject_code: 'CST303', teacher_name: 'Prof. Anjali Nair', attendance_status: 'present' },
      { hour: 4, subject: 'System Software', subject_code: 'CST305', teacher_name: 'Dr. Manoj V.', attendance_status: 'present' },
      { hour: 5, subject: 'Tutorial / Remedial', subject_code: 'TUT301', teacher_name: 'Dr. Suresh Kumar', attendance_status: 'present' },
      { hour: 6, subject: 'Sports / Physical Education', subject_code: 'PED301', teacher_name: 'Staff', attendance_status: 'present' }
    ]
  },
  {
    date: '2026-10-29',
    day: 'Thursday',
    sub: [
      { hour: 1, subject: 'Formal Languages and Automata Theory', subject_code: 'CST301', teacher_name: 'Dr. Suresh Kumar', attendance_status: 'present' },
      { hour: 2, subject: 'Computer Networks', subject_code: 'CST303', teacher_name: 'Prof. Anjali Nair', attendance_status: 'present' },
      { hour: 3, subject: 'System Software', subject_code: 'CST305', teacher_name: 'Dr. Manoj V.', attendance_status: 'absent' },
      { hour: 4, subject: 'System Software & Microprocessors Lab', subject_code: 'CSL331', teacher_name: 'Prof. Divya R.', attendance_status: 'present' },
      { hour: 5, subject: 'System Software & Microprocessors Lab', subject_code: 'CSL331', teacher_name: 'Prof. Divya R.', attendance_status: 'present' },
      { hour: 6, subject: 'Management of Software Systems', subject_code: 'CST307', teacher_name: 'Dr. Radhika P.', attendance_status: 'not_marked' }
    ]
  },
  {
    date: '2026-10-30',
    day: 'Friday',
    sub: [
      { 
        hour: 1, 
        subject: 'Computer Networks', 
        subject_code: 'CST303', 
        subject_type: 'Theory',
        teacher_name: 'Prof. Anjali Nair', 
        attendance_status: 'not_marked',
        change: 'substitution',
        regular_subject: 'Physics for Information Science',
        in_place_of: 'Dr. Suresh Kumar'
      },
      { hour: 2, subject: 'System Software', subject_code: 'CST305', subject_type: 'Theory', teacher_name: 'Dr. Manoj V.', attendance_status: 'not_marked' },
      { hour: 3, subject: 'Management of Software Systems', subject_code: 'CST307', subject_type: 'Theory', teacher_name: 'Dr. Radhika P.', attendance_status: 'not_marked' },
      { hour: 4, subject: 'Formal Languages and Automata Theory', subject_code: 'CST301', subject_type: 'Theory', teacher_name: 'Dr. Suresh Kumar', attendance_status: 'not_marked' },
      { hour: 5, subject: 'Activity Hour / Clubs', subject_code: 'ACT301', subject_type: 'Practical', teacher_name: 'Staff Coordinator', attendance_status: 'not_marked' }
    ]
  }
]

export const DEMO_TEACHERS: Teacher[] = [
  {
    id: 1,
    name: 'Mrs. Akhila M.',
    subject: 'Department of Computer Science',
    role_label: 'Head of Department',
    is_hod: true,
    email: 'akhilam@engg.edu.in',
    phone: '+91 94978 28473'
  },
  {
    id: 2,
    name: 'Prof. Shibili T.',
    subject: 'Computer Science & Engineering',
    role_label: 'Staff Advisor',
    is_staff_advisor: true,
    email: 'shibili.t@engg.edu.in',
    phone: '+91 98478 41673'
  },
  {
    id: 3,
    name: 'Dr. Suresh Kumar',
    subject: 'Formal Languages and Automata Theory (CST301)',
    role_label: 'Faculty',
    email: 'suresh.kumar@engg.edu.in',
    phone: '+91 94471 23456'
  },
  {
    id: 4,
    name: 'Prof. Anjali Nair',
    subject: 'Computer Networks (CST303)',
    role_label: 'Faculty',
    email: 'anjali.nair@engg.edu.in',
    phone: '+91 98952 34567'
  },
  {
    id: 5,
    name: 'Dr. Manoj V.',
    subject: 'System Software (CST305)',
    role_label: 'Faculty',
    email: 'manoj.v@engg.edu.in',
    phone: '+91 97443 45678'
  },
  {
    id: 6,
    name: 'Dr. Radhika P.',
    subject: 'Management of Software Systems (CST307)',
    role_label: 'Faculty',
    email: 'radhika.p@engg.edu.in',
    phone: '+91 94964 56789'
  }
]

export const DEMO_MATERIALS: StudyMaterial[] = [
  {
    id: 6384,
    title: 'Projection of Lines & Planes (Module 1 Notes)',
    subject: 'Engineering Graphics & CAD',
    module: 1,
    file_name: 'Module1_EG_Notes.pdf',
    link: '#',
    added_on: '2026-10-08',
    details: 'Complete step-by-step solved problems on true inclination and apparent angles.'
  },
  {
    id: 6385,
    title: 'Finite Automata & Regular Expressions (Module 1 & 2)',
    subject: 'Formal Languages & Automata Theory',
    module: '1 & 2',
    file_name: 'FLAT_Module1_2.pdf',
    link: '#',
    added_on: '2026-09-24',
    details: 'DFA, NFA minimization algorithms, and equivalence theorems.'
  },
  {
    id: 6386,
    title: 'TCP/IP Protocol Suite & Subnetting Guide',
    subject: 'Computer Networks',
    module: 3,
    file_name: 'CN_Subnetting_Guide.pdf',
    link: '#',
    added_on: '2026-10-18',
    details: 'IPv4 addressing, CIDR, VLSM allocation problems and solutions.'
  }
]

export const DEMO_FEES: FeesData = {
  login: true,
  total_fee: 45000,
  total_paid: 45000,
  total_balance: 0,
  has_due: false,
  can_pay: false,
  fee_types: [
    {
      fee_type_id: 1,
      fee_type_name: 'Semester Tuition & Special Fee',
      installments: [
        { name: 'Semester 5 Fee', amount: 45000, paid: 45000, status: 'Paid', receipt_no: 'REC-2026-5821' }
      ]
    }
  ]
}

export const DEMO_ACTIVITY_POINTS: ActivityPointsData = {
  flow: 'legacy',
  total_points_awarded: 65,
  awarded: [
    { id: 1, activity_name: 'NSS Volunteer (2 Years)', points: 40, category: 'National Service', semester: 'S3-S4', status: 'Approved' },
    { id: 2, activity_name: 'State Level Hackathon Winner', points: 15, category: 'Technical Competitions', semester: 'S4', status: 'Approved' },
    { id: 3, activity_name: 'College Technical Fest Coordinator', points: 10, category: 'Student Leadership', semester: 'S5', status: 'Approved' }
  ]
}

export const DEMO_DUTY_LEAVES: DutyLeave[] = [
  {
    id: 1,
    reason: 'Inter-College Hackathon Participation (NIT Calicut)',
    from_date: '2026-10-12',
    to_date: '2026-10-13',
    hours: 12,
    status: 'Approved',
    approved_by: 'Staff Advisor'
  }
]

export const DEMO_SURVEYS: SurveyItem[] = [
  {
    id: 3,
    name: 'Faculty Feedback & Course Evaluation Survey',
    session: 'Odd Semester 2026-27',
    status: 'Completed',
    deadline: '2026-11-15',
    is_open: true
  }
]

export const DEMO_RESULTS: UniversityResult[] = [
  {
    exam_id: 101,
    exam_name: 'S4 B.Tech Regular Examination (May 2026)',
    semester: 4,
    sgpa: 8.42,
    cgpa: 8.28,
    results: [
      { course_code: 'CST202', course_name: 'Computer Organization & Architecture', grade: 'A', credits: 4 },
      { course_code: 'CST204', course_name: 'Database Management Systems', grade: 'A+', credits: 4 },
      { course_code: 'CST206', course_name: 'Operating Systems', grade: 'B+', credits: 4 },
      { course_code: 'EST200', course_name: 'Design & Engineering', grade: 'A', credits: 2 },
      { course_code: 'MCN202', course_name: 'Constitution of India', grade: 'P', credits: 0 }
    ]
  },
  {
    exam_id: 102,
    exam_name: 'S3 B.Tech Regular Examination (Dec 2025)',
    semester: 3,
    sgpa: 8.14,
    cgpa: 8.21,
    results: [
      { course_code: 'MAT203', course_name: 'Discrete Mathematical Structures', grade: 'B+', credits: 4 },
      { course_code: 'CST201', course_name: 'Data Structures', grade: 'A', credits: 4 },
      { course_code: 'CST203', course_name: 'Logic System Design', grade: 'A', credits: 4 },
      { course_code: 'CST205', course_name: 'Object Oriented Programming using Java', grade: 'A+', credits: 4 }
    ]
  }
]


export const DEMO_COURSES: Course[] = [
  {
    id: 2047,
    name: 'Physics for Information Science',
    code: 'GAPHT121',
    credits: 4,
    type: 'Theory',
    slot: 'B',
    hours: 3,
    teacher_name: 'SNEHA K V',
    atten_text: '10 / 10',
    atten_per: '100.00'
  },
  {
    id: 1889,
    name: 'Algorithmic Thinking with Python',
    code: 'UCEST105',
    credits: 4,
    type: 'No University Exam. Internal Only (Theory)',
    slot: 'B',
    hours: 5,
    teacher_name: 'MUMTHAS THAZHATHKOYILOTH',
    atten_text: '21 / 23',
    atten_per: '91.30'
  },
  {
    id: 1890,
    name: 'Algorithmic Thinking with Python (Lab)',
    code: 'UCEST105',
    credits: 4,
    type: 'No University Exam. Internal Only (Practical)',
    slot: 'B',
    hours: 5,
    teacher_name: 'MUMTHAS THAZHATHKOYILOTH',
    atten_text: '10 / 10',
    atten_per: '100.00'
  },
  {
    id: 2048,
    name: 'Engineering Graphics and Computer Aided Drawing',
    code: 'GMEST103',
    credits: 3,
    type: 'Theory',
    slot: 'C',
    hours: 4,
    teacher_name: 'ARJUN SREEDHAR S',
    atten_text: '23 / 35',
    atten_per: '65.71'
  },
  {
    id: 2049,
    name: 'Introduction to Electrical & Electronics Engineering',
    code: 'GXEST104',
    credits: 4,
    type: 'Theory',
    slot: 'D',
    hours: 4,
    teacher_name: 'AISHWARYADASS K, DANYA. V. P',
    atten_text: '23 / 32',
    atten_per: '71.88'
  },
  {
    id: 2050,
    name: 'Mathematics for Information Science - 1',
    code: 'GAMAT101',
    credits: 3,
    type: 'Theory',
    slot: 'A',
    hours: 3,
    teacher_name: 'RADHIKA KALIYARTHODI',
    atten_text: '23 / 30',
    atten_per: '76.67'
  },
  {
    id: 2051,
    name: 'Basic Electrical and Electronics Engineering Workshop',
    code: 'GXESL106',
    credits: 1,
    type: 'Practical',
    slot: 'P',
    hours: 2,
    teacher_name: 'AISHWARYADASS K, DANYA. V. P, VIPIN NATH S',
    atten_text: '24 / 30',
    atten_per: '80.00'
  },
  {
    id: 2052,
    name: 'Life Skills and Professional Communication',
    code: 'UCHUT128',
    credits: 1,
    type: 'No University Exam. Internal Only (Theory)',
    slot: 'E',
    hours: 3,
    teacher_name: 'ANASWARA N.G.',
    atten_text: '17 / 20',
    atten_per: '85.00'
  }
]

export const DEMO_COURSE_DETAILS: Record<string | number, CourseDetails> = {
  '2047': {
    id: 2047,
    name: 'Physics for Information Science',
    code: 'GAPHT121',
    syllabus: [
      { id: 1, module: 1, topic: 'Electrical conductivity & Classical free electron theory', covered: true, hours: 2 },
      { id: 2, module: 1, topic: 'Quantum free electron theory, Fermi-Dirac statistics', covered: true, hours: 2 },
      { id: 3, module: 1, topic: 'Density of states, Fermi energy and Fermi temperature', covered: true, hours: 2 },
      { id: 4, module: 2, topic: 'Semiconductors: Intrinsic and extrinsic semiconductors', covered: true, hours: 2 },
      { id: 5, module: 2, topic: 'Carrier concentration and Fermi level variation', covered: false, hours: 2 },
      { id: 6, module: 3, topic: 'Magnetic properties of materials: Dia, Para and Ferro', covered: false, hours: 3 },
      { id: 7, module: 4, topic: 'Optoelectronics: Light emitting diodes, Solar cells, Photodetectors', covered: false, hours: 3 },
      { id: 8, module: 5, topic: 'Fiber Optics: Numerical aperture, Acceptance angle, Signal distortion', covered: false, hours: 3 }
    ],
    outcomes: [
      { id: 1, code: 'CO1', description: 'Apply the concepts of quantum mechanics to explain the electrical properties of metals.', bloom_level: 'Apply (Level 3)' },
      { id: 2, code: 'CO2', description: 'Analyze the behavior of semiconductors and carrier transport for device applications.', bloom_level: 'Analyze (Level 4)' },
      { id: 3, code: 'CO3', description: 'Evaluate magnetic and dielectric materials for engineering storage devices.', bloom_level: 'Evaluate (Level 5)' },
      { id: 4, code: 'CO4', description: 'Explain principles of optoelectronic devices and optical fiber communications.', bloom_level: 'Understand (Level 2)' }
    ],
    execution: [
      { id: 1, date: '2026-09-08', hour: 1, topic: 'Introduction to Information Physics & Syllabus Overview', status: 'conducted' },
      { id: 2, date: '2026-09-12', hour: 2, topic: 'Classical free electron theory - Postulates and Ohm law derivation', status: 'conducted' },
      { id: 3, date: '2026-09-16', hour: 3, topic: 'Thermal conductivity & Wiedemann-Franz law', status: 'conducted' },
      { id: 4, date: '2026-10-04', hour: 1, topic: 'Fermi-Dirac distribution & Probability density', status: 'conducted' },
      { id: 5, date: '2026-10-22', hour: 2, topic: 'Intrinsic Semiconductor Carrier Concentrations', status: 'conducted' }
    ],
    source_books: [
      { id: 1, title: 'Solid State Physics', author: 'S. O. Pillai', publisher: 'New Age International', edition: '8th Edition', is_reference: false },
      { id: 2, title: 'Introduction to Solid State Physics', author: 'Charles Kittel', publisher: 'Wiley', edition: '7th Edition', is_reference: true },
      { id: 3, title: 'Principles of Electronic Materials and Devices', author: 'S. O. Kasap', publisher: 'McGraw-Hill', edition: '3rd Edition', is_reference: true }
    ]
  }
}

export const DEMO_ACADEMIC_ANALYSIS: AcademicAnalysis = {
  name: 'NIRANJAN M D',
  cgpa: 0,
  earned_credit: 0,
  total_credit: 20,
  total_backlogs: 0,
  total_passed: 0,
  total_exams: 7,
  student: {
    name: 'NIRANJAN M D',
    admissionNo: '26B323',
    batch: '2K26',
    current_sem: 1,
    cgpa: 0,
    cumulative_credit: 0,
    total_backlogs: 0,
    current_backlogs: 0
  },
  courses_at_risk: [
    {
      code: 'GMEST103',
      name: 'Engineering Graphics and Computer Aided Drawing',
      semester: 'Semester 1',
      attendance_per: 66,
      evaluation_avg: 15,
      risk_level: 4,
      reasons: ['Attendance is 66% (below 75% KTU minimum)', 'Series evaluation average is 15%']
    },
    {
      code: 'GXEST104',
      name: 'Introduction to Electrical & Electronics Engineering',
      semester: 'Semester 1',
      attendance_per: 72,
      evaluation_avg: 33,
      risk_level: 4,
      reasons: ['Attendance is 72% (below 75% minimum)', 'Series exam average needs improvement']
    },
    {
      code: 'GAPHT121',
      name: 'Physics for Information Science',
      semester: 'Semester 1',
      attendance_per: 80,
      evaluation_avg: 28,
      risk_level: 2,
      reasons: ['Series evaluation average is 28% (requires 40% for full internal eligibility)']
    }
  ],
  semesters: [
    {
      position: 1,
      semester: 'Semester 1',
      sgpa: 'Awaiting',
      credit: 0,
      is_passed: 0,
      result: 'NOT PUBLISHED',
      attendance: {
        present: 147,
        total: 190,
        percent: 77
      },
      cumulative_cgpa: 0,
      cumulative_credit: 0,
      total_backlogs: 0,
      total_courses: 7
    }
  ]
}
