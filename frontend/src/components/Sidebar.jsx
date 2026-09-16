import {
  CalendarDays,
  CheckSquare,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Plane,
  Settings,
  Wallet,
  X,
} from "lucide-react"

const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "My Trips",
    icon: Plane,
    path: "/trips",
  },
  {
    label: "Itinerary",
    icon: CalendarDays,
    path: "/itinerary",
  },
  {
    label: "Expenses",
    icon: Wallet,
    path: "/expenses",
  },
  {
    label: "Documents",
    icon: FolderOpen,
    path: "/documents",
  },
  {
    label: "Packing",
    icon: CheckSquare,
    path: "/packing",
  },
  {
    label: "Notes",
    icon: FileText,
    path: "/notes",
  },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col
          border-r border-white/10 bg-slate-950
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/20">
              <span className="text-lg">✈</span>
            </div>

            <span className="text-lg font-bold tracking-tight text-white">
              Trip<span className="text-cyan-400">Wise</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Travel
          </p>

          <div className="space-y-1">

            {navigationItems.map((item) => {
              const Icon = item.icon

              return (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-cyan-400/10 hover:text-white"
                >
                  <Icon
                    size={19}
                    className="transition-colors group-hover:text-cyan-400"
                  />

                  <span>{item.label}</span>
                </a>
              )
            })}

          </div>

        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 p-4">

          <a
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <Settings size={19} />
            Settings
          </a>

          <button
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </aside>
    </>
  )
}

export default Sidebar

