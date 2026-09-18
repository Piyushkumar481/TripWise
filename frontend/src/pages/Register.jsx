import { useState } from "react"
import {
  ArrowRight,
  Check,
  Compass,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Plane,
  Sparkles,
  User,
} from "lucide-react"

import { registerUser } from "../services/authService"

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

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

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

      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }

      const response = await registerUser(registerData)

      setSuccess(
        response.message || "Account created successfully!"
      )

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      })
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again."

      setError(backendMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf8f5] text-[#28242b]">

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#f6c8bd]/35 blur-2xl" />

        <div className="absolute -right-40 top-[8%] h-80 w-80 rounded-full bg-[#d9d0f4]/35 blur-2xl" />

        <div className="absolute -bottom-48 left-[35%] h-80 w-80 rounded-full bg-[#c8e7df]/30 blur-3xl" />

        <div className="absolute left-[8%] top-[30%] h-3 w-3 rounded-full bg-[#d9828f]/50 shadow-[0_0_25px_rgba(217,130,143,0.45)] " />

        <div className="absolute bottom-[24%] right-[12%] h-2 w-2 rounded-full bg-[#8d78bd]/45 shadow-[0_0_20px_rgba(141,120,189,0.4)] " />

      </div>

      {/* Top decorative line */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d98791]/40 to-transparent" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">

        <a href="/" className="group flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/75 shadow-[0_10px_35px_rgba(87,65,67,0.10)] backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_15px_40px_rgba(87,65,67,0.16)]">

            <Plane
              size={20}
              className="text-[#b96778] transition-transform duration-300 group-hover:-rotate-12"
            />

          </div>

          <div>

            <p className="text-xl font-black tracking-[-0.03em] text-[#2b252c]">
              Trip<span className="text-[#c66c7c]">Wise</span>
            </p>

            <p className="hidden text-[8px] font-bold uppercase tracking-[0.3em] text-[#a69ba1] sm:block">
              travel differently
            </p>

          </div>

        </a>

        <div className="hidden items-center gap-2 text-xs font-medium text-[#91878e] sm:flex">

          <span>Already planning?</span>

          <a
            href="/login"
            className="font-bold text-[#a95d70] transition hover:text-[#805e9d]"
          >
            Sign in
          </a>

        </div>

      </header>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-89px)] max-w-7xl items-center px-5 pb-12 pt-5 sm:px-8 lg:px-12 xl:px-16">

        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24">

          {/* Left content */}
          <section className="hidden lg:block">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e9dcd7] bg-white/65 px-4 py-2 shadow-sm backdrop-blur-md">

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f4dce0]">

                <Sparkles
                  size={11}
                  className="text-[#b76578]"
                />

              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9c737d]">
                Begin something beautiful
              </span>

            </div>

            <h1 className="max-w-xl text-6xl font-black leading-[0.98] tracking-[-0.055em] text-[#29242a] xl:text-7xl">

              Every journey

              <span className="block bg-gradient-to-r from-[#bd6175] via-[#d77f8b] to-[#8d73b6] bg-clip-text text-transparent">
                starts here.
              </span>

            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-[#766d75] xl:text-lg xl:leading-8">
              Create your TripWise account and turn the places
              you've been dreaming about into journeys you'll
              never forget.
            </p>

            <div className="mt-9 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5ddd7] to-[#eee4f5] shadow-sm">

                <Compass
                  size={21}
                  className="text-[#a76c85]"
                />

              </div>

              <div>

                <p className="text-sm font-bold text-[#413940]">
                  Plan with intention.
                </p>

                <p className="mt-1 text-xs text-[#978d94]">
                  Travel with more freedom.
                </p>

              </div>

            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">

              <div className="rounded-2xl border border-white bg-white/60 p-4 shadow-[0_12px_35px_rgba(85,64,70,0.06)] backdrop-blur-md">

                <p className="text-lg font-black text-[#bd6577]">
                  01
                </p>

                <p className="mt-2 text-[11px] font-semibold leading-4 text-[#716870]">
                  Plan your
                  <br />
                  escape
                </p>

              </div>

              <div className="rounded-2xl border border-white bg-white/60 p-4 shadow-[0_12px_35px_rgba(85,64,70,0.06)] backdrop-blur-md">

                <p className="text-lg font-black text-[#9276b7]">
                  02
                </p>

                <p className="mt-2 text-[11px] font-semibold leading-4 text-[#716870]">
                  Organize
                  <br />
                  everything
                </p>

              </div>

              <div className="rounded-2xl border border-white bg-white/60 p-4 shadow-[0_12px_35px_rgba(85,64,70,0.06)] backdrop-blur-md">

                <p className="text-lg font-black text-[#659b8e]">
                  03
                </p>

                <p className="mt-2 text-[11px] font-semibold leading-4 text-[#716870]">
                  Remember
                  <br />
                  the moments
                </p>

              </div>

            </div>

          </section>

          {/* Register card */}
          <section className="flex justify-center lg:justify-end">

            <div className="w-full max-w-[520px]">

              <div className="relative overflow-hidden rounded-[2.25rem] border border-white bg-white/80 p-6 shadow-[0_35px_90px_rgba(67,48,58,0.13)]  sm:p-9">

                {/* Card top accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f1a49b] via-[#d98091] to-[#a58bd2]" />

                {/* Card glow */}
                <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[#f5d1ca]/35 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-[#ded6f1]/30 blur-3xl" />

                <div className="relative">

                  {/* Mobile logo */}
                  <div className="mb-7 flex items-center gap-2 lg:hidden">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8e9e7]">

                      <Plane
                        size={17}
                        className="text-[#b86678]"
                      />

                    </div>

                    <span className="text-lg font-black text-[#302930]">
                      Trip<span className="text-[#c66d7d]">Wise</span>
                    </span>

                  </div>

                  {/* Heading */}
                  <div>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#faf0ed] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#a56474]">

                      <span className="h-1.5 w-1.5 rounded-full bg-[#d77d8d] shadow-[0_0_9px_rgba(215,125,141,0.7)]" />

                      New journey

                    </div>

                    <h2 className="text-3xl font-black tracking-[-0.045em] text-[#2c262d] sm:text-4xl">
                      Create your account
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#81777f]">
                      Your next adventure deserves a place to begin.
                      Let's make it yours.
                    </p>

                  </div>

                  {/* Success message */}
                  {success && (
                    <div className="mt-6 rounded-2xl border border-[#c8e7df] bg-[#effaf6] px-4 py-3 text-sm font-medium text-[#4c8a7c]">
                      {success}
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="mt-6 rounded-2xl border border-[#f0c8c8] bg-[#fff3f3] px-4 py-3 text-sm font-medium text-[#b45f68]">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <form
                    className="mt-7 space-y-4"
                    onSubmit={handleSubmit}
                  >

                    {/* Full name */}
                    <div>

                      <label
                        htmlFor="fullName"
                        className="mb-2 block text-xs font-bold tracking-wide text-[#554c54]"
                      >
                        Full name
                      </label>

                      <div className="group relative">

                        <User
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa0a7] transition group-focus-within:text-[#bd687a]"
                        />

                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="What should we call you?"
                          className="h-12 w-full rounded-2xl border border-[#e9dfdb] bg-[#fffdfc] pl-11 pr-4 text-sm text-[#332d34] outline-none placeholder:text-[#b1a8ad] shadow-[0_4px_15px_rgba(70,52,58,0.03)] transition-all duration-300 hover:border-[#dccdc8] focus:border-[#d58a97] focus:bg-white focus:ring-4 focus:ring-[#eaa3ad]/12"
                        />

                      </div>

                    </div>

                    {/* Email */}
                    <div>

                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-bold tracking-wide text-[#554c54]"
                      >
                        Email address
                      </label>

                      <div className="group relative">

                        <Mail
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa0a7] transition group-focus-within:text-[#bd687a]"
                        />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="h-12 w-full rounded-2xl border border-[#e9dfdb] bg-[#fffdfc] pl-11 pr-4 text-sm text-[#332d34] outline-none placeholder:text-[#b1a8ad] shadow-[0_4px_15px_rgba(70,52,58,0.03)] transition-all duration-300 hover:border-[#dccdc8] focus:border-[#d58a97] focus:bg-white focus:ring-4 focus:ring-[#eaa3ad]/12"
                        />

                      </div>

                    </div>

                    {/* Phone */}
                    <div>

                      <label
                        htmlFor="phone"
                        className="mb-2 block text-xs font-bold tracking-wide text-[#554c54]"
                      >
                        Phone number
                        <span className="ml-1 font-normal text-[#aaa0a7]">
                          (optional)
                        </span>
                      </label>

                      <div className="group relative">

                        <Phone
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa0a7] transition group-focus-within:text-[#bd687a]"
                        />

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="h-12 w-full rounded-2xl border border-[#e9dfdb] bg-[#fffdfc] pl-11 pr-4 text-sm text-[#332d34] outline-none placeholder:text-[#b1a8ad] shadow-[0_4px_15px_rgba(70,52,58,0.03)] transition-all duration-300 hover:border-[#dccdc8] focus:border-[#d58a97] focus:bg-white focus:ring-4 focus:ring-[#eaa3ad]/12"
                        />

                      </div>

                    </div>

                    {/* Password */}
                    <div>

                      <label
                        htmlFor="password"
                        className="mb-2 block text-xs font-bold tracking-wide text-[#554c54]"
                      >
                        Password
                      </label>

                      <div className="group relative">

                        <LockKeyhole
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa0a7] transition group-focus-within:text-[#bd687a]"
                        />

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          className="h-12 w-full rounded-2xl border border-[#e9dfdb] bg-[#fffdfc] pl-11 pr-12 text-sm text-[#332d34] outline-none placeholder:text-[#b1a8ad] shadow-[0_4px_15px_rgba(70,52,58,0.03)] transition-all duration-300 hover:border-[#dccdc8] focus:border-[#d58a97] focus:bg-white focus:ring-4 focus:ring-[#eaa3ad]/12"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#a49aa1] transition hover:bg-[#faefed] hover:text-[#ad6073]"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                      </div>

                      <div className="mt-2 flex items-center gap-2 text-[10px] text-[#a29aa0]">

                        <span className="h-1 w-1 rounded-full bg-[#d98b96]" />

                        Use at least 8 characters.

                      </div>

                    </div>

                    {/* Confirm password */}
                    <div>

                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-xs font-bold tracking-wide text-[#554c54]"
                      >
                        Confirm password
                      </label>

                      <div className="group relative">

                        <LockKeyhole
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa0a7] transition group-focus-within:text-[#bd687a]"
                        />

                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Repeat your password"
                          className="h-12 w-full rounded-2xl border border-[#e9dfdb] bg-[#fffdfc] pl-11 pr-12 text-sm text-[#332d34] outline-none placeholder:text-[#b1a8ad] shadow-[0_4px_15px_rgba(70,52,58,0.03)] transition-all duration-300 hover:border-[#dccdc8] focus:border-[#d58a97] focus:bg-white focus:ring-4 focus:ring-[#eaa3ad]/12"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#a49aa1] transition hover:bg-[#faefed] hover:text-[#ad6073]"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                      </div>

                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 rounded-2xl border border-[#eee5e1] bg-[#fffdfb]/70 p-3">

                      <input
                        id="terms"
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#d9ccc7] accent-[#cf7183]"
                      />

                      <label
                        htmlFor="terms"
                        className="cursor-pointer text-[11px] leading-5 text-[#837981]"
                      >
                        I agree to the TripWise terms and privacy
                        policy and understand how my information is used.
                      </label>

                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ef928b] via-[#df7d91] to-[#a587d4] text-sm font-bold text-white shadow-[0_16px_35px_rgba(202,116,137,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(177,107,137,0.32)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative">
                        {loading
                          ? "Creating account..."
                          : "Create my TripWise account"}
                      </span>

                      {!loading && (
                        <ArrowRight
                          size={17}
                          className="relative transition-transform duration-300 group-hover:translate-x-1"
                        />
                      )}

                    </button>

                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-3">

                    <div className="h-px flex-1 bg-[#eee4df]" />

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faf0ed]">

                      <Check
                        size={13}
                        className="text-[#bd7180]"
                      />

                    </div>

                    <div className="h-px flex-1 bg-[#eee4df]" />

                  </div>

                  {/* Login link */}
                  <p className="text-center text-xs text-[#8b8188]">

                    Already have a TripWise account?{" "}

                    <a
                      href="/login"
                      className="font-bold text-[#a65d72] transition hover:text-[#805e9d]"
                    >
                      Sign in
                    </a>

                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

      {/* Mobile footer */}
      <div className="relative z-10 px-6 pb-8 text-center lg:hidden">

        <p className="text-xs font-medium tracking-wide text-[#a0979e]">
          Plan less. Experience more. Remember everything.
        </p>

      </div>

    </main>
  )
}

export default Register
