import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/AuthContext'
import { X, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

type FeedbackCategory = 'missing_feature' | 'data_discrepancy' | 'bug_glitch' | 'other'

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { session, profile } = useAuth()

  const [category, setCategory] = useState<FeedbackCategory>('missing_feature')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState(() => {
    return profile?.email || profile?.admission_no || session?.username || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Please provide a short summary or title.')
      return
    }

    if (!description.trim()) {
      setError('Please provide a description of the issue or missing feature.')
      return
    }

    setIsSubmitting(true)

    // Save report to localStorage for now (backend endpoint will be connected later)
    try {
      const existing = JSON.parse(localStorage.getItem('etbridge_feedback_reports') || '[]')
      const newReport = {
        id: `feedback_${Date.now()}`,
        timestamp: new Date().toISOString(),
        category,
        title: title.trim(),
        description: description.trim(),
        contact: contact.trim(),
        instituteId: session?.instituteId || 'unknown',
        username: session?.username || 'anonymous'
      }
      existing.unshift(newReport)
      localStorage.setItem('etbridge_feedback_reports', JSON.stringify(existing))
    } catch (err) {
      console.warn('Failed saving feedback locally:', err)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 400)
  }

  const handleReset = () => {
    setTitle('')
    setDescription('')
    setError(null)
    setIsSubmitted(false)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={handleReset}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-3xl p-4 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
                <MessageSquare className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                Something Missing?
              </h3>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
              Report missing features, attendance calculation errors, or ideas to the admin.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white dark:text-white light:text-slate-900">
              Feedback Received
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you for reporting. Your input has been saved locally and will be forwarded to the admin backend.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 light:bg-slate-200 light:hover:bg-slate-300 text-xs font-semibold text-white dark:text-white light:text-slate-900 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'missing_feature', label: 'Missing Feature' },
                  { id: 'data_discrepancy', label: 'Attendance / Marks Error' },
                  { id: 'bug_glitch', label: 'Bug / Broken UI' },
                  { id: 'other', label: 'Other Feedback' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as FeedbackCategory)}
                    className={`px-3 py-2 rounded-xl text-left font-medium border transition-colors ${
                      category === item.id
                        ? 'border-brand-500 bg-brand-500/10 text-brand-300 dark:text-brand-300 light:text-brand-700 font-semibold'
                        : 'border-zinc-800 dark:border-zinc-800 light:border-slate-200 bg-zinc-950/40 dark:bg-zinc-950/40 light:bg-slate-50 text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title / Summary */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Title / Summary
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cannot find elective subjects or duty leave missing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Description / Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Explain what is missing or what you expected to see..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            {/* Optional Contact */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Contact (Optional)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or Admission Number"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit to Admin'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
