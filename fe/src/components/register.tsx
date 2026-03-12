import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Linkedin, Eye, EyeOff, Check } from 'lucide-react'
import { authAPI } from '../api'
import axios from "axios"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const passwordChecks = [
    { label: 'At least 8 characters', pass: form.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(form.password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(form.password) },
  ]

  const handleRegister = async () => {
    try {
      console.log(form)
      const res = await axios.post(authAPI + "register", form)
      navigate("/")


    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
      `}</style>

      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: 'DM Sans, sans-serif' }}>

        {/* Orbs */}
        <div className="orb w-96 h-96 bg-[#0A66C2]/10 -top-20 -right-20" />
        <div className="orb w-72 h-72 bg-[#00D4FF]/6 bottom-0 left-0" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Linkedin size={24} className="text-[#0A66C2]" />
            <span className="font-bold text-xl bg-gradient-to-r from-[#0A66C2] to-[#00D4FF] bg-clip-text text-transparent" style={{ fontFamily: 'Syne, sans-serif' }}>
              ProfileIQ
            </span>
          </div>

          {/* Card */}
          <div className="bg-[#0F0F17] border border-white/[0.07] rounded-2xl p-8">
            <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Create your account</h1>
            <p className="text-sm text-[#555570] mb-7">Start analyzing LinkedIn profiles with AI</p>

            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#2e2e45] outline-none focus:border-[#0A66C2]/50 focus:shadow-[0_0_0_3px_rgba(10,102,194,0.08)] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-1.5 block">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#2e2e45] outline-none focus:border-[#0A66C2]/50 focus:shadow-[0_0_0_3px_rgba(10,102,194,0.08)] transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-[#555570] uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#2e2e45] outline-none focus:border-[#0A66C2]/50 focus:shadow-[0_0_0_3px_rgba(10,102,194,0.08)] transition-all pr-11"
                  />
                  <button
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444460] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength checks */}
                {form.password.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {passwordChecks.map(({ label, pass }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${pass ? 'bg-emerald-400/20' : 'bg-white/[0.04]'}`}>
                          <Check size={9} className={pass ? 'text-emerald-400' : 'text-[#333350]'} />
                        </div>
                        <span className={`text-[0.7rem] transition-colors ${pass ? 'text-emerald-400' : 'text-[#333350]'}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button onClick={() => {
                handleRegister()
              }} className="w-full py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#0582CA] text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(10,102,194,0.4)] active:scale-[0.98] mt-2">
                Create account
              </button>


              <p className="text-[0.7rem] text-[#333350] text-center">
                By signing up you agree to our{' '}
                <a href="#" className="text-[#0A66C2] hover:text-[#00D4FF] transition-colors">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-[#0A66C2] hover:text-[#00D4FF] transition-colors">Privacy Policy</a>
              </p>

            </div>
          </div>

          <p className="text-center text-sm text-[#333350] mt-5">
            Already have an account?{' '}
            <Link to="/" className="text-[#0A66C2] hover:text-[#00D4FF] font-semibold transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}