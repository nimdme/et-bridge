import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/AuthContext'
import { X, Send, CheckCircle2, MessageSquare, AlertCircle, Loader2 } from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

type FeedbackCategory = 'missing_feature' | 'data_discrepancy' | 'bug_glitch' | 'other'

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { session, profile } = useAuth()

  const [category, setCategory] = useState<FeedbackCategory>('missing_feature')
  const [result, setResult] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult('Sending...')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append('access_key', '68f7effe-e08f-4fe2-8342-a32019d2db20')
      formData.append('category', category)
      if (session?.instituteId) {
        formData.append('institute', session.instituteId)
      }
      if (session?.username) {
        formData.append('username', session.username)
      }
      formData.append('from_name', 'ETBridge Feedback Portal')
      formData.append('subject', `[ETBridge] ${category.toUpperCase()} - ${session?.instituteId || 'User'}`)

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setResult('Form Submitted Successfully')
        setIsSubmitted(true)
        setIsSubmitting(false)
      } else {
        setResult(data.message || 'Error submitting form. Please try again.')
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setResult('Network error. Please try again later.')
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setResult('')
    setIsSubmitted(false)
    setIsSubmitting(false)
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
        className="w-full max-w-lg bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-slate-300 rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
                <MessageSquare className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-mono">
                Something Missing?
              </h3>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-500 mt-1">
              Report missing features, attendance calculation errors, or ideas directly to the maintainer.
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
              Feedback Submitted Successfully
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you for helping improve ETBridge. Your message has been dispatched directly to the development inbox.
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
          <form onSubmit={onSubmit} className="space-y-4 pt-4">
            {result && result !== 'Sending...' && !isSubmitted && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{result}</span>
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

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={profile?.name || session?.studentName || session?.username || ''}
                placeholder="Your name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                defaultValue={profile?.email || ''}
                placeholder="you@college.edu or personal email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
                Message / Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Explain what is missing, any calculation discrepancies, or features you'd like to see..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 dark:bg-zinc-950 light:bg-slate-50 border border-zinc-800 dark:border-zinc-800 light:border-slate-200 text-xs text-white dark:text-white light:text-slate-900 placeholder:text-zinc-500 focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500 font-mono">
                {result === 'Sending...' ? 'Sending message...' : ''}
              </span>

              <div className="flex items-center gap-2.5">
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
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? 'Sending...' : 'Submit Form'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
