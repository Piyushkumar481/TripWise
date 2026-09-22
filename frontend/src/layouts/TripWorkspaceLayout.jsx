import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Package,
  Wallet,
} from "lucide-react"
import { NavLink, Outlet, useParams } from "react-router-dom"

const workspaceItems = [
  {
    label: "Overview",
    path: "",
    icon: LayoutDashboard,
  },
  {
    label: "Itinerary",
    path: "itinerary",
    icon: CalendarDays,
  },
  {
    label: "Expenses",
    path: "expenses",
    icon: Wallet,
  },
  {
    label: "Documents",
    path: "documents",
    icon: FileText,
  },
  {
    label: "Packing",
    path: "packing",
    icon: Package,
  },
  {
    label: "Notes",
    path: "notes",
    icon: ClipboardList,
  },
]

function TripWorkspaceLayout() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-[#e1e7e3] bg-white shadow-[0_7px_25px_rgba(23,35,60,0.035)]">
        <nav className="flex min-w-max items-center gap-1 p-2">
          {workspaceItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.label}
                to={
                  item.path
                    ? `/trips/${id}/${item.path}`
                    : `/trips/${id}`
                }
                end={!item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#e8f7f5] text-[#087f82]"
                      : "text-[#71808d] hover:bg-[#f5f8f7] hover:text-[#17233c]"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default TripWorkspaceLayout