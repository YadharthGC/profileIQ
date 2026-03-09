import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Linkedin, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { authAPI } from '../api'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      console.log(form)
      const res = await axios.post(authAPI + "login", form, { withCredentials: true })
      if (res.status === 200) {
        navigate('/profileiq')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
      `}</style>

      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: 'DM Sans, sans-serif' }}>

        {/* Orbs */}
        <div className="orb w-96 h-96 bg-[#0A66C2]/10 -top-20 -left-20" />
        <div className="orb w-72 h-72 bg-[#00D4FF]/6 bottom-0 right-0" />

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
            <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Welcome back</h1>
            <p className="text-sm text-[#555570] mb-7">Sign in to continue analyzing profiles</p>

            <div className="space-y-4">

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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#555570] uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-[#0A66C2] hover:text-[#00D4FF] transition-colors">Forgot password?</a>
                </div>
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
              </div>

              {/* Submit */}
              <button onClick={() => { handleLogin() }} className="w-full py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#0582CA] text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(10,102,194,0.4)] active:scale-[0.98] mt-2">
                Sign in
              </button>



            </div>
          </div>

          <p className="text-center text-sm text-[#333350] mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0A66C2] hover:text-[#00D4FF] font-semibold transition-colors">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}