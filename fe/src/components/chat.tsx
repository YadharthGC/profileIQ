import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { chatAPI } from '../api'

interface Message {
  role: 'user' | 'ai'
  content: string
}

interface ChatProps {
  profileId: string | null
  profileName: string | null
}

export default function Chat({ profileId, profileName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Reset chat when profile changes
  useEffect(() => {
    setMessages([])
  }, [profileId])

  const handleSend = async () => {
    if (!input.trim() || !profileId || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await axios.post(chatAPI + 'message', {
        profileId,
        message: userMessage
      }, { withCredentials: true })

      setMessages(prev => [...prev, { role: 'ai', content: res.data.message }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const initials = (name: string) =>
    name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  // No profile selected
  if (!profileId) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center text-2xl">
          🔍
        </div>
        <p className="text-[#333355] text-sm font-medium" style={{ fontFamily: 'Syne, sans-serif' }}>
          Select a profile or analyze a new one
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Messages area */}
      <div className="custom-scroll flex-1 overflow-auto px-4 py-6 space-y-6">

        {/* Profile banner */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 max-w-2xl mx-auto w-full">
          <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials(profileName || '')}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{profileName}</p>
            <p className="text-[0.72rem] text-[#555570]">LinkedIn Profile Analysis</p>
          </div>
          <div className="ml-auto text-[0.72rem] px-2 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-semibold">
            ● Ready
          </div>
        </div>

        {/* Messages */}
        <div className="max-w-2xl mx-auto w-full space-y-6">

          {messages.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#333355] text-sm">Ask anything about <span className="text-[#555570] font-medium">{profileName}</span></p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {[
                  'What work culture do they prefer?',
                  'Summarize their career',
                  'Any H1B related posts?',
                  'What are their top skills?'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-[0.72rem] px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[#555570] hover:text-white hover:border-[#0A66C2]/40 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            msg.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#0A66C2] text-white text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#00D4FF] flex items-center justify-center text-white text-xs shrink-0 mt-1">
                  P
                </div>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-[#0F0F17] border border-white/[0.06] text-sm text-[#C8C8D8] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            )
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#00D4FF] flex items-center justify-center text-white text-xs shrink-0">
                P
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#0F0F17] border border-white/[0.06] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#555570] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#555570] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#555570] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="px-4 py-4 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 px-4 py-3 rounded-2xl bg-[#0F0F17] border border-white/[0.07] focus-within:border-[#0A66C2]/40 focus-within:shadow-[0_0_24px_rgba(10,102,194,0.08)] transition-all duration-300">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this profile..."
              className="flex-1 bg-transparent text-sm text-white placeholder-[#2e2e45] resize-none outline-none leading-relaxed max-h-32 py-0.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              onInput={(e) => {
                const t = e.currentTarget
                t.style.height = 'auto'
                t.style.height = t.scrollHeight + 'px'
              }}
            />
            <button
              title="Send"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="shrink-0 w-8 h-8 rounded-xl bg-[#0A66C2] hover:bg-[#0582CA] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] active:scale-95 mb-0.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[0.63rem] text-[#222238] mt-2">
            ProfileIQ analyzes publicly available LinkedIn data only.
          </p>
        </div>
      </div>

    </div>
  )
}