import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { etlabClient } from '../api/client'
import { Institute } from '../api/types'
import { 
  Building2, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Search,
  Check
} from 'lucide-react'
import { LoadingScreen } from '../components/LoadingScreen'

export const LoginPage: React.FC = () => {
  const { login, loginDemo, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [selectedInstId, setSelectedInstId] = useState<string>(() => {
    return localStorage.getItem('etbridge_remembered_inst') || ''
  })
  const [instSearch, setInstSearch] = useState<string>('')
  const [showInstPicker, setShowInstPicker] = useState<boolean>(false)

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Load institutes on mount
  useEffect(() => {
    let isMounted = true
    etlabClient.getInstitutes().then((list) => {
      if (isMounted && list.length > 0) {
        setInstitutes(list)
        // Check if there was a previously remembered institute
        const prevInst = localStorage.getItem('etbridge_remembered_inst')
        if (prevInst && list.some(i => i.id === prevInst)) {
          setSelectedInstId(prevInst)
        }
      }
    })
    return () => { isMounted = false }
  }, [])

  const selectedInstitute = selectedInstId 
    ? institutes.find(i => i.id === selectedInstId) || {
        id: selectedInstId,
        name: selectedInstId.toUpperCase(),
        shortName: selectedInstId.toUpperCase()
      }
    : null

  const filteredInstitutes = institutes.filter(i => {
    if (!instSearch.trim()) return true
    const q = instSearch.toLowerCase()
    return (
      i.name.toLowerCase().includes(q) ||
      i.id.toLowerCase().includes(q) ||
      (i.shortName && i.shortName.toLowerCase().includes(q))
    )
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedInstId) {
      setError('Please select your college from the list.')
      return
    }

    if (!username.trim() || !password) {
      setError('Please enter both your Admission/KTU ID and password.')
      return
    }

    setLoading(true)
    try {
      localStorage.setItem('etbridge_remembered_inst', selectedInstId)
      await login(username.trim(), password, selectedInstId, selectedInstitute?.name || selectedInstId.toUpperCase())
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    try {
      loginDemo()
      setTimeout(() => {
        navigate('/dashboard')
      }, 750)
    } catch {
      setLoading(false)
    }
  }

  // Full-screen interactive loading animation during login
  if (loading) {
    return (
      <LoadingScreen
        mode="login"
        instituteId={selectedInstId}
        instituteName={selectedInstitute?.name || selectedInstId.toUpperCase()}
        studentName={username.trim()}
        onCancel={() => setLoading(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative selection:bg-brand-500/30 selection:text-brand-200">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-brand-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform flex items-center justify-center">
              <svg viewBox="0 0 512 512" className="w-6 h-6 text-white" fill="none">
                <path d="M120 340 C180 220, 332 220, 392 340" stroke="currentColor" strokeWidth="48" strokeLinecap="round"/>
                <path d="M256 340 L256 240" stroke="currentColor" strokeWidth="36" strokeLinecap="round"/>
                <circle cx="256" cy="160" r="36" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">ETBridge</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Sign in to your college portal</h2>
          <p className="text-xs text-zinc-400 mt-1">Connects directly to ETLab's official API server</p>
        </div>

        {/* Card Box */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 relative">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Institute Picker */}
            <div className="relative">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Select Your College
              </label>
              <button
                type="button"
                onClick={() => setShowInstPicker(!showInstPicker)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-left text-xs transition-colors ${
                  !selectedInstId
                    ? 'border-dashed border-zinc-700 hover:border-brand-500/60'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className={`w-4 h-4 shrink-0 ${selectedInstitute ? 'text-brand-400' : 'text-zinc-500'}`} />
                  <span className={`truncate ${selectedInstitute ? 'text-white font-medium' : 'text-zinc-400'}`}>
                    {selectedInstitute?.name || 'Select your college...'}
                  </span>
                </div>
                {selectedInstitute ? (
                  <span className="text-[11px] font-bold uppercase text-brand-400 bg-brand-950/60 border border-brand-800/40 px-2 py-0.5 rounded-md ml-2 shrink-0">
                    {selectedInstitute.shortName || selectedInstitute.id}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-semibold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md ml-2 shrink-0">
                    Choose
                  </span>
                )}
              </button>

              {/* Dropdown Popover */}
              {showInstPicker && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 max-h-72 flex flex-col">
                  {/* Search inside list */}
                  <div className="relative mb-2 px-1">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search college name or code..."
                      value={instSearch}
                      onChange={(e) => setInstSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                      autoFocus
                    />
                  </div>

                  <div className="overflow-y-auto space-y-0.5 pr-1">
                    {filteredInstitutes.length === 0 ? (
                      <p className="text-center py-4 text-xs text-zinc-500">No college found</p>
                    ) : (
                      filteredInstitutes.map((inst) => {
                        const isSelected = inst.id === selectedInstId
                        return (
                          <button
                            key={inst.id}
                            type="button"
                            onClick={() => {
                              setSelectedInstId(inst.id)
                              setShowInstPicker(false)
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                              isSelected
                                ? 'bg-brand-600/20 text-brand-300 font-semibold'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                          >
                            <span className="truncate pr-2">{inst.name}</span>
                            <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded shrink-0">
                              {inst.shortName || inst.id}
                            </span>
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Username / Admission ID */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Admission No / KTU ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. VDA22CS045"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                ETLab Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to ETBridge</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <span className="relative px-3 bg-zinc-900 text-[11px] text-zinc-500 font-medium">
              or explore first
            </span>
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Launch Demo Mode (No login required)</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Zero-knowledge: Credentials are sent directly to ETLab</span>
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-zinc-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
