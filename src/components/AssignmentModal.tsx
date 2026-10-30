import React, { useState } from 'react'
import { Assignment } from '../api/types'
import { etlabClient } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { getDaysRemaining, formatIndianDate } from '../utils/format'
import { downloadFileWithAuth } from '../utils/download'
import { 
  X, 
  Download, 
  Upload, 
  Trash2, 
  Calendar, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react'

interface AssignmentModalProps {
  assignment: Assignment | null
  onClose: () => void
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ assignment, onClose }) => {
  const { refreshData } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!assignment) return null

  const daysInfo = getDaysRemaining(assignment.last_date)
  const isSubmitted = assignment.status?.toUpperCase() === 'SUBMITTED'
  const isMissed = !isSubmitted && daysInfo.isOverdue
  const downloadUrl = assignment.url ? (
    assignment.url.startsWith('http') ? assignment.url : `https://api.students.etlab.app${assignment.url}`
  ) : null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleDownload = async () => {
    if (!assignment?.url) return
    setDownloading(true)
    setError(null)
    try {
      await downloadFileWithAuth(
        assignment.url,
        `${assignment.subject_code}_Assignment_${assignment.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      )
    } catch (err: any) {
      setError(err.message || 'Failed to download assignment PDF')
    } finally {
      setDownloading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to submit.')
      return
    }

    setUploading(true)
    setError(null)
    try {
      await etlabClient.uploadAssignment(assignment.id, selectedFile)
      setSuccess('Assignment uploaded successfully!')
      setSelectedFile(null)
      await refreshData(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to upload assignment file.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteSubmission = async () => {
    if (!window.confirm('Are you sure you want to delete your current submission?')) return

    setDeleting(true)
    setError(null)
    try {
      await etlabClient.deleteAssignment(assignment.id)
      setSuccess('Submission deleted.')
      await refreshData(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to delete submission.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase text-brand-400 bg-brand-950/60 border border-brand-800/40 px-2 py-0.5 rounded">
                {assignment.subject_code}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">{assignment.subject_name || assignment.subject}</span>
              {assignment.submission_mode && (
                <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full">
                  {assignment.submission_mode}
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
              {assignment.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status & Deadline Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Status</span>
              {assignment.mark ? (
                <span className="text-xs font-black text-emerald-400">
                  Graded: {assignment.mark} / {assignment.max_mark || '10'}
                </span>
              ) : isSubmitted ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                </span>
              ) : isMissed ? (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Missed
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Not Submitted
                </span>
              )}
            </div>

            {/* Deadline & Remaining Days */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Due Date</span>
              <span className="text-xs font-bold text-white block truncate">
                {assignment.last_date ? formatIndianDate(assignment.last_date, 'short') : 'No deadline'}
              </span>
              {daysInfo.text && (
                <span className={`text-[11px] font-semibold block mt-0.5 ${
                  daysInfo.isUrgent ? 'text-rose-400' : 'text-zinc-400'
                }`}>
                  {daysInfo.text}
                </span>
              )}
            </div>

            {/* Max Marks */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Maximum Mark</span>
              <span className="text-xs font-bold text-white block">
                {assignment.max_mark || 'N/A'}
              </span>
            </div>
          </div>

          {/* Teacher Details / Instructions */}
          {assignment.details && (
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Instructions & Details
              </span>
              <div 
                className="text-xs text-zinc-300 leading-relaxed prose prose-invert prose-xs max-w-none"
                dangerouslySetInnerHTML={{ __html: assignment.details }}
              />
            </div>
          )}

          {/* Download Assignment PDF Button */}
          {downloadUrl && (
            <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Question Paper / PDF</h4>
                  <p className="text-[11px] text-zinc-400">Official attachment provided by instructor</p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
              >
                <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>
          )}

          {/* Error / Success feedback */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Upload Solution Section */}
          {assignment.upload && assignment.can_submit && (
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-brand-400" />
                <span>Upload Assignment Submission</span>
              </span>
              <p className="text-xs text-zinc-400">
                Select your solution file (PDF, image, or document) and submit before the deadline.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <input
                  type="file"
                  id="assignment-file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.zip"
                />
                <label
                  htmlFor="assignment-file"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs text-zinc-200 cursor-pointer transition-colors truncate"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{selectedFile ? selectedFile.name : 'Choose File...'}</span>
                </label>

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Submit'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Delete submission button if available */}
          {assignment.can_delete_submission && (
            <div className="pt-2">
              <button
                onClick={handleDeleteSubmission}
                disabled={deleting}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete my current submission</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
