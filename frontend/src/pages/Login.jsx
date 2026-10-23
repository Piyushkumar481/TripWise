import { useEffect, useRef, useState } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Plane } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { loginUser } from "../services/authService"
import { getApiErrorMessage } from "../utils/errorHandler"
import { useAuth } from "../context/useAuth"

function Brand() {
  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="TripWise home">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#129c9c] text-white shadow-lg shadow-teal-900/10">
        <Plane size={21} strokeWidth={2.3} />
      </span>
      <span>
        <span className="block text-xl font-extrabold tracking-tight text-[#17233c]">
          Trip<span className="text-[#129c9c]">Wise</span>
        </span>
        <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.24em] text-[#86939d]">Travel differently</span>
      </span>
    </Link>
  )
}

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const errorRef = useRef(null)

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return
    setError("")

    if (!formData.email.trim()) {
      setError("Email is required.")
      return
    }
    if (!formData.password) {
      setError("Password is required.")
      return
    }

    try {
      setLoading(true)
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
      login(response)
      navigate("/trips")
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please check your email and password."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#17233c]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-7 sm:py-5 lg:px-10">
        <Brand />
        <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#667586] transition hover:bg-[#e5f6f2] hover:text-[#087f82]">
          Back home
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-6 sm:px-7 sm:pb-9 lg:grid-cols-[1fr_0.86fr] lg:gap-7 lg:px-10">
        <div className="relative hidden min-h-[590px] overflow-hidden rounded-[28px] border border-[#dfe7df] bg-[#dff1ed] lg:block">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=85"
            alt="Serene mountain lake on a travel adventure"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122d3e]/80 via-[#122d3e]/15 to-[#122d3e]/10" />
          <div className="absolute inset-x-0 bottom-0 p-9 xl:p-12">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
              <Plane size={14} /> Welcome back
            </span>
            <h1 className="max-w-lg font-serif text-4xl font-bold leading-tight text-white xl:text-5xl">
              The journey is yours.
              <span className="mt-1 block italic text-[#c5f0e8]">Make every moment count.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
              Your trips, plans and travel memories are waiting for you.
            </p>
          </div>
          <div className="absolute right-7 top-7 rounded-2xl border border-white/40 bg-white/80 px-4 py-3 backdrop-blur">
            <p className="font-serif text-base italic text-[#526c7c]">“Collect moments, not things.”</p>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-center rounded-[28px] border border-[#e3e7df] bg-white px-5 py-8 shadow-[0_24px_75px_-50px_rgba(23,35,60,0.3)] sm:px-9 sm:py-10 lg:px-10 xl:px-14">
          <div className="w-full max-w-[440px]">
            <div className="mb-7 flex items-center gap-2 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f6f2] text-[#129c9c]">
                <Plane size={19} />
              </span>
              <span className="font-serif text-sm italic text-[#637888]">Your next chapter awaits.</span>
            </div>

            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-[#129c9c]">Your travel space</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#17233c] sm:text-4xl">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-[#788793]">Sign in to pick up where your next adventure begins.</p>

            {error && (
              <div ref={errorRef} role="alert" aria-live="assertive" tabIndex={-1} className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#4e6070]">Email address</label>
                <div className="relative">
                  <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#93a2ab]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#e0e7e2] bg-[#fffefa] pl-11 pr-4 text-sm text-[#17233c] outline-none transition placeholder:text-[#a2adb3] hover:border-[#b8dcd5] focus:border-[#129c9c] focus:ring-4 focus:ring-[#129c9c]/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#4e6070]">Password</label>
                <div className="relative">
                  <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#93a2ab]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-[#e0e7e2] bg-[#fffefa] pl-11 pr-12 text-sm text-[#17233c] outline-none transition placeholder:text-[#a2adb3] hover:border-[#b8dcd5] focus:border-[#129c9c] focus:ring-4 focus:ring-[#129c9c]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#82939f] transition hover:bg-[#eaf6f4] hover:text-[#087f82]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#129c9c] px-5 text-sm font-bold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#0b8588] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to TripWise"}
                {!loading && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#7f8d97]">
              New to TripWise?{" "}
              <Link to="/register" className="font-bold text-[#078a8d] hover:text-[#075e66]">Create an account</Link>
            </p>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-5 text-center text-xs text-[#92a0a5]">
        A little planning. A lot more wonder.
      </footer>
    </main>
  )
}

export default Login
