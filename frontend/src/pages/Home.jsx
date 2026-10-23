import {
  Link } from "react-router-dom"
import { ArrowRight,
  CalendarDays,
  Compass,
  MapPin,
  Plane,
} from "lucide-react"

const highlights = [
  {
    icon: CalendarDays,
    title: "Every plan, together",
    description: "Keep your itinerary close.",
  },
  {
    icon: Compass,
    title: "Explore your way",
    description: "Make each trip your own.",
  },
  {
    icon: MapPin,
    title: "Memories that stay",
    description: "Save the details that matter.",
  },
]

function BrandMark({ compact = false }) {
  return (
    <Link to="/" className="inline-flex min-w-0 items-center gap-3" aria-label="TripWise home">
      <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-[#129c9c] text-white shadow-lg shadow-teal-900/10 ${compact ? "h-10 w-10" : "h-12 w-12"}`}>
        <Plane size={compact ? 19 : 22} strokeWidth={2.3} />
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-extrabold tracking-tight text-[#17233c] sm:text-2xl">
          Trip<span className="text-[#129c9c]">Wise</span>
        </span>
        <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.24em] text-[#86939d]">
          Travel differently
        </span>
      </span>
    </Link>
  )
}

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#17233c]">
      <header className="relative z-20 border-b border-[#e8e9e2] bg-[#fffefa]/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-4 sm:px-7 lg:px-10">
          <BrandMark />
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#667586] transition hover:bg-[#eaf6f4] hover:text-[#087f82] sm:px-5"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#129c9c] px-3.5 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-800/10 transition hover:-translate-y-0.5 hover:bg-[#0b8588] sm:px-5"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-7 pt-5 sm:px-7 sm:pb-10 sm:pt-8 lg:px-10">
        <div className="grid overflow-hidden rounded-[28px] border border-[#e1e7e1] bg-white shadow-[0_24px_70px_-45px_rgba(23,35,60,0.25)] lg:min-h-[590px] lg:grid-cols-[0.94fr_1.06fr]">
          <div className="relative flex min-w-0 flex-col justify-center overflow-hidden bg-gradient-to-br from-[#e9f7f4] via-[#f5f8f3] to-[#f5eadb] px-6 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16">
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#c6e9e3]/55 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[#f3d9bc]/45 blur-2xl" />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cce7e1] bg-white/75 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#078a8d] sm:text-xs">
                <Plane size={14} />
                Your journeys, made simple
              </div>

              <p className="mb-3 font-serif text-base italic text-[#637888] sm:text-lg">
                Travel far enough, you meet yourself.
              </p>

              <h1 className="max-w-xl text-[2.6rem] font-bold leading-[1.06] tracking-[-0.045em] text-[#17233c] sm:text-5xl lg:text-[3.65rem] xl:text-[4rem]">
                Your next journey
                <span className="mt-1 block text-[#129c9c]">starts here.</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#6b7e8c] sm:text-base sm:leading-7">
                Trips, plans and memories. All in one place.
              </p>

              <div className="mt-7 flex flex-col gap-3 min-[400px]:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#129c9c] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#0b8588]"
                >
                  Start planning
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#dce5df] bg-white/85 px-6 py-3 text-sm font-bold text-[#5e7180] transition hover:border-[#9bd2ca] hover:text-[#087f82]"
                >
                  I have an account
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#71848e]">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#129c9c]" />Trips</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#e6b981]" />Itineraries</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8b9be8]" />Memories</span>
              </div>
            </div>
          </div>


          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#dff3ed] via-[#f4f5eb] to-[#f5e6cf] px-5 py-10 sm:min-h-[400px] sm:px-8 lg:min-h-[590px]">
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#a8ddd2]/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-12 h-64 w-64 rounded-full bg-[#f3d5ad]/65 blur-3xl" />
            <div className="pointer-events-none absolute inset-6 rounded-[30px] border border-white/70 sm:inset-8" />

            <div className="absolute left-8 top-8 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#678b87] sm:left-10 sm:top-10">
              <span className="h-2 w-2 rounded-full bg-[#129c9c]" />
              TRIPWISE TRAVEL NOTES
            </div>

            <div className="absolute right-7 top-16 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-[#129c9c] shadow-lg shadow-teal-900/5 sm:right-10 sm:top-12 sm:h-16 sm:w-16">
              <Plane size={27} strokeWidth={1.7} className="-rotate-12" />
            </div>

            <div className="relative w-full max-w-[355px]">
              <div className="absolute -inset-3 rotate-[-5deg] rounded-[30px] border border-white/75 bg-white/25" />

              <div className="relative rounded-[26px] border border-white/90 bg-white/90 p-5 shadow-[0_28px_65px_-32px_rgba(28,75,78,0.28)] backdrop-blur-xl sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#129c9c]">
                      YOUR NEXT CHAPTER
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-[#17233c] sm:text-4xl">
                      Somewhere
                      <span className="block italic text-[#129c9c]">wonderful.</span>
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e5f6f2] text-[#129c9c]">
                    <Compass size={22} strokeWidth={1.7} />
                  </span>
                </div>

                <svg viewBox="0 0 320 54" className="mt-5 h-12 w-full" fill="none" aria-hidden="true">
                  <path d="M8 39 C54 39,66 9,111 19 S173 50,220 22 S276 11,311 20" stroke="#9bcfc5" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 7" />
                  <circle cx="8" cy="39" r="5" fill="#129c9c" />
                  <circle cx="311" cy="20" r="5" fill="#e1b47e" />
                </svg>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#eff8f5] p-3.5">
                    <MapPin size={18} className="text-[#129c9c]" />
                    <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#7d9994]">Discover</p>
                    <p className="mt-1 text-sm font-bold text-[#17233c]">New places</p>
                  </div>
                  <div className="rounded-2xl bg-[#faf3e8] p-3.5">
                    <CalendarDays size={18} className="text-[#bd8c4e]" />
                    <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#a68d6e]">Organize</p>
                    <p className="mt-1 text-sm font-bold text-[#17233c]">Your plans</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-[#e8eee8] pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#129c9c] text-white">
                    <Plane size={17} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#17233c]">Ready when you are.</p>
                    <p className="mt-0.5 text-[10px] text-[#819099]">Plan a little. Explore a lot.</p>
                  </div>
                  <Compass size={19} className="ml-auto text-[#9bbdb5]" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-7 left-7 hidden items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2.5 text-[10px] font-bold text-[#607e7a] shadow-sm backdrop-blur sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#d9b17a]" />
              MADE FOR THE WAY YOU EXPLORE
            </div>
          </div>
        </div>

        <div className="grid gap-3 pt-4 sm:grid-cols-3 sm:gap-4 sm:pt-5">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#e5e8e1] bg-white/85 p-4 sm:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f6f2] text-[#129c9c]">
                <Icon size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#17233c]">{title}</span>
                <span className="mt-1 block text-xs text-[#86939d]">{description}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-5 pb-6 text-xs text-[#8b969c] sm:flex-row sm:px-10">
        <BrandMark compact />
        <p>Plan a little. Explore a lot.</p>
      </footer>
    </main>
  )
}

export default Home
