import { ArrowRight, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

function DashboardHero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-[#dce7e3] bg-[#eaf7f5] shadow-[0_12px_35px_rgba(23,35,60,0.06)]">

      <img
        src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85"
        alt="Mountain lake destination"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* LIGHT overlay — important */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#effaf8]/100 via-[#effaf8]/90 via-55% to-transparent" />

      <div className="relative z-10 flex min-h-[320px] items-center px-7 py-10 sm:px-10 lg:px-12">

        <div className="max-w-[650px]">

          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-[#80929c]">
            Discover
            <span className="mx-2 text-[#159b9b]">•</span>
            Plan
            <span className="mx-2 text-[#159b9b]">•</span>
            Experience
          </p>

          <h1 className="font-serif text-[40px] font-bold leading-[1.02] tracking-[-0.03em] text-[#17233c] sm:text-[48px] lg:text-[54px]">
            Turn Your Travel
            <br />
            Plans Into{" "}
            <span className="text-[#159b9b]">
              Real Stories
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[15px] leading-6 text-[#5f7180] sm:text-base">
            Organize your trips, manage every detail, and keep
            your memories alive — all in one place.
          </p>

          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-[#159b9b] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_22px_rgba(21,155,155,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#087f82]"
          >
            Explore My Trips

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

        </div>

        <div className="absolute right-8 top-8 hidden lg:flex items-start gap-2.5">

          <MapPin
            size={20}
            className="mt-0.5 text-[#17233c]"
          />

          <div>
            <p className="text-sm font-bold text-[#17233c]">
              Moraine Lake
            </p>

            <p className="text-xs text-[#657785]">
              Canada
            </p>

            <div className="mt-3 h-px w-32 bg-[#17233c]/20" />
          </div>

        </div>

        <div className="absolute bottom-7 right-8 hidden rounded-xl border border-white/70 bg-white/70 px-4 py-3 backdrop-blur-md lg:block">
          <p className="font-serif text-sm italic text-[#536777]">
            “Collect moments,
            <br />
            not things.”
          </p>
        </div>

      </div>
    </section>
  )
}

export default DashboardHero
