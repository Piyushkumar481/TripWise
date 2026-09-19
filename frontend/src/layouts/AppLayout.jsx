import { useState } from "react"
import { Outlet } from "react-router-dom"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">

          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1">
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  )
}

export default AppLayout
