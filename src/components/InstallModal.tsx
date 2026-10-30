import React, { useState, useEffect } from 'react'
import { Download, X, Share, PlusSquare, MoreVertical, Smartphone, Check } from 'lucide-react'

interface InstallModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android')

  useEffect(() => {
    // Detect OS for default tab
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setActiveTab('ios')
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Install ETBridge App</h3>
            <p className="text-xs text-zinc-400">Fast, offline-ready, opens without browser tabs</p>
          </div>
        </div>

        {/* One-click button if Chrome supported */}
        {deferredPrompt && !isInstalled && (
          <div className="mb-5">
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-brand-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Tap to Install to Home Screen</span>
            </button>
          </div>
        )}

        {/* Platform Tabs */}
        <div className="flex rounded-lg bg-zinc-950 p-1 mb-4 border border-zinc-800">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'android'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Android (Chrome / Brave)
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'ios'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            iPhone & iPad (Safari)
          </button>
        </div>

        {/* Instructions */}
        {activeTab === 'android' ? (
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300 shrink-0">1</span>
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  Tap the browser menu <MoreVertical className="w-4 h-4 text-zinc-400 inline" />
                </p>
                <p className="text-xs text-zinc-400">At the top right corner of Chrome or Brave.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300 shrink-0">2</span>
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  Select <span className="text-brand-400 font-semibold">"Install App"</span> or <span className="text-brand-400 font-semibold">"Add to Home screen"</span>
                </p>
                <p className="text-xs text-zinc-400">The app will download instantly like a native app.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-zinc-300">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300 shrink-0">1</span>
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  Tap the <Share className="w-4 h-4 text-brand-400 inline" /> Share button
                </p>
                <p className="text-xs text-zinc-400">Located at the bottom of the Safari toolbar.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300 shrink-0">2</span>
              <div>
                <p className="font-medium text-white flex items-center gap-1.5">
                  Scroll and select <PlusSquare className="w-4 h-4 text-brand-400 inline" /> <span className="text-brand-400 font-semibold">"Add to Home Screen"</span>
                </p>
                <p className="text-xs text-zinc-400">Tap "Add" at the top right to finish.</p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits badge */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Check className="w-3.5 h-3.5" /> No App Store fees or downloads
          </span>
          <span>Zero battery drain</span>
        </div>
      </div>
    </div>
  )
}
