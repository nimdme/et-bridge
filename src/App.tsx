import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AttendancePage } from './pages/AttendancePage'
import { TimetablePage } from './pages/TimetablePage'
import { AcademicsPage } from './pages/AcademicsPage'
import { CoursesPage } from './pages/CoursesPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { CampusPage } from './pages/CampusPage'
import { NoticesPage } from './pages/NoticesPage'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { BottomNav } from './components/BottomNav'
import { CommandPalette } from './components/CommandPalette'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingScreen } from './components/LoadingScreen'

// Smart Root Route Component
const SmartRoot: React.FC = () => {
  const { isAuthenticated, isStandalone, loading, profile, session } = useAuth()

  // If installed standalone PWA:
  if (isStandalone) {
    if (isAuthenticated) {
      if (loading && !profile) {
        return (
          <LoadingScreen
            mode="reload"
            instituteId={session?.instituteId}
            instituteName={session?.instituteName}
            studentName={session?.studentName || session?.username}
          />
        )
      }
      return <Navigate to="/dashboard" replace />
    }
    return <Navigate to="/login" replace />
  }

  // Web visitor: show Landing Page
  return <LandingPage />
}

// Protected Layout with Desktop Sidebar & Mobile BottomNav
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, profile, session } = useAuth()
  const [bypassLoading, setBypassLoading] = React.useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // When reloading the app or booting, show smooth loading animation while data is being fetched and filled
  if (loading && !profile && !bypassLoading) {
    return (
      <LoadingScreen
        mode="reload"
        instituteId={session?.instituteId}
        instituteName={session?.instituteName}
        studentName={session?.studentName || session?.username}
        onSkip={() => setBypassLoading(true)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 text-zinc-100 dark:text-zinc-100 light:text-slate-900 flex flex-col selection:bg-brand-500/30 selection:text-brand-200 transition-colors">
      <Navbar />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <BottomNav />
      <CommandPalette />
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public / Smart entry */}
              <Route path="/" element={<SmartRoot />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Application Routes */}
              <Route
                path="/dashboard"
                element={
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                }
              />
              <Route
                path="/attendance"
                element={
                  <AppLayout>
                    <AttendancePage />
                  </AppLayout>
                }
              />
              <Route
                path="/timetable"
                element={
                  <AppLayout>
                    <TimetablePage />
                  </AppLayout>
                }
              />
              <Route
                path="/courses"
                element={
                  <AppLayout>
                    <CoursesPage />
                  </AppLayout>
                }
              />
              <Route
                path="/analysis"
                element={
                  <AppLayout>
                    <AnalysisPage />
                  </AppLayout>
                }
              />
              <Route
                path="/academics"
                element={
                  <AppLayout>
                    <AcademicsPage />
                  </AppLayout>
                }
              />
              <Route
                path="/campus"
                element={
                  <AppLayout>
                    <CampusPage />
                  </AppLayout>
                }
              />
              <Route
                path="/notices"
                element={
                  <AppLayout>
                    <NoticesPage />
                  </AppLayout>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
