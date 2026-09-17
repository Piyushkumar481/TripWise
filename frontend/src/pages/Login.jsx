import { useState } from "react"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  Plane,
  Sparkles,
} from "lucide-react"

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#123b46]">

      {/* Full-screen real travel background */}
      <img
        src="https://images.unsplash.com/photo-1761047726527-6f263d10e09d?auto=format&fit=crop&w=3000&q=90"
        alt="Sailboats floating on clear turquoise ocean"
        className="absolute inset-0 h-full w-full object-cover animate-[travelZoom_24s_ease-in-out_infinite]"
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#12313c]/75 via-[#254c55]/25 to-transparent" />

      {/* Warm sunlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(255,205,157,0.28),transparent_27%)]" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#09232d]/65 to-transparent" />

      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute left-[52%] top-[20%] h-72 w-72 rounded-full bg-[#ffd3a8]/15 blur-[110px] animate-[sunGlow_8s_ease-in-out_infinite]" />

      <div className="pointer-events-none absolute right-[10%] bottom-[12%] h-80 w-80 rounded-full bg-[#c8e9e4]/10 blur-[120px] animate-[softGlow_10s_ease-in-out_infinite]" />


      {/* Brand */}
      <div className="absolute left-6 top-6 z-30 sm:left-10 sm:top-8 lg:left-12">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-xl">
            <Plane
              size={20}
              className="text-white"
            />
          </div>

          <div>

            <p className="text-xl font-black tracking-tight text-white">
              Trip<span className="text-[#ffd0ae]">Wise</span>
            </p>

            <p className="text-[9px] uppercase tracking-[0.3em] text-white/55">
              travel differently
            </p>

          </div>

        </div>

      </div>


      {/* Login card - left side */}
      <section className="relative z-20 flex min-h-screen items-center px-5 py-24 sm:px-8 lg:w-[58%] lg:px-12 xl:w-[55%] xl:px-20">

        <div className="w-full max-w-[470px]">

          <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-[#fffaf7]/90 p-6 shadow-[0_35px_100px_rgba(5,25,35,0.38)] backdrop-blur-2xl sm:p-9">

            {/* Card decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ffc0a8]/25 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#c9c1f4]/25 blur-3xl" />

            <div className="relative">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#eadbd4] bg-white/80 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a65d70]">

                <Sparkles
                  size={13}
                  className="text-[#d9818e]"
                />

                Your travel workspace

              </div>


              {/* Heading */}
              <p className="text-sm font-semibold text-[#b25e73]">
                Welcome back
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] text-[#28222a] sm:text-5xl">

                Sign in to

                <span className="block bg-gradient-to-r from-[#bd5c72] via-[#d47c8c] to-[#8d74b6] bg-clip-text text-transparent">
                  TripWise
                </span>

              </h1>

              <p className="mt-4 text-sm leading-6 text-[#777079]">
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
                    className="mb-2 block text-sm font-semibold text-[#514952]"
                  >
                    Email address
                  </label>

                  <div className="group relative">

                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a49aa1] transition group-focus-within:text-[#bd6277]"
                    />

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-13 w-full rounded-2xl border border-[#e7dcd6] bg-white/80 pl-11 pr-4 text-sm text-[#302832] outline-none placeholder:text-[#aaa1a8] shadow-sm transition-all duration-300 hover:border-[#d8c9c2] focus:border-[#d78595] focus:bg-white focus:ring-4 focus:ring-[#f3a2ad]/15"
                    />

                  </div>

                </div>


                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-[#514952]"
                    >
                      Password
                    </label>

                    <a
                      href="#"
                      className="text-xs font-bold text-[#ad5b72] transition hover:text-[#815f9d]"
                    >
                      Forgot password?
                    </a>

                  </div>


                  <div className="group relative">

                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a49aa1] transition group-focus-within:text-[#bd6277]"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-13 w-full rounded-2xl border border-[#e7dcd6] bg-white/80 pl-11 pr-12 text-sm text-[#302832] outline-none placeholder:text-[#aaa1a8] shadow-sm transition-all duration-300 hover:border-[#d8c9c2] focus:border-[#d78595] focus:bg-white focus:ring-4 focus:ring-[#f3a2ad]/15"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#9c929b] transition hover:bg-[#f8ecec] hover:text-[#ad5b72]"
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


                {/* Remember me */}
                <div className="flex items-center justify-between">

                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[#756c75]">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#d9ccc6] accent-[#cf7083]"
                    />

                    Remember me

                  </label>

                  <span className="text-xs text-[#a29aa0]">
                    Secure access
                  </span>

                </div>


                {/* Login button */}
                <button
                  type="submit"
                  className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#f08d88] via-[#df7891] to-[#a985df] text-sm font-bold text-white shadow-[0_16px_35px_rgba(205,116,137,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(176,112,150,0.35)] active:translate-y-0"
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


              {/* Divider */}
              <div className="my-7 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#e9dfda]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa0a7]">
                  TripWise
                </span>

                <div className="h-px flex-1 bg-[#e9dfda]" />

              </div>


              {/* Register */}
              <p className="text-center text-sm text-[#827881]">

                Don't have an account?{" "}

                <a
                  href="/register"
                  className="font-bold text-[#a65c72] transition hover:text-[#805e9e]"
                >
                  Create one
                </a>

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Bottom-right caption */}
      <div className="absolute bottom-7 right-8 z-20 hidden text-right text-white/70 lg:block xl:right-12">

        <p className="text-xs uppercase tracking-[0.25em]">
          Explore · Plan · Remember
        </p>

        <div className="mt-2 flex items-center justify-end gap-2 text-xs text-white/50">

          <Globe2 size={13} />

          Your next story awaits

        </div>

      </div>

    </main>
  )
}

export default Login
