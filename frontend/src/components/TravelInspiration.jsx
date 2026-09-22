function TravelInspiration() {
  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-[#dce5e1] bg-[#eaf4f2] shadow-[0_7px_25px_rgba(23,35,60,0.035)]">

      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
        alt="Coastal travel destination"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#edf8f5]/100 via-[#edf8f5]/88 to-transparent" />

      <div className="relative z-10 max-w-[360px] px-7 py-7 sm:px-8">

        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#829198]">
          Travel Inspires
        </p>

        <h3 className="mt-4 font-serif text-[30px] font-bold leading-[1.02] text-[#17233c]">
          Collect Moments,
          <br />
          Not Things.
        </h3>

        <div className="mt-5 h-px w-8 bg-[#159b9b]" />

        <p className="mt-4 text-sm leading-6 text-[#667582]">
          Every destination has a story.
          What will your next one be?
        </p>

      </div>

    </div>
  )
}

export default TravelInspiration
