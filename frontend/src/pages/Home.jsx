import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    icon: '✈',
    title: 'Your next adventure',
    description:
      'Bring your travel dreams to life. Organize destinations and turn ideas into unforgettable journeys.',
    color: 'bg-rose-50 text-rose-500',
  },
  {
    number: '02',
    icon: '♡',
    title: 'Every detail, together',
    description:
      'Keep your itineraries, travel schedules, and important plans beautifully organized in one place.',
    color: 'bg-purple-50 text-purple-500',
  },
  {
    number: '03',
    icon: '✧',
    title: 'Travel without the stress',
    description:
      'Track your expenses, manage your budget, and spend more time enjoying the places you visit.',
    color: 'bg-orange-50 text-orange-500',
  },
]

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf7] text-[#30252e]">

      {/* Navigation */}
      <header className="relative z-20">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-10 lg:px-16">

          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f68b91] to-[#ad82df] text-2xl font-bold text-white shadow-lg shadow-rose-200/60">
              T
            </span>

            <div>
              <span className="block text-xl font-extrabold tracking-tight">
                TripWise
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#a08c98]">
                Your journey, beautifully planned
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-5">
            <Link
              to="/login"
              className="rounded-xl px-3 py-3 text-sm font-semibold text-[#665560] transition hover:text-[#d56e87] sm:px-5"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-[#f48b91] to-[#c17bd2] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200/50 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:px-6"
            >
              Get Started <span className="ml-1">↗</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-8 lg:px-12 lg:pb-20">

        <div className="grid overflow-hidden rounded-[28px] border border-[#f0e4e0] bg-white shadow-[0_25px_90px_-40px_rgba(164,100,115,0.25)] lg:min-h-[640px] lg:grid-cols-[0.92fr_1.08fr]">

          {/* Left content */}
          <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#fff5f1] via-white to-[#fbf1ff] px-7 py-14 sm:px-12 sm:py-16 lg:px-14 xl:px-16">

            <div className="absolute -left-16 top-20 h-44 w-44 rounded-full bg-rose-200/20 blur-3xl" />

            <div className="relative">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f5dedf] bg-white/80 px-4 py-2.5 text-xs font-semibold tracking-wide text-[#c56880] shadow-sm sm:text-sm">
                <span className="text-base">✧</span>
                YOUR NEXT GREAT ESCAPE STARTS HERE
              </div>

              <p className="mb-4 text-sm font-semibold tracking-wide text-[#c56880] sm:text-base">
                Life is better when you explore.
              </p>

              <h1 className="max-w-2xl text-[42px] font-extrabold leading-[1.12] tracking-[-0.045em] sm:text-6xl xl:text-[68px]">
                The world is
                <br />
                waiting for
                <br />
                <span className="bg-gradient-to-r from-[#ed858d] via-[#d574a1] to-[#a57ade] bg-clip-text text-transparent">
                  your next story.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-[#887782] sm:text-lg">
                Dream of somewhere beautiful. We'll help you plan the journey.
                Organize your trips, manage your itinerary, and keep every
                little detail together — so you can focus on making memories.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#f38b91] to-[#c17bd2] px-7 py-4 font-bold text-white shadow-xl shadow-rose-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  Start Your Journey
                  <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#eee0e1] bg-white/80 px-7 py-4 font-semibold text-[#6e5968] transition duration-300 hover:border-[#e8b1bd] hover:bg-white"
                >
                  I have an account
                  <span>↗</span>
                </Link>

              </div>

              {/* Small trust statement */}
              <div className="mt-9 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#f9d5cb] text-sm">
                    🌸
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#e8d8f5] text-sm">
                    🌍
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#fbe5b8] text-sm">
                    ✈️
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#9b8993] sm:text-sm">
                  <span className="block font-semibold text-[#665560]">
                    Your adventures, your way.
                  </span>
                  One place for all your travel plans.
                </p>
              </div>

            </div>
          </div>

          {/* Right-side travel photograph */}
          <div className="group relative min-h-[430px] overflow-hidden sm:min-h-[550px] lg:min-h-full">

            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1800&q=85"
              alt="Beautiful mountain lake surrounded by scenic landscapes"
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105"
            />

            {/* Warm image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#38212e]/70 via-[#38212e]/5 to-[#38212e]/15" />

            {/* Top image label */}
            <div className="absolute left-5 top-5 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md sm:left-8 sm:top-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bb718b]">
                A little inspiration
              </p>
              <p className="mt-1 text-sm font-bold text-[#42323d]">
                Somewhere wonderful awaits.
              </p>
            </div>

            {/* Bottom image caption */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">

              <div className="rounded-[26px] border border-white/30 bg-white/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl text-[#d77c9d]">✦</span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b86d87]">
                    Collect moments, not worries
                  </p>
                </div>

                <h2 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-[#3a2b37] sm:text-3xl">
                  Less planning stress.
                  <br />
                  More{' '}
                  <span className="text-[#cf7599]">
                    beautiful memories.
                  </span>
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#806e79] sm:text-base">
                  Your next adventure is more than a destination. It's a story
                  waiting to unfold.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#bd708b]">
                  <span>Make room for wonder</span>
                  <span>♡</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-6 sm:px-10 lg:px-16">

        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#ca7891] sm:text-sm">
              Made for your next adventure
            </p>

            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-[#382b36] sm:text-4xl lg:text-5xl">
              Everything in place.
              <br className="hidden sm:block" />
              <span className="text-[#c67ba0]">
                Room for wonder.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#927f8b] sm:text-base">
            A little more organization, a little less stress, and a lot more
            time to enjoy the places you've been dreaming about.
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {features.map((feature) => (
            <article
              key={feature.number}
              className="group rounded-[26px] border border-[#f0e4e1] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#e8c7d0] hover:shadow-xl hover:shadow-rose-100/40 sm:p-8"
            >

              <div className="mb-8 flex items-center justify-between">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.color}`}
                >
                  {feature.icon}
                </span>

                <span className="text-sm font-semibold tracking-widest text-[#d9c7ce]">
                  {feature.number}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#443441]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#92818b] sm:text-base">
                {feature.description}
              </p>

              <div className="mt-6 h-1 w-10 rounded-full bg-gradient-to-r from-[#f38b91] to-[#bd83d8] transition-all duration-300 group-hover:w-20" />

            </article>
          ))}

        </div>

        {/* Final call to action */}
        <div className="mt-12 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#fff0ec] via-[#fff6f5] to-[#f7efff] px-6 py-10 text-center sm:px-10 sm:py-14">

          <p className="text-sm font-semibold tracking-wide text-[#c37b91]">
            YOUR NEXT CHAPTER BEGINS WITH A PLAN
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-[#3c2c39] sm:text-4xl">
            That trip you've been dreaming about?
            <span className="mt-2 block text-[#cc789a]">
              Let's make it happen.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#927f8b] sm:text-base">
            Start organizing your next adventure with TripWise. Your future
            self — and your travel memories — will thank you.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#f38b91] to-[#bd80d5] px-8 py-4 font-bold text-white shadow-lg shadow-rose-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Let's Plan Something Beautiful
            <span className="text-xl">→</span>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#f0e4e1] bg-white/70">

        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-7 sm:px-10 md:flex-row lg:px-16">

          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#f38b91] to-[#bd80d5] font-bold text-white">
              T
            </span>

            <span className="font-bold text-[#463543]">
              TripWise
            </span>
          </Link>

          <p className="text-center text-xs text-[#a18e98] sm:text-sm">
            Made for curious hearts and journeys worth remembering. ♡
          </p>

          <div className="flex gap-5 text-sm font-medium text-[#806c79]">
            <Link
              to="/login"
              className="transition hover:text-[#d37491]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="transition hover:text-[#d37491]"
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