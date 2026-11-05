import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import AITravelChat from "../pages/AITravelChat"

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!sidebarOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [sidebarOpen])

  const itineraryMatch = location.pathname.match(
    /^\/ai-itinerary\/(\d+)\/?$/
  )

  const itineraryId = itineraryMatch?.[1] ?? null

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#17233c]">

      <div className="flex min-h-screen">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">

          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />

          <main className="min-h-0 min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>

      </div>

      <AITravelChat itineraryId={itineraryId} />

    </div>
  )
}

export default AppLayout

