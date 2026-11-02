import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { BrandLogo } from '../components/BrandLogo'
import { 
  ArrowLeft, 
  ExternalLink, 
  Sun, 
  Moon, 
  Copy, 
  Check, 
  Terminal, 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  Calculator, 
  Server,
  Layers,
  Database,
  Smartphone
} from 'lucide-react'

export const DocsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>('architecture')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippet(id)
    setTimeout(() => setCopiedSnippet(null), 2000)
  }

  const navItems = [
    { id: 'architecture', label: '1. System Architecture', icon: Server },
    { id: 'authentication', label: '2. Authentication & Security', icon: ShieldCheck },
    { id: 'api-reference', label: '3. Reverse-Engineered API', icon: Code2 },
    { id: 'attendance-math', label: '4. Attendance & Bunk Formulas', icon: Calculator },
    { id: 'duty-leaves', label: '5. Duty Leave Reconciliation', icon: Layers },
    { id: 'caching-pwa', label: '6. Offline Caching & PWA', icon: Database },
    { id: 'build-your-own', label: '7. How to Build Your Own Client', icon: Smartphone },
  ]

  // Track active section dynamically based on window scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130
      const sectionElements = navItems
        .map(item => ({ id: item.id, el: document.getElementById(item.id) }))
        .filter((s): s is { id: string; el: HTMLElement } => s.el !== null)

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i]
        if (el.offsetTop <= scrollPosition) {
          setActiveSection(id)
          return
        }
      }
      if (sectionElements.length > 0) {
        setActiveSection(sectionElements[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -90
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 light:bg-slate-50 light:text-slate-900 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 dark:bg-zinc-950/90 light:bg-white/90 backdrop-blur-md border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-xl border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-700 light:hover:text-slate-900 transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              <BrandLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white dark:text-white light:text-slate-900 font-mono">
                ETBridge / Documentation
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-zinc-500 font-mono">
                Technical Reference & Architecture Specification
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <a
            href="https://github.com/nimd/etbridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-1.5 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-slate-300 text-zinc-400 hover:text-white dark:hover:text-white light:text-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          >
            Open App
          </Link>
        </div>
      </header>

      {/* Main Documentation Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Desktop Left Table of Contents */}
          <aside className="lg:col-span-3 sticky top-20 hidden lg:block space-y-2 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-2 px-2">
                Table of Contents
              </span>
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-400 font-bold'
                        : 'text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </a>
                )
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-12 max-w-4xl">

            {/* Title Section */}
            <section className="space-y-3 pb-6 border-b border-zinc-800 dark:border-zinc-800 light:border-slate-200">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-950/70 dark:bg-brand-950/70 light:bg-brand-50 border border-brand-800/50 text-[11px] font-mono text-brand-400 font-bold">
                <span>Architecture Specification</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 font-mono">
                ETBridge Technical Architecture & API Documentation
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed font-sans">
                A comprehensive developer guide detailing how ETBridge interacts directly with the ETLab college portal backend, reverse-engineered REST endpoints, authentication protocols, 75% attendance bunk algorithms, and offline data synchronization.
              </p>
            </section>

            {/* SECTION 1: SYSTEM ARCHITECTURE */}
            <section id="architecture" className="space-y-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  1. System Architecture & Zero-Backend Design
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                <p>
                  ETBridge is built on a <strong>zero-backend architecture</strong>. Unlike conventional portal wrappers that route user traffic through a hosted proxy or developer database, ETBridge executes entirely inside the client’s browser runtime:
                </p>

                <div className="p-4 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 font-mono text-xs overflow-x-auto">
                  <pre className="text-zinc-300 dark:text-zinc-300 light:text-slate-800 leading-relaxed">{`+-----------------------------------------------------------------------+
| Browser / Progressive Web App (PWA)                                   |
|                                                                       |
|  +--------------------+    +--------------------+    +-------------+  |
|  | React 19 UI Layer  | <->| API Client Service | <->| LocalStorage|  |
|  | (Tailwind, Lucide) |    | (Token & Requests) |    | (Offline DB)|  |
|  +--------------------+    +--------------------+    +-------------+  |
+---------------------------------------|-------------------------------+
                                        | Direct HTTPS (Zero Proxy)
                                        v
+-----------------------------------------------------------------------+
| ETLab Public API Server (https://api.students.etlab.app/api/v1)       |
| College Tenants (gcek.etlab.app, mace.etlab.app, tkmce.etlab.app...)  |
+-----------------------------------------------------------------------+`}</pre>
                </div>

                <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                  <li><strong>Security & Privacy:</strong> User credentials and Bearer tokens never touch third-party servers. All requests go directly to ETLab's official endpoints.</li>
                  <li><strong>Hosting Simplicity:</strong> The entire application compiles into static HTML, CSS, and JavaScript, deployable on Cloudflare Pages, GitHub Pages, or Vercel with zero server maintenance costs.</li>
                  <li><strong>CORS Handling:</strong> ETLab's mobile API gateway (`api.students.etlab.app`) natively permits CORS requests from browser origins, enabling direct client-side consumption without reverse proxies.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 2: AUTHENTICATION */}
            <section id="authentication" className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  2. Authentication & Session Protocol
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                <p>
                  ETLab uses token-based Bearer authentication. When a user submits their institution code, admission number, and password, the client issues a `POST` request to the login endpoint:
                </p>

                <div className="relative p-4 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-900 border border-zinc-800 font-mono text-xs">
                  <button
                    onClick={() => copyToClipboard(`POST https://api.students.etlab.app/api/v1/login
Content-Type: application/json

{
  "username": "KTU22CS045",
  "password": "your_secure_password",
  "institute": "gcek"
}`, 'auth-curl')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy Snippet"
                  >
                    {copiedSnippet === 'auth-curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="text-zinc-300 overflow-x-auto">{`POST https://api.students.etlab.app/api/v1/login
Content-Type: application/json

{
  "username": "KTU22CS045",
  "password": "your_secure_password",
  "institute": "gcek"
}`}</pre>
                </div>

                <p>
                  On successful authentication, the server returns an HTTP 200 payload containing the user object and a JWT authorization token:
                </p>

                <div className="p-4 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-slate-900 border border-zinc-800 font-mono text-xs overflow-x-auto text-zinc-300">
                  <pre>{`{
  "login": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "name": "Arjun K. V.",
    "admission_no": "KTU22CS045",
    "curnt_sem": "S5",
    "roll_no": "22",
    "batch_id": 2022
  }
}`}</pre>
                </div>

                <p>
                  Every subsequent request attaches this token in the HTTP Authorization header:
                  <code className="block mt-1 font-mono text-xs bg-zinc-900 dark:bg-zinc-900 light:bg-slate-200 p-2 rounded-lg text-brand-400">
                    Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...
                  </code>
                </p>
              </div>
            </section>

            {/* SECTION 3: API REFERENCE */}
            <section id="api-reference" className="space-y-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  3. Reverse-Engineered ETLab REST API Reference
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                The primary base URL for ETLab student mobile clients is <code className="font-mono text-xs bg-zinc-800 dark:bg-zinc-800 light:bg-slate-200 px-1.5 py-0.5 rounded">https://api.students.etlab.app/api/v1</code>.
              </p>

              <div className="space-y-3 font-mono text-xs">
                {[
                  {
                    method: 'GET',
                    endpoint: '/profile',
                    desc: 'Fetches student profile, roll number, admission number, current semester, and cumulative attendance summary.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/attendancebysubject?sem_id={sem_id}',
                    desc: 'Returns array of registered subjects with attended hours, total conducted hours, percentage, and absent hours.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/timetablenew?month=YYYY-MM',
                    desc: 'Returns daily schedule for the specified month. Each day contains an array of 6 periods with hour index, subject code, instructor name, covered syllabus topics, and attendance status (present, absent, duty_leave, not_marked).'
                  },
                  {
                    method: 'GET',
                    endpoint: '/evaluations',
                    desc: 'Fetches internal marks, series examinations (Series 1 & 2), assignments, scored marks, and maximum mark allocations.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/teachers',
                    desc: 'Retrieves faculty directory with teacher IDs, names, emails, phone numbers, assigned roles (HOD, Staff Advisor, Mentor), and photo URLs.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/dutyleaves',
                    desc: 'Fetches officially approved duty leaves with date ranges, event titles, and approval statuses.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/studymaterials',
                    desc: 'Retrieves downloadable lecture notes, assignment PDFs, and reference files uploaded by professors.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/fees',
                    desc: 'Retrieves fee transaction history, semester tuition dues, fine breakdowns, and receipt IDs.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/activitypoints/legacy',
                    desc: 'Returns APJ Abdul Kalam Technological University (KTU) activity points tally categorized across sports, NSS, arts, and leadership.'
                  },
                  {
                    method: 'GET',
                    endpoint: '/syllabus/{course_id}',
                    desc: 'Returns university course syllabus breakdown, modules 1-6, credit values, and examination blueprint.'
                  }
                ].map(api => (
                  <div
                    key={api.endpoint}
                    className="p-3.5 rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/50 light:bg-slate-100 border border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-300 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-brand-500/20 text-brand-400">
                        {api.method}
                      </span>
                      <span className="font-bold text-white dark:text-white light:text-slate-900">
                        {api.endpoint}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-sans leading-relaxed">
                      {api.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: ATTENDANCE MATH */}
            <section id="attendance-math" className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  4. Attendance & Safe Bunk Margin Mathematical Formulas
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                <p>
                  Universities (such as KTU) enforce a strict <strong>75% minimum attendance requirement</strong> to appear for end-semester examinations. ETBridge computes real-time margins using algebraic equations based on attended classes \(A\) and total conducted classes \(T\):
                </p>

                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-slate-100 border border-zinc-800 space-y-4 font-mono text-xs">
                  <div>
                    <h3 className="text-emerald-400 font-bold mb-1">Case 1: Current Attendance &ge; 75% (Safe Bunk Margin)</h3>
                    <p className="font-sans text-zinc-400 mb-2">
                      How many upcoming classes \(x\) can a student safely skip without dropping below 75%:
                    </p>
                    <pre className="bg-zinc-950 p-3 rounded-xl text-zinc-200 overflow-x-auto">{`\\frac{A}{T + x} >= 0.75
A >= 0.75 * T + 0.75 * x
0.75 * x <= A - 0.75 * T
x = floor( (A - 0.75 * T) / 0.75 )`}</pre>
                  </div>

                  <div className="pt-3 border-t border-zinc-800">
                    <h3 className="text-rose-400 font-bold mb-1">Case 2: Current Attendance &lt; 75% (Recovery Requirement)</h3>
                    <p className="font-sans text-zinc-400 mb-2">
                      How many consecutive upcoming classes \(y\) must a student attend to recover to 75%:
                    </p>
                    <pre className="bg-zinc-950 p-3 rounded-xl text-zinc-200 overflow-x-auto">{`\\frac{A + y}{T + y} >= 0.75
A + y >= 0.75 * T + 0.75 * y
0.25 * y >= 0.75 * T - A
y = ceil( (0.75 * T - A) / 0.25 )`}</pre>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: DUTY LEAVE RECONCILIATION */}
            <section id="duty-leaves" className="space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  5. Self-Reported Duty Leave Reconciliation Engine
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                <p>
                  College faculty frequently take weeks to upload approved duty leaves into ETLab. During this delay, students appear officially absent, distorting their true attendance percentage.
                </p>

                <p>
                  ETBridge resolves this with an <strong>optimistic projection and auto-reconciliation engine</strong>:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-zinc-400 dark:text-zinc-400 light:text-slate-600">
                  <li>
                    <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Hour-Level Claiming:</strong> When logging a duty leave, students select the specific hours missed (e.g. Hours 4, 5, 6 for an afternoon seminar) rather than a coarse full-day guess.
                  </li>
                  <li>
                    <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Projected Attendance:</strong> The UI calculates the projected attended classes as:
                    <code className="block mt-1 font-mono text-xs bg-zinc-900 p-2 rounded-lg text-amber-300">
                      Projected Attended = Attended + Pending Duty Leave Hours
                    </code>
                  </li>
                  <li>
                    <strong className="text-zinc-200 dark:text-zinc-200 light:text-slate-800">Automated Reconciliation:</strong> Upon each sync with ETLab, ETBridge checks both the official `/dutyleaves` table and the daily timetable periods. If a period's status transitions from `absent` to `duty_leave`, the matching pending entry is automatically marked as `reconciled = true`.
                  </li>
                </ol>
              </div>
            </section>

            {/* SECTION 6: CACHING & PWA */}
            <section id="caching-pwa" className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  6. Offline Caching Strategy & PWA Architecture
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                <p>
                  Campuses frequently experience dead spots or degraded Wi-Fi. ETBridge employs a <strong>stale-while-revalidate caching pattern</strong> with partitioned local storage keys:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-brand-400 font-bold">etbridge_session</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Active JWT token, student name, and institute subdomain.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-brand-400 font-bold">etbridge_cached_attendance</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Cached subject attendance objects and targets.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-brand-400 font-bold">etbridge_cached_timetable_YYYY-MM</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Partitioned monthly timetable periods and teacher logs.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-brand-400 font-bold">etbridge_pending_duty_leaves</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Self-reported duty leaves and selected hours.</p>
                  </div>
                </div>

                <p>
                  The Progressive Web App includes a web app manifest and Service Worker that pre-caches all static JS and CSS bundles, enabling instant startup even when completely disconnected from the network.
                </p>
              </div>
            </section>

            {/* SECTION 7: HOW TO BUILD YOUR OWN CLIENT */}
            <section id="build-your-own" className="space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 font-mono">
                  7. Developer Guide: How to Build Your Own ETLab Client
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 leading-relaxed">
                <p>
                  If you want to build a native mobile app (using Flutter, Swift, Kotlin, or React Native) or a custom command-line interface (CLI) for ETLab, follow these steps:
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                    <span className="text-brand-400 font-bold">Step 1: Obtain the Institute Code</span>
                    <p className="font-sans text-zinc-400 text-xs">
                      Inspect the login URL of your college's ETLab portal. If your portal is <code className="text-white">gcek.etlab.app</code>, the institute code is <code className="text-brand-300">gcek</code>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                    <span className="text-brand-400 font-bold">Step 2: Authenticate via POST /api/v1/login</span>
                    <p className="font-sans text-zinc-400 text-xs">
                      Send JSON with <code className="text-white">username</code>, <code className="text-white">password</code>, and <code className="text-white">institute</code>. Store the returned <code className="text-white">token</code> securely in the device's Keychain, Keystore, or encrypted storage.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                    <span className="text-brand-400 font-bold">Step 3: Fetch Data with Authorization Header</span>
                    <p className="font-sans text-zinc-400 text-xs">
                      Attach <code className="text-white">Authorization: Bearer &lt;token&gt;</code> to every request. Query <code className="text-white">/attendancebysubject</code> for attendance and <code className="text-white">/timetablenew?month=YYYY-MM</code> for schedules.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                    <span className="text-brand-400 font-bold">Step 4: Handle Media & Image Hotlinking</span>
                    <p className="font-sans text-zinc-400 text-xs">
                      When displaying faculty photos or uploads, remember that ETLab servers reject foreign <code className="text-white">Referer</code> headers. Set <code className="text-white">referrerPolicy="no-referrer"</code> or fetch image bytes using authenticated GET requests.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
