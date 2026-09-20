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

import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const navigationItems = [
  {
    label: "My Trips",
    icon: Plane,
    path: "/trips",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
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
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#17233c]/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[275px] flex-col
          border-r border-[#e5e9e5] bg-white
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* BRAND */}
        <div className="flex h-[90px] items-center border-b border-[#edf0ed] px-7">

          <NavLink
            to="/trips"
            onClick={onClose}
            className="flex items-center gap-3"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#159b9b] text-white shadow-[0_8px_20px_rgba(21,155,155,0.2)]">
              <Plane size={25} strokeWidth={2.3} />
            </div>

            <div>
              <div className="text-[23px] font-black tracking-[-0.06em] text-[#17233c]">
                Trip<span className="text-[#159b9b]">Wise</span>
              </div>

              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8c969f]">
                Travel differently
              </div>
            </div>

          </NavLink>

          <button
            onClick={onClose}
            className="ml-auto rounded-xl p-2 text-[#687584] hover:bg-[#f2f6f4] lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-7">

          <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#9aa3ab]">
            Explore
          </p>

          <div className="space-y-1.5">

            {navigationItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    relative flex items-center gap-4 rounded-xl
                    px-4 py-3.5 text-[15px] font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#e8f7f5] text-[#087f82]"
                        : "text-[#637182] hover:bg-[#f5f7f5] hover:text-[#17233c]"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 h-7 w-1 rounded-r-full bg-[#159b9b]" />
                      )}

                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={
                          isActive
                            ? "text-[#159b9b]"
                            : "text-[#748293]"
                        }
                      />

                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}

          </div>

        </nav>

        {/* USER */}
        <div className="border-t border-[#edf0ed] px-5 py-5">

          <div className="mb-4 flex items-center gap-3 px-2">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4e9ff] text-sm font-black text-[#4659a9]">
              {(user?.fullName || "P").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-[#17233c]">
                {user?.fullName || "Traveler"}
              </p>

              <p className="truncate text-xs text-[#7e8995]">
                {user?.email || ""}
              </p>

            </div>

          </div>

          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#687583] transition hover:bg-[#f4f6f4] hover:text-[#17233c]"
          >
            <Settings size={19} />
            Settings
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#687583] transition hover:bg-[#fff1ee] hover:text-[#df6955]"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

        {/* TRAVEL CARD */}
        <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-[#eef8f6]">

          <div className="px-4 pt-4">

            <p className="font-serif text-[16px] italic leading-5 text-[#168083]">
              Collect moments,
              <br />
              not things.
            </p>

          </div>

          <div
            className="mt-3 h-16 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=75')",
            }}
          />

        </div>

      </aside>
    </>
  )
}

export default Sidebar
