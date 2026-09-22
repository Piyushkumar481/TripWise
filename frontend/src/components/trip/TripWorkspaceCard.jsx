import { ArrowRight } from "lucide-react"

function TripWorkspaceCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-[#e1e7e3] bg-white p-5 text-left shadow-[0_7px_25px_rgba(23,35,60,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-[#b9dfda] hover:shadow-[0_10px_30px_rgba(23,35,60,0.06)]"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-[#e8f7f5] p-2.5">
          <Icon className="h-5 w-5 text-[#087f82]" />
        </div>

        <ArrowRight className="h-4 w-4 text-[#a4afb7] transition duration-200 group-hover:translate-x-1 group-hover:text-[#087f82]" />
      </div>

      <h3 className="mt-5 font-semibold text-[#17233c]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#71808d]">
        {description}
      </p>
    </button>
  )
}

export default TripWorkspaceCard
