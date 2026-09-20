import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Sprout,
} from "lucide-react"

import { useAuth } from "../context/AuthContext"

function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  const firstName =
    user?.fullName?.split(" ")[0] || "Traveler"

  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-[#e6eae6] bg-white">

      <div className="flex h-full items-center justify-between px-5 sm:px-7 lg:px-9">

        {/* MOBILE MENU */}
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-[#596777] transition hover:bg-[#f1f5f3] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        {/* TRAVEL MESSAGE */}
        <div className="hidden items-center gap-3 md:flex">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f7f5] text-[#159b9b]">
            <Sprout size={19} />
          </div>

          <p className="font-serif text-[17px] italic text-[#49627a]">
            Travel far enough, you meet yourself.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-3">

          {/* SEARCH */}
          <div className="hidden h-11 w-[315px] items-center gap-3 rounded-full border border-[#e0e5e1] bg-[#fbfcfb] px-5 lg:flex">

            <Search
              size={19}
              className="text-[#718090]"
            />

            <input
              type="text"
              placeholder="Search destinations, trips..."
              className="w-full bg-transparent text-sm text-[#17233c] outline-none placeholder:text-[#9ba3ad]"
            />

          </div>

          {/* NOTIFICATION */}
          <button
            className="relative rounded-xl p-2.5 text-[#657383] transition hover:bg-[#f1f5f3]"
            aria-label="Notifications"
          >

            <Bell size={21} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef806d] ring-2 ring-white" />

          </button>

          <div className="hidden h-7 w-px bg-[#e5e9e5] sm:block" />

          {/* PROFILE */}
          <button
            className="flex items-center gap-2.5 rounded-full px-1.5 py-1 transition hover:bg-[#f4f6f4]"
            aria-label="Profile"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3e8ff] text-sm font-black text-[#4659aa]">
              {(user?.fullName || "T").charAt(0).toUpperCase()}
            </div>

            <span className="hidden text-sm font-bold text-[#17233c] sm:block">
              {firstName}
            </span>

            <ChevronDown
              size={16}
              className="hidden text-[#75808c] sm:block"
            />

          </button>

        </div>

      </div>

    </header>
  )
}

export default Navbar
