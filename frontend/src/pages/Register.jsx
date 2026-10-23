import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Plane,
  Sparkles,
  User,
  UserRound,
} from "lucide-react"
import { Link } from "react-router-dom"

import { registerUser } from "../services/authService"
import { getApiErrorMessage } from "../utils/errorHandler"

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

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const errorRef = useRef(null)

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    setError("")
    setSuccess("")

    if (!formData.fullName.trim()) {
      setError("Full name is required.")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required.")
      return
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const response = await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone,
      })

      setSuccess(response.message || "Account created successfully. You can now sign in.")
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#17233c]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-7 sm:py-5 lg:px-10">
        <Brand />
        <p className="text-right text-xs text-[#7d8c96] sm:text-sm">
          Already a member?{" "}
          <Link to="/login" className="font-bold text-[#078a8d] hover:text-[#075e66]">Sign in</Link>
        </p>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-7 sm:px-7 lg:grid-cols-[0.78fr_1fr] lg:gap-7 lg:px-10">
        <div className="relative hidden min-h-[650px] overflow-hidden rounded-[28px] border border-[#d9e8df] bg-gradient-to-br from-[#e0f4ee] via-[#f8f7ee] to-[#f4e5cf] p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#acdcd1]/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#efd2ac]/60 blur-3xl" />
          <div className="pointer-events-none absolute inset-5 rounded-[24px] border border-white/75" />

          <div className="relative flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#618c84]">
              <Plane size={14} />
              Begin somewhere
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/70 text-[#129c9c] shadow-sm">
              <Compass size={19} />
            </span>
          </div>

          <div className="relative py-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[#668e86]">
              A little space for your dreams
            </p>

            <h1 className="max-w-md font-serif text-5xl font-bold leading-[1.08] tracking-tight text-[#17233c] xl:text-6xl">
              Make room
              <span className="mt-1 block italic text-[#129c9c]">
                for wonder.
              </span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#6c8289]">
              Your journeys, plans and little details, thoughtfully kept together.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-[#129c9c] shadow-sm">
                <CalendarDays size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-[#273d4b]">
                  Plan at your own pace.
                </p>
                <p className="mt-1 text-xs text-[#82958e]">
                  Your next chapter starts here.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[24px] border border-white/85 bg-white/75 p-5 shadow-[0_20px_55px_-35px_rgba(23,65,67,0.25)] backdrop-blur-xl xl:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#129c9c]">
                  Your travel notebook
                </p>
                <p className="mt-1 text-sm font-bold text-[#17233c]">
                  Everything in its place.
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f6f2] text-[#129c9c]">
                <Plane size={19} />
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#eff8f5] px-2 py-3 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#129c9c]">
                  <MapPin size={16} />
                </span>
                <p className="mt-2 text-[10px] font-bold text-[#536f70]">
                  Places
                </p>
              </div>

              <div className="rounded-xl bg-[#faf3e8] px-2 py-3 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#b98b50]">
                  <CalendarDays size={16} />
                </span>
                <p className="mt-2 text-[10px] font-bold text-[#86745c]">
                  Plans
                </p>
              </div>

              <div className="rounded-xl bg-[#f0effa] px-2 py-3 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#8582c5]">
                  <Compass size={16} />
                </span>
                <p className="mt-2 text-[10px] font-bold text-[#706e9a]">
                  Explore
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#eaf0e9]">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#129c9c] to-[#82c9b8]" />
            </div>
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-center rounded-[28px] border border-[#e3e7df] bg-white px-5 py-7 shadow-[0_24px_75px_-50px_rgba(23,35,60,0.3)] sm:px-9 sm:py-9 lg:px-10 xl:px-14">
          <div className="w-full max-w-[490px]">
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f6f2] text-[#129c9c]">
                <Plane size={19} />
              </span>
              <span className="font-serif text-sm italic text-[#637888]">A new journey begins here.</span>
            </div>

            <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-[#129c9c]">Create your account</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#17233c] sm:text-4xl">Join TripWise</h2>
            <p className="mt-2 text-sm leading-6 text-[#788793]">Just the essentials. Your next adventure can start here.</p>

            {success && (
              <div role="status" aria-live="polite" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {success}
                <span className="mt-2 block">
                  <Link to="/login" className="font-bold underline underline-offset-2">Continue to sign in</Link>
                </span>
              </div>
            )}

            {error && (
              <div ref={errorRef} role="alert" aria-live="assertive" tabIndex={-1} className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-[#4e6070]">Full name</label>
                <div className="relative">
                  <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#93a2ab]" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="h-12 w-full rounded-xl border border-[#e0e7e2] bg-[#fffefa] pl-11 pr-4 text-sm text-[#17233c] outline-none transition placeholder:text-[#a2adb3] hover:border-[#b8dcd5] focus:border-[#129c9c] focus:ring-4 focus:ring-[#129c9c]/10"
                  />
                </div>
              </div>

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
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#4e6070]">
                  Phone number <span className="font-normal text-[#93a2ab]">(optional)</span>
                </label>
                <div className="relative">
                  <Phone size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#93a2ab]" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
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
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
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

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#4e6070]">Confirm password</label>
                <div className="relative">
                  <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#93a2ab]" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="h-12 w-full rounded-xl border border-[#e0e7e2] bg-[#fffefa] pl-11 pr-12 text-sm text-[#17233c] outline-none transition placeholder:text-[#a2adb3] hover:border-[#b8dcd5] focus:border-[#129c9c] focus:ring-4 focus:ring-[#129c9c]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#82939f] transition hover:bg-[#eaf6f4] hover:text-[#087f82]"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#129c9c] px-5 text-sm font-bold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#0b8588] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create my account"}
                {!loading && <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#7f8d97]">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-[#078a8d] hover:text-[#075e66]">Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-5 text-center text-xs text-[#92a0a5]">
        Plan a little. Explore a lot.
      </footer>
    </main>
  )
}

export default Register
