import { useState } from 'react'
import { X, Search, Linkedin, Loader2 } from 'lucide-react'
import axios from 'axios'
import { profileAPI } from '../api'

interface NewProfileDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: (profileId: string, name: string) => void
}

export default function NewProfileDialog({ open, onClose, onSuccess }: NewProfileDialogProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  if (!open) return null

  const handleSearch = async () => {
    try {
      setLoading(true)
      setStatus('Fetching profile info...')

      setTimeout(() => setStatus('Loading posts & activity...'), 15000)
      setTimeout(() => setStatus('Analyzing experience & skills...'), 35000)
      setTimeout(() => setStatus('Saving to database...'), 55000)

      const res = await axios.post(profileAPI + 'analyze', { url }, { withCredentials: true })

      if (res.status === 200) {
        setStatus('Done! Opening chat...')
        const { chatId, name } = res.data
        setTimeout(() => {
          onSuccess(chatId, name)
          onClose()
          setUrl('')
          setStatus('')
          setLoading(false)
        }, 800)
      }
    } catch (err) {
      console.log(err)
      setStatus('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={!loading ? onClose : undefined} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-[#0F0F17] border border-white/[0.08] rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                Analyze a Profile
              </h2>
              <p className="text-xs text-[#555570] mt-0.5">Paste a LinkedIn profile URL to get started</p>
            </div>
            {!loading && (
              <button
                title="btn"
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#444460] hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#0A66C2] border-t-transparent animate-spin" />
              <p className="text-sm text-[#00D4FF] font-medium text-center">{status}</p>
              <p className="text-[0.7rem] text-[#333355] text-center">
                This takes 5–7 minutes. Please keep this tab open.
              </p>
            </div>
          ) : (
            <>
              {/* Input */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-1.5 block">
                  LinkedIn Profile URL
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] focus-within:border-[#0A66C2]/50 focus-within:shadow-[0_0_0_3px_rgba(10,102,194,0.08)] transition-all">
                  <Linkedin size={15} className="text-[#0A66C2] shrink-0" />
                  <input
                    autoFocus
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/username"
                    className="flex-1 bg-transparent text-sm text-white placeholder-[#2e2e45] outline-none"
                  />
                  {url && (
                    <button title="clear" onClick={() => setUrl('')} className="text-[#444460] hover:text-white transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Hint */}
              <p className="text-[0.7rem] text-[#333355] mb-5">
                💡 Example: linkedin.com/in/johndoe — only public profiles can be analyzed
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-[#888899] hover:text-white hover:bg-white/[0.06] transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={!url.trim()}
                  onClick={handleSearch}
                  className="flex-1 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#0582CA] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search size={14} />
                  Search Profile
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}