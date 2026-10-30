import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  Bell, 
  Search, 
  ExternalLink, 
  Calendar, 
  FileText,
  User,
  Download
} from 'lucide-react'
import { downloadFileWithAuth } from '../utils/download'
import { formatIndianDate } from '../utils/format'

export const NoticesPage: React.FC = () => {
  const { profile } = useAuth()
  const [search, setSearch] = useState('')

  const notices = profile?.notices || []
  const circulars = profile?.circulars || []

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.content && n.content.toLowerCase().includes(search.toLowerCase())) ||
    (n.posted_by && n.posted_by.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-brand-400" />
            <span>Notices & Circulars</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Departmental announcements and university circulars
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4 mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Campus Notices ({filteredNotices.length})
        </h2>

        {filteredNotices.length > 0 ? (
          filteredNotices.map((n) => (
            <div
              key={n.id}
              className="glass-panel rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 text-brand-400 font-medium">
                  <User className="w-3.5 h-3.5" />
                  {n.posted_by || 'Academic Cell'}
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" /> {formatIndianDate(n.date, 'numeric')}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{n.title}</h3>
              {n.content && (
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed pt-1">
                  {n.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-zinc-500 glass-panel rounded-2xl border border-zinc-800">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No matching notices found</p>
          </div>
        )}
      </div>

      {/* University Circulars */}
      {circulars.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Official Circulars ({circulars.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {circulars.map((c) => (
              <div
                key={c.id}
                className="glass-panel rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                    <Calendar className="w-3.5 h-3.5" /> {formatIndianDate(c.date, 'numeric')}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-2">{c.title}</h4>
                  {c.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">{c.description}</p>
                  )}
                </div>

                {c.url && c.url !== '#' && (
                  <button
                    type="button"
                    onClick={() => downloadFileWithAuth(c.url!, `${c.title}.pdf`).catch(console.error)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors pt-2 border-t border-zinc-800/60 w-fit"
                  >
                    <span>Download Official PDF</span>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
