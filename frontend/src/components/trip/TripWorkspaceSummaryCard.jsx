import { ArrowRight } from "lucide-react"

function TripWorkspaceSummaryCard({
  icon: Icon,
  title,
  value,
  description,
  progress,
  actionLabel = "Open module",
  onAction,
  loading = false,
}) {
  const numericProgress = Number(progress)

  const safeProgress =
    progress !== undefined &&
    progress !== null &&
    Number.isFinite(numericProgress)
      ? Math.min(100, Math.max(0, numericProgress))
      : null

  return (
    <article className="group rounded-2xl border border-[#e1e7e3] bg-white p-5 shadow-[0_7px_25px_rgba(23,35,60,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-[#b9dcd5]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl border border-[#087f82]/10 bg-[#e8f7f5] text-[#087f82]">
          {Icon && <Icon size={20} />}
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            aria-label={`${actionLabel}: ${title}`}
            className="rounded-lg p-2 text-[#89959e] transition hover:bg-[#e8f7f5] hover:text-[#087f82] focus:outline-none focus:ring-2 focus:ring-[#087f82]/40"
          >
            <ArrowRight size={17} />
          </button>
        )}
      </div>

      <p className="mt-5 text-sm font-medium text-[#71808d]">
        {title}
      </p>

      {loading ? (
        <div
          className="mt-2 h-8 w-2/3 animate-pulse rounded-lg bg-[#e8eeeb]"
          aria-label={`Loading ${title}`}
          role="status"
        />
      ) : (
        <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-[#17233c]">
          {value}
        </p>
      )}

      <p className="mt-2 min-h-10 text-sm leading-5 text-[#71808d]">
        {description}
      </p>

      {safeProgress !== null && (
        <div className="mt-4">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-[#e8eeeb]"
            role="progressbar"
            aria-label={`${title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeProgress}
          >
            <div
              className="h-full rounded-full bg-[#087f82] transition-all duration-500"
              style={{ width: `${safeProgress}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-[#89959e]">
            {safeProgress}% complete
          </p>
        </div>
      )}
    </article>
  )
}

export default TripWorkspaceSummaryCard