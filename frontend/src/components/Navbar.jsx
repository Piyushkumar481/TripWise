import { Bell, Menu, User } from "lucide-react"

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">

        {/* Mobile menu + logo */}
        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/20">
              <span className="text-lg">✈</span>
            </div>

            <span className="text-lg font-bold tracking-tight text-white">
              Trip<span className="text-cyan-400">Wise</span>
            </span>
          </div>

        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          <button
            className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <button
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/10"
            aria-label="Profile"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 ring-1 ring-cyan-400/20">
              <User size={18} className="text-cyan-400" />
            </div>

            <span className="hidden text-sm font-medium text-slate-300 sm:block">
              Profile
            </span>
          </button>

        </div>

      </div>
    </header>
  )
}

export default Navbar

