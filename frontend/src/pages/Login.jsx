import { useState } from "react"
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  MapPin,
  Plane,
  Sparkles,
} from "lucide-react"

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">

      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">

        {/* =====================================================
            LEFT — CINEMATIC TRAVEL HERO
        ====================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden lg:flex">

          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=90"
            alt="Mountain landscape with lake"
            className="absolute inset-0 h-full w-full scale-105 object-cover animate-[heroFloat_18s_ease-in-out_infinite]"
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#050816]/95 via-[#071b34]/45 to-[#25104f]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.22),transparent_35%)]" />

          {/* Ambient animated glows */}
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-[glowPulse_7s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl animate-[glowPulse_9s_ease-in-out_infinite_reverse]" />

          {/* Content */}
          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">

            {/* Brand */}
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                <Plane size={22} className="text-cyan-300" />
              </div>

              <div>
                <p className="text-xl font-bold tracking-tight">
                  Trip<span className="text-cyan-300">Wise</span>
                </p>

                <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Travel smarter
                </p>
              </div>

            </div>

            {/* Hero copy */}
            <div className="max-w-2xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-cyan-200 backdrop-blur-xl">
                <Sparkles size={14} />
                Your journey starts here
              </div>

              <h1 className="text-6xl font-black leading-[0.95] tracking-[-0.04em] xl:text-8xl">
                Travel
                <span className="block bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                  more.
                </span>
                <span className="mt-2 block">
                  Plan smarter.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/70 xl:text-lg">
                Organize every trip, itinerary, expense and travel detail
                inside one beautifully designed workspace.
              </p>

              {/* Floating travel card */}
              <div className="mt-10 inline-flex max-w-md items-center gap-4 rounded-2xl border border-white/15 bg-black/25 px-4 py-4 shadow-2xl shadow-black/20 backdrop-blur-2xl animate-[cardFloat_6s_ease-in-out_infinite]">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/20">
                  <MapPin size={20} className="text-cyan-300" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40">
                    Next adventure
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    Plan. Pack. Go.
                  </p>
                </div>

                <Compass
                  size={20}
                  className="ml-auto text-violet-300"
                />

              </div>

            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-white/40">

              <span className="flex items-center gap-2">
                <Globe2 size={14} />
                Explore without limits
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

              <span>
                Plan the journey. Remember the moments.
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT — LOGIN PANEL
        ====================================================== */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">

          {/* Mobile ambient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_90%_85%,rgba(139,92,246,0.14),transparent_30%)]" />

          <div className="relative z-10 w-full max-w-md">

            {/* Mobile brand */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 ring-1 ring-cyan-300/20">
                <Plane size={20} className="text-cyan-300" />
              </div>

              <span className="text-2xl font-bold">
                Trip<span className="text-cyan-300">Wise</span>
              </span>

            </div>


            {/* Glass login card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9">

              {/* Card glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">

                {/* Small status pill */}
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
                  Smart travel workspace
                </div>

                <p className="text-sm font-medium text-cyan-300">
                  Welcome back
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
                  Sign in to
                  <span className="block bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                    TripWise
                  </span>
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                  Continue planning your next adventure.
                </p>


                {/* Form */}
                <form
                  className="mt-8 space-y-5"
                  onSubmit={(event) => event.preventDefault()}
                >

                  {/* Email */}
                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email address
                    </label>

                    <div className="group relative">

                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300"
                      />

                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="
                          h-13 w-full rounded-2xl
                          border border-white/10
                          bg-black/20
                          pl-11 pr-4
                          text-sm text-white
                          outline-none
                          placeholder:text-slate-600
                          transition-all duration-300
                          hover:border-white/20
                          focus:border-cyan-300/50
                          focus:bg-white/[0.055]
                          focus:ring-4
                          focus:ring-cyan-300/10
                        "
                      />

                    </div>

                  </div>


                  {/* Password */}
                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-300"
                      >
                        Password
                      </label>

                      <a
                        href="#"
                        className="text-xs font-semibold text-cyan-300 transition hover:text-violet-300"
                      >
                        Forgot password?
                      </a>

                    </div>

                    <div className="group relative">

                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300"
                      />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="
                          h-13 w-full rounded-2xl
                          border border-white/10
                          bg-black/20
                          pl-11 pr-12
                          text-sm text-white
                          outline-none
                          placeholder:text-slate-600
                          transition-all duration-300
                          hover:border-white/20
                          focus:border-cyan-300/50
                          focus:bg-white/[0.055]
                          focus:ring-4
                          focus:ring-cyan-300/10
                        "
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="
                          absolute right-3 top-1/2
                          -translate-y-1/2
                          rounded-xl p-2
                          text-slate-500
                          transition-all duration-200
                          hover:bg-white/10
                          hover:text-cyan-200
                        "
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* Remember */}
                  <div className="flex items-center justify-between pt-1">

                    <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">

                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-300"
                      />

                      Remember me

                    </label>

                    <span className="text-xs text-slate-600">
                      Stay signed in
                    </span>

                  </div>


                  {/* CTA */}
                  <button
                    type="submit"
                    className="
                      group relative flex h-13 w-full
                      items-center justify-center gap-2
                      overflow-hidden rounded-2xl
                      bg-gradient-to-r
                      from-cyan-300
                      via-sky-400
                      to-violet-400
                      text-sm font-bold
                      text-slate-950
                      shadow-[0_12px_35px_rgba(34,211,238,0.18)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_18px_45px_rgba(34,211,238,0.28)]
                      active:translate-y-0
                    "
                  >

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative">
                      Continue your journey
                    </span>

                    <ArrowRight
                      size={17}
                      className="relative transition-transform duration-300 group-hover:translate-x-1"
                    />

                  </button>

                </form>


                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    TripWise
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>


                <p className="text-center text-sm text-slate-500">

                  Don't have an account?{" "}

                  <a
                    href="/register"
                    className="font-semibold text-cyan-300 transition hover:text-violet-300"
                  >
                    Create one
                  </a>

                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Login
