import { ArrowLeft } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

function TripModulePage({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  children,
}) {
  const navigate = useNavigate()
  const { trip } = useOutletContext()

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#e1e7e3] bg-gradient-to-br from-white via-white to-[#edf8f6] p-6 shadow-[0_10px_35px_rgba(23,35,60,0.05)] sm:p-7">
        <button
          type="button"
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#71808d] transition hover:text-[#087f82]"
        >
          <ArrowLeft className="h-4 w-4" />
          Trip Overview
        </button>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#e8f7f5] p-3">
              <Icon className="h-6 w-6 text-[#087f82]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#087f82]">
                {eyebrow}
              </p>

              <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#17233c]">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71808d]">
                {description}
              </p>
            </div>
          </div>

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#087f82] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076f72]"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </section>

      {children}
    </div>
  )
}

export default TripModulePage
