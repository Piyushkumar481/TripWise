import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Globe2,
  Wallet,
} from "lucide-react"

const iconMap = {
  trips: CalendarDays,
  countries: Globe2,
  budget: Wallet,
  expenses: BarChart3,
}

const accentMap = {
  trips: "bg-[#e5f7f4] text-[#159b9b]",
  countries: "bg-[#e5f6fa] text-[#1594b0]",
  budget: "bg-[#e9f8ef] text-[#159b7d]",
  expenses: "bg-[#edf0ff] text-[#4d69c8]",
}

function StatCard({
  type,
  label,
  value,
  description,
}) {
  const Icon = iconMap[type] || BarChart3
  const accent = accentMap[type] || accentMap.trips

  return (
    <div className="group rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_6px_22px_rgba(23,35,60,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c5ded9] hover:shadow-[0_14px_32px_rgba(23,35,60,0.08)]">

      <div className="flex items-start justify-between">

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={20} />
        </div>

        <ArrowUpRight
          size={18}
          className="text-[#9eabb4] transition-colors group-hover:text-[#159b9b]"
        />

      </div>

      <div className="mt-5">

        <p className="text-sm font-semibold text-[#536579]">
          {label}
        </p>

        <h3 className="mt-1 text-[28px] font-black tracking-tight text-[#17233c]">
          {value}
        </h3>

        <p className="mt-1 text-xs font-medium text-[#9aa5ae]">
          {description}
        </p>

      </div>

    </div>
  )
}

export default StatCard
