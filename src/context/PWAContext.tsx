import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Capture beforeinstallprompt immediately at the module evaluation time
// to avoid missing the event if it fires before React components mount.
let globalDeferredPrompt: any = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    globalDeferredPrompt = e
  })
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

interface PWAContextType {
  deferredPrompt: any
  isInstallable: boolean
  isInstalled: boolean
  isStandalone: boolean
  isInstallModalOpen: boolean
  openInstallModal: () => void
  closeInstallModal: () => void
  triggerInstall: () => Promise<'accepted' | 'dismissed' | 'modal_opened'>
  showPeriodicPrompt: boolean
  dismissPeriodicPrompt: (days?: number) => void
  isMobileDevice: boolean
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(() => globalDeferredPrompt)
  const [isStandalone, setIsStandalone] = useState<boolean>(() => isStandaloneMode())
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return isStandaloneMode() || localStorage.getItem('etbridge_pwa_installed') === 'true'
  })
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [showPeriodicPrompt, setShowPeriodicPrompt] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  // Track viewport width for responsive mobile checks
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Listen to PWA lifecycle events
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      globalDeferredPrompt = e
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      globalDeferredPrompt = null
      setShowPeriodicPrompt(false)
      setIsInstallModalOpen(false)
      try {
        localStorage.setItem('etbridge_pwa_installed', 'true')
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    const mq = window.matchMedia('(display-mode: standalone)')
    const handleMqChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches)
      if (e.matches) {
        setIsInstalled(true)
        setShowPeriodicPrompt(false)
      }
    }
    mq.addEventListener?.('change', handleMqChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      mq.removeEventListener?.('change', handleMqChange)
    }
  }, [])

  // Periodic polite mobile banner prompt:
  // Shows only if on mobile browser, not installed/standalone, not dismissed within last 7 days,
  // not already shown in current session, and only after 5 seconds of active usage.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isStandalone || isInstalled) return
    if (!isMobileDevice) return

    // Check 7-day snooze
    try {
      const dismissedUntil = localStorage.getItem('etbridge_pwa_dismissed_until')
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return
      }

      // Check current tab session
      const shownThisSession = sessionStorage.getItem('etbridge_pwa_session_shown')
      if (shownThisSession === 'true') {
        return
      }
    } catch {
      // Storage access restricted
    }

    // Wait 5 seconds after mount so initial dashboard/attendance renders peacefully
    const timer = setTimeout(() => {
      if (!isStandaloneMode() && !isInstalled) {
        setShowPeriodicPrompt(true)
        try {
          sessionStorage.setItem('etbridge_pwa_session_shown', 'true')
        } catch {
          // ignore
        }
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isStandalone, isInstalled, isMobileDevice])

  const openInstallModal = useCallback(() => {
    setIsInstallModalOpen(true)
  }, [])

  const closeInstallModal = useCallback(() => {
    setIsInstallModalOpen(false)
  }, [])

  const dismissPeriodicPrompt = useCallback((days = 7) => {
    setShowPeriodicPrompt(false)
    try {
      const snoozeTimestamp = Date.now() + days * 24 * 60 * 60 * 1000
      localStorage.setItem('etbridge_pwa_dismissed_until', String(snoozeTimestamp))
    } catch {
      // ignore
    }
  }, [])

  const triggerInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'modal_opened'> => {
    const promptEvent = deferredPrompt || globalDeferredPrompt
    if (promptEvent) {
      try {
        promptEvent.prompt()
        const choice = await promptEvent.userChoice
        if (choice.outcome === 'accepted') {
          setIsInstalled(true)
          setDeferredPrompt(null)
          globalDeferredPrompt = null
          setShowPeriodicPrompt(false)
          setIsInstallModalOpen(false)
          try {
            localStorage.setItem('etbridge_pwa_installed', 'true')
          } catch {}
          return 'accepted'
        } else {
          // User chose not to install from native prompt: snooze periodic banner for 7 days
          dismissPeriodicPrompt(7)
          return 'dismissed'
        }
      } catch (err) {
        console.warn('[PWA] Prompt call failed, falling back to modal:', err)
        setIsInstallModalOpen(true)
        return 'modal_opened'
      }
    }

    // No native prompt available (iOS Safari, or Chrome without prompt triggered yet)
    setIsInstallModalOpen(true)
    return 'modal_opened'
  }, [deferredPrompt, dismissPeriodicPrompt])

  return (
    <PWAContext.Provider
      value={{
        deferredPrompt,
        isInstallable: Boolean(deferredPrompt) || !isInstalled,
        isInstalled,
        isStandalone,
        isInstallModalOpen,
        openInstallModal,
        closeInstallModal,
        triggerInstall,
        showPeriodicPrompt,
        dismissPeriodicPrompt,
        isMobileDevice,
      }}
    >
      {children}
    </PWAContext.Provider>
  )
}

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider')
  }
  return context
}
