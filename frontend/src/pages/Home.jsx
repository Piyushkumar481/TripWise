import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🗺️',
    title: 'Plan Your Adventures',
    description:
      'Organize destinations, create itineraries, and make every trip memorable.',
    color: 'from-cyan-500/20 to-blue-500/5',
  },
  {
    icon: '📅',
    title: 'Stay Organized',
    description:
      'Keep your travel plans, schedules, and important details together.',
    color: 'from-violet-500/20 to-purple-500/5',
  },
  {
    icon: '💰',
    title: 'Track Your Expenses',
    description:
      'Keep an eye on your travel budget and manage your spending.',
    color: 'from-emerald-500/20 to-teal-500/5',
  },
]

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080D1B] text-white">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/[0.08]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold shadow-lg shadow-cyan-500/20">
              T
            </span>

            <div>
              <span className="block text-xl font-bold tracking-tight">
                TripWise
              </span>
              <span className="block text-xs text-slate-400">
                Travel smarter
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white sm:px-5"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 sm:px-5"
            >
              Get Started
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-sm text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Your next adventure starts here
        </div>

        <h1 className="max-w-5xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Explore more.
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Worry less.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
          Your journey deserves better planning. Organize your trips, manage
          your itinerary, track expenses, and bring all your travel essentials
          together in one place.
        </p>

        <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/10 transition hover:-translate-y-1 hover:bg-cyan-300"
          >
            Start Your Journey
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
          >
            Welcome Back? Login
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-500">
          <span>✦ Plan your trips</span>
          <span>✦ Organize itineraries</span>
          <span>✦ Manage your budget</span>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Travel made simpler
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for the journey
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Spend less time managing details and more time looking forward to
            your next destination.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.045] sm:p-8"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-3xl`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold">{feature.title}</h3>

              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-8 lg:px-12">
          <p>
            © {new Date().getFullYear()} TripWise. Made for your next adventure.
          </p>

          <div className="flex gap-5">
            <Link
              to="/login"
              className="transition hover:text-cyan-300"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="transition hover:text-cyan-300"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home