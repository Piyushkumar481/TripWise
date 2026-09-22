function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Welcome to
        </p>

        <h1 className="mt-4 text-5xl md:text-6xl font-bold">
          TripWise
        </h1>

        <p className="mt-5 max-w-xl text-slate-400 text-lg">
          Plan your trips, manage your itinerary, track expenses,
          and keep everything about your journey in one place.
        </p>
      </div>
    </div>
  )
}

export default Home
