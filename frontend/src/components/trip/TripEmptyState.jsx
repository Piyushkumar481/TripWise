import { ArrowRight } from "lucide-react"

function TripEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-2xl border border-[#e1e7e3] bg-white p-6 shadow-[0_7px_25px_rgba(23,35,60,0.035)]">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl bg-[#f1f5f3] p-3">
          <Icon className="h-5 w-5 text-[#71808d]" />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-[#17233c]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#71808d]">
            {description}
          </p>

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#087f82] transition hover:text-[#065f62]"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripEmptyState
