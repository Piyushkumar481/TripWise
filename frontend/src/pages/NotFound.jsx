function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-7xl font-bold text-cyan-400">
          404
        </p>

        <h1 className="mt-4 text-3xl font-semibold">
          Page not found
        </h1>

        <p className="mt-3 text-slate-400">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  )
}

export default NotFound
